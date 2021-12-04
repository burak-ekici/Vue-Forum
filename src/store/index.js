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
                post.userId = context.state.authId
                post.publishedAt = Math.floor(Date.now() / 1000)
                context.commit("setPost", {post})
                context.commit('appendPostToThread', {postId : post.id , threadId : post.threadId})
            },
            async createThread(context , {text, title , forumId}){
                const id = 'gggg' + Math.random()
                const userId = context.state.authId
                const publishedAt = Math.floor(Date.now() / 1000)
                const thread = {forumId, title, publishedAt, userId, id}
                context.commit("setThread", {thread})
                context.commit("appendThreadToUser", {userId , threadId : id})
                context.commit("appendThreadToForum", {forumId , threadId : id})
                // dispatch car la method createPost est dans action
                // commit car la method est dans mutation 
                context.dispatch('createPost', {text, threadId : id})
                return context.state.threads.find(thread => thread.id === id)
            },
            updateUser(context, user){
                context.commit('setUser', {user , userId : user.id})
            },
            async updateThread(context, {title , text , id}){
                const thread = context.state.threads.find(thread => thread.id === id)
                const post = context.state.posts.find(post => post.id === thread.posts[0])
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
                const index = state.posts.findIndex( p => p.id === post.id)
                if(post.id && index !== -1){ // permet de metre a jour un post existant
                    state.posts[index] = post
                }else{
                    state.posts.push(post) // permet de creer un nouveau post
                }
            },
            setThread(state, {thread}){
                const index = state.threads.findIndex(t => t.id === thread.id)
                if(thread.id && index !== -1){
                    state.threads[index] = thread
                }else{
                    state.threads.push(thread)
                }
            },
            setUser(state, {user}){
                const userIndex = state.users.findIndex(el => el.id === user.id)
                state.users[userIndex] = user
            },
            appendPostToThread(state , {postId , threadId}){
                const thread = state.threads.find(thread=> thread.id === threadId)
                thread.posts = thread.posts || []
                thread.posts.push(postId)
            },
            appendThreadToForum(state,{forumId, threadId}){
                const forum = state.forums.find(forum=> forum.id === forumId)
                forum.threads = forum.threads || []
                forum.threads.push(threadId)
            },
            appendThreadToUser(state,{userId, threadId}){
                const user = state.users.find(user=> user.id === userId)
                user.threads = user.threads || []
                user.threads.push(threadId)
            },
        }
    }
)