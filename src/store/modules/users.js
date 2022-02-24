import db from "@/config/firebase";
import {
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { docToResource , makeAppendChildToParentMutation , findById} from "@/helpers";

export default {
  namespaced : true,
  state: {
    items: [],
  },
  getters: {
    user: (state , getters , rootState) => {
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
            return rootState.posts.items.filter((post) => post.userId === user.id);
          },
          get postsCount() {
            return this.posts.length || 0;
          },
          get threads() {
            return rootState.threads.items.filter((post) => post.userId === user.id);
          },
          get threadsCount() {
            return this.threads.length || 0;
          },
        };
      };
    },
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
      context.commit("setItem", { resource: "users", item: newUser }, { root : true });
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

      context.commit("setItem", { resource: "users", item: user } , {root : true });
    },
    fetchUser: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { resource: "users", id },{ root : true }),
    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { resource: "users", ids },{ root : true }),
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
  },
};
