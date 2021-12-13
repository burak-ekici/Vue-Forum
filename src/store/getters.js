import {findById} from "@/helpers"

export default {
    authUser: (state , getters ) => {
        return getters.user(state.authId)
    },
    user: state =>{
        return (id)=>{

            const user = findById(state.users , id);
            if(!user){
                return null;
            }
            return {

                ...user,
                // le "get" permet juste de pouvoir appelé la fonction avec authUser.Posts
                // au lieu de authUser.Posts() sans le get  ... juste bon à savoir mais pas obligatoire
                get posts () {

                    return state.posts.filter(post => post.userId === user.id)
                },
                get postsCount () {

                    return this.posts.length
                },
                get threads () {

                    return state.threads.filter(post => post.userId === user.id)
                },
                get threadsCount () {

                    return this.threads.length
                }
            }
        }
    },
    thread: state => { // on ne peux pas donner des parametre dans un getter
                       // c'est pourquoi on lui renvoie une function qui prendra le parametre
        return (id) => {
          const thread = findById(state.threads, id)
          if(!thread) return {}
          return {
            ...thread,
            get author () {
              return findById(state.users, thread.userId)
            },
            get repliesCount () {
              return thread.posts.length - 1
            },
            get contributorsCount () {
              if(thread.contributors?.length){
                return thread.contributors.length;
              }else{
                return '0'
              }
              
            }
          }
        }
    }
}