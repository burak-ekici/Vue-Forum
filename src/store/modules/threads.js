import {
  findById,
  docToResource,
  makeAppendChildToParentMutation,
} from "@/helpers";
import db from "../config/firebase";
import {
  doc,
  collection,
  serverTimestamp,
  getDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";

export default {
  namespaced : true,
  state: {
    items: [], // state.threads.items
  },

  getters: {
    thread: (state) => {
      // on ne peux pas donner des parametre dans un getter
      // c'est pourquoi on lui renvoie une function qui prendra le parametre
      return (id) => {
        const thread = findById(state.items, id);

        if (!thread) return {};

        return {
          ...thread,

          get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts?.length > 0 ? thread.posts.length - 1 : 0;
          },
          get contributorsCount() {
            if (thread.contributors?.length) {
              return thread.contributors.length;
            } else {
              return "0";
            }
          },
        };
      };
    },
  },

  actions: {
    async createThread(context, { text, title, forumId }) {
      const userId = context.state.authId;
      const publishedAt = serverTimestamp();
      const threadRef = doc(collection(db, "threads")); // genere un random ID que l'on peux utiliser avecv threadRef.id
      const thread = { forumId, title, publishedAt, userId, id: threadRef.id };
      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);
      const forumRef = doc(db, "forums", forumId);
      batch.set(threadRef, thread);
      batch.update(userRef, {
        threads: arrayUnion(threadRef.id),
      });
      batch.update(forumRef, {
        threads: arrayUnion(threadRef.id),
      });
      await batch.commit();
      const newThread = await getDoc(threadRef);
      context.commit("setItem", {
        resource: "threads",
        item: { ...newThread.data(), id: newThread.id },
      });
      context.commit("appendThreadToUser", {
        parentId: userId,
        childId: threadRef.id,
      });
      context.commit("appendThreadToForum", {
        parentId: forumId,
        childId: threadRef.id,
      });
      // dispatch car la method createPost est dans action
      // commit car la method est dans mutation
      await context.dispatch("createPost", { text, threadId: threadRef.id });
      return findById(context.state.items, threadRef.id);
    },

    async updateThread(context, { title, text, id }) {
      const thread = findById(context.state.items, id);
      const post = findById(context.state.posts, thread.posts[0]);
      let newThread = { ...thread, title };
      let newPost = { ...post, text };
      const threadRef = doc(db, "threads", id);
      const postRef = doc(db, "posts", post.id);
      const batch = writeBatch(db);
      batch.update(threadRef, newThread);
      batch.update(postRef, newPost);
      await batch.commit();
      newThread = await getDoc(threadRef);
      newPost = await getDoc(postRef);
      context.commit("setItem", { resource: "threads", item: newThread });
      context.commit("setItem", { resource: "posts", item: newPost });
      return docToResource(newThread);
    },

    fetchThreads: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { resource: "threads", ids }),

    fetchThread: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { resource: "threads", id }),

    resetThreads(context) {
      context.commit("resetStoreThreads");
    },
  },

  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),

    appendContributorToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),

    resetStoreThreads(state) {
      state.threads = [];
    },
  },
};
