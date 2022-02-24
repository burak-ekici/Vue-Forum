import db from "@/config/firebase";
import {
  doc,
  query,
  where,
  collection,
  getDocs,
  getDoc,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default {
  namespaced : true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null,
  },
  getters: {
    authUser: (state, getters , rootState , rootGetters) => {  // permet davoir acces aux getters des autres modules
      return rootGetters['users/user'](state.authId);
    },
  },
  actions: {
    initAuthentication({ dispatch, commit, state }) {
      // permet de verifier avant chaque route si l'utilisateur est conencté ou non
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe(); // authObserverUnsubscribe est null par default , mais si quelqu'un est log, il contien un observer renvoyé par onAuthStateChange, en l'appelant il annule l'observer comme avec l'id de setInterval()
      return new Promise((resolve) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          this.dispatch("auth/unsubscribeAuthUserSnapshot");
          if (user) {
            await this.dispatch("auth/fetchAuthUser");
            resolve(user);
          } else {
            resolve(null);
          }
        });
        commit("setAuthObserverUnsubscribe", unsubscribe);
      });
    },
    async registerUserWithEmailAndPassword(
      context,
      { avatar = null, email, name, username, password }
    ) {
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await context.dispatch("users/createUser", {
        id: result.user.uid,
        email,
        avatar,
        name,
        username,
      }, {root:true});
    },
    signInWithEmailAndPassword(context, { email, password }) {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password);
    },
    async signInWithGoogle(context) {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists) {
        return context.dispatch("users/createUser", {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          username: user.email,
          avatar: user.photoURL,
        },{root:true});
      }
    },
    async signOut(context) {
      const auth = await getAuth();
      await auth.signOut();
      context.commit("setAuthId", null);
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) return; //empeche une erreur s'il n'y a pas d'user connecté

      await dispatch("fetchItem", {
        resource: "users",
        id: userId,
        handleUnsubscribe: (unsubscribe) => {
          commit("setAuthUserUnsubscribe", unsubscribe);
        },
      }, {root:true});
      commit("setAuthId", userId);
    },
    async fetchAuthUsersThreads({ commit, state }) {
      const ref = collection(db, "threads");
      const q = query(ref, where("userId", "==",  state.authId));
      const posts = await getDocs(q);
      posts.forEach((item) => {
        commit("setItem", { resource: "threads", item }, {root:true});
      });
    },
    async fetchAuthUsersPosts({ commit, state } , {startAfterThisPost , postsFromComponent}) {
      const ref = collection(db, "posts");
      let posts = postsFromComponent || [];
      if(!startAfterThisPost){
        let q = query(ref, where("userId", "==", state.authId), orderBy('publishedAt','desc'), limit(5));
        posts = await getDocs(q);
        posts.forEach((item) => {
          commit("setItem", { resource: "posts", item }, {root:true});
        });
      }else{
        const lastVisiblePost = posts.docs[posts.docs.length -1]
        const nextQuery = query(ref, where("userId", "==", state.authId), orderBy('publishedAt','desc'),startAfter(lastVisiblePost), limit(5));
        posts = await getDocs(nextQuery)
        posts.forEach((item) => {
          commit("setItem", { resource: "posts", item }, {root:true});
        });
      }
      return posts
      
    },
    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit("setAuthUserUnsubscribe", null);
      }
    },
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id;
    },
    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },
    setAuthObserverUnsubscribe(state, unsubscribe) {
      state.setAuthObserverUnsubscribe = unsubscribe;
    },
  },
};
