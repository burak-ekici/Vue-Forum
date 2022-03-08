import {findById, upsert , docToResource} from "@/helpers"

export default {
    setItem(state, {resource ,item}){
        upsert(state[resource].items, docToResource(item))
    },
    
    appendUnsubscribe(state , { unsubscribe }){
        state.unsubscribe.push(unsubscribe)
    },
    resetUnsubscribes(state){
        state.unsubscribe = []
    },
    setToUsersAllPostsInUsersState(state, {item}){
        const index = state.users.usersAllPosts.findIndex( p => p.id === item.id)
        if(item.id && index !== -1){ // permet de metre a jour un post ou autres existant
            state.users.usersAllPosts[index] = item
        }else{
            state.users.usersAllPosts.push(item) // permet de creer un nouveau post ou autres
        }
    },
    setToUsersAllThreadsInUsersState(state, {item}){
        const index = state.users.userAllThreads.findIndex( p => p.id === item.id)
        if(item.id && index !== -1){ // permet de metre a jour un post ou autres existant
            state.users.userAllThreads[index] = item
        }else{
            state.users.userAllThreads.push(item) // permet de creer un nouveau post ou autres
        }
    },
    clearItems( state, {modules=[]}){
        modules.forEach(module => {state[module].items = [] })
    }
}