import db from "@/config/firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced : true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({ resource: 'categories' }),
    async fetchAllCategories(context) {
      const categories = [];
      // recupere tous les threads de firebase
      const allCategories = await getDocs(collection(db, "categories"));
      allCategories.forEach((document) => {
        const item = { id: document.id, ...document.data() };
        context.commit("setItem", { resource: "categories", item }, {root:true});
        categories.push({ ...document.data() });
        onSnapshot(doc(db, "categories", document.id), (el) => {
          const item = { id: el.id, ...el.data() };
          context.commit("setItem", { resource: "categories", item }, {root:true});
          const index = categories.indexOf(el.data());
          if (index != -1) {
            categories.push({ ...el.data() });
          } else {
            categories[index] = { ...el.data() };
          }
        });
      });
      return categories;
    },
  },
  mutations: {},
};
