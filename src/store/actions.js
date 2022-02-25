import db from "../config/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

export default {
  async fetchItem(context, { resource, id, handleUnsubscribe = null }) {
    const item = doc(db, resource, id);
    const itemSnap = await getDoc(item);
    let itemToReturn = { ...itemSnap.data(), id: itemSnap.id };
    const unsubscribe = onSnapshot(doc(db, resource, id), (doc) => {
      if (doc.exists) {
        itemToReturn = { ...doc.data(), id: doc.id };
        context.commit("setItem", { resource, item: itemToReturn });
        return itemToReturn;
      } else {
        return null;
      }
    });
    context.commit("setItem", { resource, item: itemToReturn });
    if (handleUnsubscribe) {
      handleUnsubscribe(unsubscribe);
    } else {
      context.commit("appendUnsubscribe", { unsubscribe });
    }
    return itemToReturn;
  },
  fetchItems({ dispatch }, { ids, resource }) {
    return Promise.all(
      ids.map((id) => dispatch("fetchItem", { id, resource }))
    );
  },
  async unsubscribeAllSnapshots(context) {
    context.state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    context.commit("resetUnsubscribes");
  },
};
