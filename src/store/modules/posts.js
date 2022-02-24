import db from "@/config/firebase";
import {
  doc,
  increment,
  collection,
  serverTimestamp,
  getDoc,
  arrayUnion,
  writeBatch,
  updateDoc,
} from "firebase/firestore";

export default {
  namespaced : true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    async createPost({commit, state , rootState}, post) {
      post.userId = rootState.auth.authId;
      post.publishedAt = serverTimestamp();
      const batch = writeBatch(db);
      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      const userRef = doc(db, "users", rootState.auth.authId);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id), // ArrayUnion permet d'ajouter un element dans le tableau et non de supprimer tout et remplacer par la valeur que l'on met
        contributors: arrayUnion(rootState.auth.authId),
      });
      batch.update(userRef, {
        postsCount: increment(1),
      });
      await batch.commit();
      const newPost = await getDoc(postRef);
      // const newPost = await addDoc(collection(db, "posts"), {
      //     ...post
      // });
      // const threadToEdit = doc(db, "threads", post.threadId);
      // await updateDoc(threadToEdit, {
      //     posts:  arrayUnion(newPost.id), // ArrayUnion permet d'ajouter un element dans le tableau et non de supprimer tout et remplacer par la valeur que l'on met
      //     contributors :  arrayUnion(context.state.authId)
      // });
      commit("setItem", {
        resource: "posts",
        item: { ...newPost.data(), id: newPost.id },
      }, {root:true});
      commit("threads/appendPostToThread", {
        childId: newPost.id,
        parentId: post.threadId,
      }, {root:true});
      commit("threads/appendContributorToThread", {
        childId: rootState.auth.authId,
        parentId: post.threadId,
      }, {root:true});
    },
    async updatePost({commit, state , rootState}, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false,
        },
      };
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, post);
      const updatedPost = await getDoc(postRef);
      commit("setItem", { resource: "posts", item: updatedPost }, {root:true});
    },
    fetchPost: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { resource: "posts", id }, {root:true}),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { resource: "posts", ids } ,{root:true}),
    resetPosts(context) {
      context.commit("resetStorePosts");
    },
  },
  mutations: {
    resetStorePosts(state) {
      state.items = [];
    },
  },
};
