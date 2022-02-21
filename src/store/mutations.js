import {findById, upsert , docToResource} from "@/helpers"

export default {
    setItem(state, {resource ,item}){
        upsert(state[resource], docToResource(item))
    },
    
    appendUnsubscribe(state , { unsubscribe }){
        state.unsubscribe.push(unsubscribe)
    },
    resetUnsubscribes(state){
        state.unsubscribe = []
    },
    
    
}


