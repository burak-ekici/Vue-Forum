import {createStore} from 'vuex'
import sourceData from '@/data.json'
import {findById , upsert} from "@/helpers"


export default createStore(
    {
        state: {
            ...sourceData,
            authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
        },
        getters:{
            authUser: state => {

                const user = findById(state.users , state.authId);

                if(!user){

                    return null;

                }
                
                return {

                    ...user,
                    // le "get" permet juste de pouvoir appelé la fonction avec authUser.Posts
                    // au lieu de authUser.Posts() sans le get  ... juste bon à savoir mais pas obligatoire
                    get posts () {

                        return state.posts.filter(

                            post => post.userId === user.id

                        )

                    },
                    get postsCount () {

                        return this.posts.length
                    },
                    get threads () {

                        return state.threads.filter(

                            post => post.userId === user.id

                        )

                    },
                    get threadsCount () {

                        return this.threads.length
                    }
                }
                
            },
            thread: state => {
                return (id) => {
                  const thread = findById(state.threads, id)
                  return {
                    ...thread,
                    get author () {
                      return findById(state.users, thread.userId)
                    },
                    get repliesCount () {
                      return thread.posts.length - 1
                    },
                    get contributorsCount () {
                      if(thread.contributors.length > 0){
                        return thread.contributors.length;
                      }else{
                          return '1'
                      }
                      
                    }
                  }
                }
            }
        },
        actions:{
            createPost(context , post){

                post.id = 'gggg' + Math.random()

                post.userId = context.state.authId

                post.publishedAt = Math.floor(Date.now() / 1000)

                context.commit("setPost", {post})

                context.commit('appendPostToThread', {childId : post.id , parentId : post.threadId})
            
                context.commit('appendContributorToThread', { childId: context.state.authId, parentId: post.threadId })
            },
            async createThread(context , {text, title , forumId}){

                const id = 'gggg' + Math.random()

                const userId = context.state.authId

                const publishedAt = Math.floor(Date.now() / 1000)

                const thread = {forumId, title, publishedAt, userId, id}

                context.commit("setThread", {thread})

                context.commit("appendThreadToUser", {parentId: userId , childId: id})

                context.commit("appendThreadToForum", {parentId: forumId , childId: id})
                // dispatch car la method createPost est dans action
                // commit car la method est dans mutation 

                context.dispatch('createPost', {text, threadId : id})
                
                return findById(context.state.threads , id)

            },
            updateUser(context, user){

                context.commit('setUser', {user , userId : user.id})

            },
            async updateThread(context, {title , text , id}){

                const thread = findById( context.state.threads , id)

                const post = findById(context.state.posts , thread.posts[0])

                const newThread = { ...thread , title}

                const newPost = { ...post, text}

                context.commit('setThread',{thread : newThread})

                context.commit('setPost',{post : newPost})

                return newThread
            
            }
        },
        mutations:{

            setPost(state, {post}){
                // fonction qui creer ou ajoute un post selon le parametre post donné
                // si post vien du formulaire ...Edit , il vien avec un id et donc index aura uen valeur 
                // ce qui metra à jour le post existant
                upsert(state.posts , post) // fonction dans le dossier helper 
            
            },
            setThread(state, {thread}){

                upsert(state.threads , thread) // fonction dans le dossier helper 
            
            },
            setUser(state, {user}){

                const userIndex = state.users.findIndex(el => el.id === user.id)

                state.users[userIndex] = user

            },
            appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
            appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),            
            appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
        }
    }
)

// cette fonction sert juste a push des id dans differents objet
// exemple si on creer un message (post)
// il faut ajouter l'id de ce message dans le thread.post
// dans le thread.contributors si c'est sont premier ( car même si 2 message dans le meme sujet , il reste 1 contributeur)

function makeAppendChildToParentMutation ({ parent, child }) {
    return (state, { childId, parentId }) => {
      const resource = findById(state[parent], parentId)
      resource[child] = resource[child] || []
      const test = resource.posts || []
  
      if (!resource[child].includes(childId)) {
        resource[child].push(childId)
      }
    }
  }