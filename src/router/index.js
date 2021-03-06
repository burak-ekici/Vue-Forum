// import Home from '@/pages/Home'
// import Forum from '@/pages/Forum'
// import ThreadShow from '@/pages/ThreadShow'
// import ThreadCreate from '@/pages/ThreadCreate'
// import ThreadEdit from '@/pages/ThreadEdit'
// import Category from '@/pages/Category'
// import SignIn from '@/pages/SignIn'
// import Register from '@/pages/Register'
// import NotFound from '@/pages/NotFound'
// import Profile from '@/pages/Profile'
import { createRouter, createWebHistory } from 'vue-router'
import {findById} from '@/helpers'
import store from '@/store'



const routes = [
  { 
    path: '/', 
    component: ()=> import( /* webpackChunkName: " Home " */ '@/pages/Home.vue'), // permet quand on appel wepack-bundle-analyzer qu'il faut installer via npm add webpack-bundle-analyzer, de voir la taille de chaque component etc...
    name: 'Home' 
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: ()=> import( /* webpackChunkName: "Category" */ '@/pages/Category.vue'),
    props: true
  },
  {
    path: '/me',
    name: 'Profile',
    component: ()=> import(/* webpackChunkName: "Profile" */'@/pages/Profile.vue'),
    meta : { toTop : true, smoothScroll : true , requiresAuth : true},
    // beforeEnter(to, from){   
    //   if(!store.state.authId) return {name:'Home'}   nous allons l'implementer plus bas dans le router.beforeEach
    // }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: ()=> import(/* webpackChunkName: "ProfileEdit" */'@/pages/Profile.vue'),
    props:{edit : true},
    meta : {requiresAuth : true}
  },
  {
    path: '/forum/:id',
    name : 'Forum',
    component: ()=> import(/* webpackChunkName: "Forum" */'@/pages/Forum.vue'),
    props: true,
  },
  { 
    path: '/thread/:id',
    component: ()=> import(/* webpackChunkName: "ThreadShow" */'@/pages/ThreadShow.vue') ,
    name: 'ThreadShow' ,
    props:true,
    async beforeEnter(to,from,next){  // avant d'arriver sur la page, o, verifie si l'id du lien corespond a un id de notre data, si oui, on dirige sur la page, sinon on l'envoie sur la page erreur
      await store.dispatch('threads/fetchThread', {id : to.params.id, once : true}) // pas besoin de root true en dehors du store
      // const threadExist = dataFromJson.threads.find(thread => thread.id === to.params.id) version avec data sur ficheir json // on verifie si l'id transmis par le lien existe dans notre data threads.id
      const threadExist = findById(store.state.threads.items , to.params.id)
      threadExist 
      ? next() 
      : next({ //si le thread n'existe pas ( selon l'id du lien donc du parametre ( params ) du lien)
        name : 'NotFound', // redirige sur la page notFound
        params : {pathMatch : to.path.substring(1).split('/')}, // en lui conservant le lien url precedent pour qu'il voie ou est l'erreur dans le lien
        query : to.query, // le params renvoie que le lien avec le parametre, mais si le lien contient par ex : thread/123?id=fdsfsdf    lle ?id=fdsfsdf  ne sera pas conserver, c'est pourquoi on utilise le query
        hash : to.hash // pareil que le query mais pour le hash ex : thread/123#rzerzer    transmet le #rzerzer
      })
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ()=> import(/* webpackChunkName: "ThreadCreate" */'@/pages/ThreadCreate.vue'),
    props: true,
    meta : {requiresAuth : true}
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: ()=> import(/* webpackChunkName: "SignIn" */'@/pages/SignIn.vue'),
    meta:{requestGuest:true}
  },
  {
    path:'/logout',
    name:'SignOut',
    async beforeEnter(to,from){
      await store.dispatch(/* webpackChunkName: "SignOut" */'auth/signOut')
      return { name:'Home'}   // return dans le router , sinon dans les components this.$router.push(lien)
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: ()=> import(/* webpackChunkName: "Register" */'@/pages/Register.vue'),
    meta:{requestGuest : true}
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ()=> import(/* webpackChunkName: "ThreadEdit" */'@/pages/ThreadEdit.vue'),
    props: true,
    meta : {requiresAuth : true}
  },
  {
    path: '/:pathMatch(.*)*',
    component : ()=> import(/* webpackChunkName: "NotFound" */'@/pages/NotFound.vue'),
    name:'NotFound'
  }

]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
  scrollBehavior(to, from, savedPosition){
    // savedPosition est disponible que avec les bouton suivant precedent du navigateur 
    if (savedPosition) {
      return savedPosition
    }else{
      const scroll = {}
      if(to.meta.toTop) scroll.top = 0
      if(to.meta.smoothScroll) scroll.behavior = "smooth"
      return scroll
    }
    
  }
})

router.afterEach(()=>{
  store.dispatch('clearItems', {modules:["categories","forums","posts","threads"]})
})

router.beforeEach( async (to,from)=>{
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if(to.meta.requiresAuth && !store.state.auth.authId){
    return { name : 'SignIn', query : {redirectTo : to.path}}
  }
  if(to.meta.requestGuest && store.state.auth.authId){
    return {name :'Home'}
  }
})

export default router