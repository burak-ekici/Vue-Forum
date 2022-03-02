import db from "@/config/firebase";
import {
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
  setDoc,
  query,
  collection,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

import {
  docToResource,
  makeAppendChildToParentMutation,
  findById,
  makeFetchItemAction,
  makeFetchItemsAction
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
    usersAllPosts:[],
    userAllThreads:[]
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id);

        if (!user) {
          return null;
        }

        return {
          ...user,
          // le "get" permet juste de pouvoir appelé la fonction avec authUser.Posts
          // au lieu de authUser.Posts() sans le get  ... juste bon à savoir mais pas obligatoire
          get posts() {
            return rootState.posts.items.filter(
              (post) => post.userId === user.id
            );
          },
          get postsCount() {
            return rootState.posts.items.length || 0;
          },
          get threads() {
            return rootState.threads.items.filter(
              (post) => post.userId === user.id
            );
          },
          get threadsCount() {
            return rootState.threads.items.length || 0;
          },
        };
      };
    },
    usersAllThreads :(state)=>{
      return state.userAllThreads
    }
  },
  actions: {
    async createUser(context, { id, email, name, username, avatar = null }) {
      const registeredAt = serverTimestamp();
      const usernameLower = username.toLowerCase();
      const mail = email.toLowerCase();
      const user = {
        avatar,
        mail,
        username,
        usernameLower,
        registeredAt,
        name,
      };
      const userRef = await doc(db, "users", id);
      await setDoc(userRef, user);
      const newUser = await getDoc(userRef);
      context.commit(
        "setItem",
        { resource: "users", item: newUser },
        { root: true }
      );
      return docToResource(newUser);
    },
    async updateUser(context, user) {
      const updates = {
        avatar: user.avatar || null, // firebase n'aime pas undefined, donc si la valeur est pas definie, donner null en valeur
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null,
      };
      const userRef = doc(db, "users", user.id);

      await updateDoc(userRef, updates);

      context.commit(
        "setItem",
        { resource: "users", item: user },
        { root: true }
      );
    },
    async usersPostsCount(context, { userId  }) {
      const q = query(collection(db, "posts"), where("userId", "==", userId));
      const usersPosts = await getDocs(q);
      const usersPostsArray = []
      usersPosts.forEach((el) => {
        const data = { ...el.data(), id: el.id };
        context.commit("setToUsersAllPostsInUsersState", { item : data} , { root: true })
        usersPostsArray.push({ userId, data });
      });
      return usersPostsArray;
    },
    async usersThreadsCount(context , {userId}){
      const q = query(collection(db, "threads"), where("userId", "==", userId));
      const usersThreads = await getDocs(q);
      const usersThreadsArray = []
      usersThreads.forEach((el) => {
        const data = { ...el.data(), id: el.id };
        context.commit("setToUsersAllThreadsInUsersState", { item : data} , { root: true })
        usersThreadsArray.push({ userId, data });
      });
      return usersThreadsArray;
    },
    fetchUser: makeFetchItemAction({ resource: 'users' }),
    fetchUsers: makeFetchItemsAction({ resource: 'users' }),
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
  },
};
