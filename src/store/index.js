import {createStore} from 'vuex'
import sourceData from '@/data.json'
export default createStore(
    {
        state: {
            ...sourceData,
            authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
        },
        getters:{
            authUser: state => {
                const user = state.users.find(user=> user.id === state.authId);
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
                
            }
        },
        actions:{
            createPost(context , post){
                post.id = 'gggg' + Math.random()
                context.commit("setPost", {post})
                context.commit('appendPostToThread', {postId : post.id , threadId : post.threadId})
            },
            updateUser(context, user){
                context.commit('setUser', {user})
            }
        },
        mutations:{
            setPost(state, {post}){
                state.posts.push(post)
            },
            setUser(state, {user}){
                const userIndex = state.users.findIndex(el => el.id === user.id)
                state.users[userIndex] = user
            },
            appendPostToThread(state , {postId , threadId}){
                const thread = state.threads.find(thread=> thread.id === threadId)
                thread.posts.push(postId)
            }
        }
    }
)