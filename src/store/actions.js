import db from '../config/firebase'
import { doc, onSnapshot, collection, getDocs, getDoc } from "firebase/firestore";
import {findById} from "@/helpers"


export default {
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
    updateUser : (context, user) => context.commit('setItem', {resource : 'users', item: user}),
    async updateThread(context, {title , text , id}){

        const thread = findById( context.state.threads , id)
        const post = findById(context.state.posts , thread.posts[0])
        const newThread = { ...thread , title}
        const newPost = { ...post, text}
        context.commit('setItem',{resource : 'threads', item : newThread})
        context.commit('setItem',{ resource: 'posts', item : newPost})
        return newThread
    },
    fetchCategory : ({dispatch}, {id}) => dispatch('fetchItem', { resource:'categories', id}),
    fetchCategories:({dispatch}, {id}) => dispatch('fetchItem', { resource:'categories', ids}),
    fetchThread: ({dispatch} , {id}) => dispatch('fetchItem', { resource:'threads', id}),
    fetchThreads:({dispatch} , {ids}) => dispatch('fetchItems',{resource:'threads', ids}),
    fetchPost:({dispatch} , {id}) => dispatch('fetchItem', { resource:'posts', id}),
    fetchPosts:({dispatch} , {ids}) => dispatch('fetchItems',{resource:'posts', ids}),
    fetchUser:( {dispatch} , {id}) => dispatch('fetchItem', { resource:'users', id}),
    fetchUsers:({dispatch} , {ids}) => dispatch('fetchItems',{resource:'users', ids}),
    fetchForum:({dispatch}, {id}) => dispatch('fetchItem', { resource:'forums', id}),
    fetchForums:({dispatch} , {ids}) => dispatch('fetchItems',{resource:'forums', ids}),
    fetchAuthUser:({dispatch,state}) => dispatch('fetchItem',{resource:'users',id :state.authId}),
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

}