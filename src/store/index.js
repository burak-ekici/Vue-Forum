import {createStore} from 'vuex'
import {findById , upsert} from "@/helpers"
import db from '../config/firebase'
import { doc, onSnapshot, query, where, collection, getDocs, getDoc } from "firebase/firestore";



export default createStore(
    {
        state: {
            categories:[],
            forums:[],
            threads:[],
            posts:[],
            users:[],
            authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
        },
        getters:{
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
        },
        actions:{
            createPost(context , post){

                post.id = 'gggg' + Math.random()

                post.userId = context.state.authId

                post.publishedAt = Math.floor(Date.now() / 1000)

                context.commit("setItem", { resource :'posts', item: post})

                context.commit('appendPostToThread', {childId : post.id , parentId : post.threadId})
            
                context.commit('appendContributorToThread', { childId: context.state.authId, parentId: post.threadId })
            },
            async createThread(context , {text, title , forumId}){

                const id = 'gggg' + Math.random()

                const userId = context.state.authId

                const publishedAt = Math.floor(Date.now() / 1000)

                const thread = {forumId, title, publishedAt, userId, id}

                context.commit("setItem", { resource:'threads' , item : thread})

                context.commit("appendThreadToUser", {parentId: userId , childId: id})

                context.commit("appendThreadToForum", {parentId: forumId , childId: id})
                // dispatch car la method createPost est dans action
                // commit car la method est dans mutation 

                context.dispatch('createPost', {text, threadId : id})
                
                return findById(context.state.threads , id)

            },
            updateUser(context, user){

                context.commit('setItem', {resource : 'users', item: user})

            },
            async updateThread(context, {title , text , id}){

                const thread = findById( context.state.threads , id)

                const post = findById(context.state.posts , thread.posts[0])

                const newThread = { ...thread , title}

                const newPost = { ...post, text}

                context.commit('setItem',{resource : 'threads', item : newThread})

                context.commit('setItem',{ resource: 'posts', item : newPost})

                return newThread
            
            },
            fetchCategory({dispatch}, {id}){
                return dispatch('fetchItem', { resource:'categories', id})
            },
            fetchCategories({dispatch}, {id}){
                return dispatch('fetchItem', { resource:'categories', ids})
            },
            fetchThread(context , {id}){
                return context.dispatch('fetchItem', { resource:'threads', id})
            },
            fetchThreads(context , {ids}){
                return context.dispatch('fetchItems',{resource:'threads', ids})
            },
            fetchPost(context , {id}){
                return context.dispatch('fetchItem', { resource:'posts', id})
            },
            fetchPosts(context , {ids}){
                return context.dispatch('fetchItems',{resource:'posts', ids})
            },
            fetchUser( context , {id}){
                return context.dispatch('fetchItem', { resource:'users', id})
            },
            fetchUsers(context , {ids}){
                return context.dispatch('fetchItems',{resource:'users', ids})
            },
            fetchForum(context, {id}){
                return context.dispatch('fetchItem', { resource:'forums', id})
            },
            fetchForums(context , {ids}){
                return context.dispatch('fetchItems',{resource:'forums', ids})
            },
            async fetchItem( context, {resource ,id}){
                const item = doc(db, resource , id);
                const itemSnap = await getDoc(item)
                let itemToReturn = {...itemSnap.data(), id : itemSnap.id}
                onSnapshot(doc(db, resource , id), (doc) => {
                    itemToReturn = {...doc.data(),id: doc.id};
                    context.commit('setItem', {resource , item: itemToReturn})
                });
                context.commit('setItem', {resource , item: itemToReturn})
                return itemToReturn
            },
            fetchItems ({ dispatch }, { ids, resource }) {
                return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
            },
            async fetchAllCategories(context){
                const categories = [];
                // recupere tous les threads de firebase
                const allCategories = await getDocs(collection(db, "categories"))
                allCategories.forEach(document=> {
                    const item = {id : document.id , ...document.data()}
                    context.commit('setItem', {resource : 'categories' , item})
                    categories.push({...document.data()})
                    onSnapshot(doc(db,'categories',document.id),(el)=>{
                        const item = {id : el.id , ...el.data()}
                        context.commit('setItem', {resource : 'categories' , item})
                        const index = categories.indexOf(el.data())
                        if(index != -1){
                            categories.push({...el.data()})
                        }else{
                            categories[index] = {...el.data()}
                        }
                    })
                })
                return categories;
            }

        },
        mutations:{
            setItem(state, {resource ,item}){
                upsert(state[resource], item)
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

