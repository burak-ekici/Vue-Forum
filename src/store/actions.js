import db from "../config/firebase";
import { doc, onSnapshot, getDoc} from "firebase/firestore";
import {findById} from '@/helpers'


export default {
  async fetchItem({ state, commit }, { resource, id, handleUnsubscribe = null, once = false , onSnapshott = null  }) {
    const item = doc(db, resource, id);
    const itemSnap = await getDoc(item);
    let itemToReturn = { ...itemSnap.data(), id: itemSnap.id };
    const unsubscribe = onSnapshot(doc(db, resource, id), (doc) => {
      if(once){
        unsubscribe()
      }
      if (doc.exists) {
        itemToReturn = { ...doc.data(), id: doc.id };
        let previousItem = findById(state[resource].items, id)
        previousItem = previousItem ? { ...previousItem } : null
        if (typeof onSnapshott === 'function') {
          const isLocal = doc.metadata.hasPendingWrites
          onSnapshott({ item: { ...item }, previousItem, isLocal })
        }
        commit("setItem", { resource, item: itemToReturn });

      } else {
        return null;
      }
    });
    commit("setItem", { resource, item: itemToReturn });
    if (handleUnsubscribe) {
      handleUnsubscribe(unsubscribe);
    } else {
      commit("appendUnsubscribe", { unsubscribe });
    }
    return itemToReturn;
  },
  fetchItems({ dispatch }, { ids, resource , onSnapshott = null }) {
    return Promise.all(
      ids.map((id) => dispatch("fetchItem", { id, resource }))
    );
  },
  async unsubscribeAllSnapshots(context) {
    context.state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    context.commit("resetUnsubscribes");
  },
};
