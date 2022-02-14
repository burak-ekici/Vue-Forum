import {findById, upsert , docToResource} from "@/helpers"

export default {
    setItem(state, {resource ,item}){
        upsert(state[resource], docToResource(item))
    },
    setAuthId(state, id){
        state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
        state.authUserUnsubscribe = unsubscribe
    },
    appendUnsubscribe(state , { unsubscribe }){
        state.unsubscribe.push(unsubscribe)
    },
    resetUnsubscribes(state){
        state.unsubscribe = []
    },
    resetStorePosts(state){
        state.posts = []
    },
    resetStoreThreads(state){
        state.threads = []
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),            
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
}

// cette fonction sert juste a push des id dans differents objet
// exemple si on creer un message (post)
// il faut ajouter l'id de ce message dans le thread.post
// dans le thread.contributors si c'est sont premier ( car même si 2 message dans le meme sujet , il reste 1 contributeur)

function makeAppendChildToParentMutation ({ parent, child }) {
    return (state, { childId, parentId }) => {
        const resource = findById(state[parent], parentId)
        if(!resource){
            console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`)
            return
        }
        resource[child] = resource[child] || []
        
        if (!resource[child].includes(childId)) {
            resource[child].push(childId)
        }
    }
}

