import db from '../config/firebase'
import { doc,increment, onSnapshot, collection,serverTimestamp, getDocs, getDoc,arrayUnion, writeBatch, updateDoc , setDoc} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword , GoogleAuthProvider , signInWithPopup} from "firebase/auth";
import {findById, docToResource} from "@/helpers"


export default {
    async createPost(context , post){

        post.userId = context.state.authId
        post.publishedAt = serverTimestamp()
        const batch = writeBatch(db);
        const postRef = doc(collection(db , 'posts'))
        const threadRef = doc(db, 'threads' , post.threadId)
        const userRef = doc(db, 'users' , context.state.authId)
        batch.set(postRef,post)
        batch.update(threadRef,{
            posts:  arrayUnion(postRef.id), // ArrayUnion permet d'ajouter un element dans le tableau et non de supprimer tout et remplacer par la valeur que l'on met
            contributors :  arrayUnion(context.state.authId)
        })
        batch.update(userRef, {
            postsCount:increment(1)
        })
        await batch.commit();
        const newPost = await getDoc(postRef);
        // const newPost = await addDoc(collection(db, "posts"), {
        //     ...post
        // });
        // const threadToEdit = doc(db, "threads", post.threadId);
        // await updateDoc(threadToEdit, {
        //     posts:  arrayUnion(newPost.id), // ArrayUnion permet d'ajouter un element dans le tableau et non de supprimer tout et remplacer par la valeur que l'on met
        //     contributors :  arrayUnion(context.state.authId)
        // });
        context.commit("setItem", { resource :'posts', item: {...newPost.data(), id: newPost.id}})
        context.commit('appendPostToThread', {childId : newPost.id , parentId : post.threadId})
        context.commit('appendContributorToThread', { childId: context.state.authId, parentId: post.threadId })
    },
    async createThread(context , {text, title , forumId}){

        const userId = context.state.authId
        const publishedAt = serverTimestamp()
        const threadRef = doc(collection(db , 'threads')) // genere un random ID que l'on peux utiliser avecv threadRef.id
        const thread = {forumId, title, publishedAt, userId, id : threadRef.id}
        const batch = writeBatch(db);
        console.log('id : ',threadRef)
        const userRef = doc(db, "users", userId)
        const forumRef = doc(db, "forums", forumId)
        batch.set(threadRef,thread)
        batch.update(userRef,{
            threads : arrayUnion(threadRef.id)
        })
        batch.update(forumRef,{
            threads : arrayUnion(threadRef.id)
        })
        await batch.commit();
        const newThread = await getDoc(threadRef)
        context.commit("setItem", { resource:'threads' , item : { ...newThread.data() , id:newThread.id }})
        context.commit("appendThreadToUser", {parentId: userId , childId: threadRef.id})
        context.commit("appendThreadToForum", {parentId: forumId , childId: threadRef.id})
        // dispatch car la method createPost est dans action
        // commit car la method est dans mutation 
        await context.dispatch('createPost', {text, threadId : threadRef.id})
        return findById(context.state.threads , threadRef.id)

    },
    async registerUserWithEmailAndPassword(context, {avatar = null , email , name , username , password}){
        const auth = getAuth();
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await context.dispatch('createUser', {id : result.user.uid , email , avatar , name , username})
    },
    signInWithEmailAndPassword(context, {email , password}){
        const auth = getAuth();
        return signInWithEmailAndPassword(auth,email,password)
    },
    async signInWithGoogle(context){
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        const response = await signInWithPopup(auth, provider)
        const user = response.user
        const userRef = doc(db , 'users' , user.uid)
        const userDoc =  await getDoc(userRef)
        if(userDoc.exists){
            return context.dispatch('createUser', {id : user.uid , name : user.displayName , email : user.email , username : user.email , avatar : user.photoURL})
        }
    },
    async signOut(context){
        const auth = await getAuth();
        await auth.signOut()
        context.commit('setAuthId',null)
    },
    async createUser(context , {id,email,name,username,avatar = null}){
        const registeredAt = serverTimestamp()
        const usernameLower = username.toLowerCase()
        const mail = email.toLowerCase()
        const user = { avatar , mail , username , usernameLower , registeredAt , name}
        const userRef = await doc(db , 'users', id) 
        await setDoc(userRef, user);
        const newUser = await getDoc(userRef)
        context.commit('setItem',{resource : 'users' , item : newUser})
        return docToResource(newUser)
    },
    updateUser : (context, user) => context.commit('setItem', {resource : 'users', item: user}),
    async updatePost (context , {text , id}){
        const post = {
            text , 
            edited: {
                at : serverTimestamp(),
                by : context.state.authId,
                moderated : false
            }
        }
        const postRef = doc(db , 'posts' , id)
        await updateDoc(postRef , post)
        const updatedPost = await getDoc(postRef)
        context.commit('setItem', {resource: 'post', item :updatedPost})
    },
    async updateThread(context, {title , text , id}){
        const thread = findById( context.state.threads , id)
        const post = findById(context.state.posts , thread.posts[0])
        let newThread = { ...thread , title}
        let newPost = { ...post, text}
        const threadRef = doc(db, 'threads', id)
        const postRef = doc(db, 'posts', post.id)
        const batch = writeBatch(db)
        batch.update(threadRef , newThread)
        batch.update(postRef , newPost)
        await batch.commit()
        newThread = await getDoc(threadRef)
        newPost = await getDoc(postRef)
        context.commit('setItem',{resource : 'threads', item : newThread})
        context.commit('setItem',{ resource: 'posts', item : newPost})
        return docToResource(newThread) 
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
    fetchAuthUser:({dispatch, commit}) => {
        const auth = getAuth();
        const userId = auth.currentUser?.uid
        if(!userId) return //empeche une erreur s'il n'y a pas d'user connecté

        dispatch('fetchItem', {
            resource: 'users',
            id: userId,
            handleUnsubscribe: (unsubscribe) => {
              commit('setAuthUserUnsubscribe', unsubscribe)
            }
        })
        commit('setAuthId', userId)
    },
    async fetchItem( context, {resource ,id , handleUnsubscribe = null}){

        const item = doc(db, resource , id);
        const itemSnap = await getDoc(item)
        let itemToReturn = {...itemSnap.data(), id : itemSnap.id}
        const unsubscribe = onSnapshot(doc(db, resource , id), (doc) => {
            itemToReturn = {...doc.data(),id: doc.id};
            context.commit('setItem', {resource , item: itemToReturn})
        });
        context.commit('setItem', {resource , item: itemToReturn})
        if (handleUnsubscribe) {
            handleUnsubscribe(unsubscribe)
        } else {
            context.commit('appendUnsubscribe', { unsubscribe })
        }
        return itemToReturn
    },
    fetchItems ({ dispatch }, { ids, resource }) {
        return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
    },
    async unsubscribeAllSnapshots(context){
        context.state.unsubscribes.forEach(unsubscribe => unsubscribe())
        context.commit('resetUnsubscribes')
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
        if (state.authUserUnsubscribe) {
          state.authUserUnsubscribe()
          commit('setAuthUserUnsubscribe', null)
        }
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
    },
    resetPosts(context){
        context.commit('resetStorePosts')
    },
    resetThreads(context){
        context.commit('resetStoreThreads')
    }

}