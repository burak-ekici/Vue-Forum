import db from "../config/firebase";
import {
  doc,
  increment,
  query,
  where,
  collection,
  serverTimestamp,
  getDocs,
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
    async createPost(context, post) {
      post.userId = context.state.authId;
      post.publishedAt = serverTimestamp();
      const batch = writeBatch(db);
      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      const userRef = doc(db, "users", context.state.authId);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id), // ArrayUnion permet d'ajouter un element dans le tableau et non de supprimer tout et remplacer par la valeur que l'on met
        contributors: arrayUnion(context.state.authId),
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
      context.commit("setItem", {
        resource: "posts",
        item: { ...newPost.data(), id: newPost.id },
      });
      context.commit("appendPostToThread", {
        childId: newPost.id,
        parentId: post.threadId,
      });
      context.commit("appendContributorToThread", {
        childId: context.state.authId,
        parentId: post.threadId,
      });
    },
    async updatePost(context, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: context.state.authId,
          moderated: false,
        },
      };
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, post);
      const updatedPost = await getDoc(postRef);
      context.commit("setItem", { resource: "post", item: updatedPost });
    },
    fetchPost: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { resource: "posts", id }),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { resource: "posts", ids }),
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
