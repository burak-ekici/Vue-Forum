import Home from '@/pages/Home'
import Forum from '@/pages/Forum'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Category from '@/pages/Category'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'



const routes = [
  { 
    path: '/', 
    component: Home,
    name: 'Home' 
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta : { toTop : true, smoothScroll : true}
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props:{edit : true}
  },
  {
    path: '/forum/:id',
    name : 'Forum',
    component: Forum,
    props: true
  },
  { 
    path: '/thread/:id',
    component: ThreadShow ,
    name: 'ThreadShow' ,
    props:true,
    // beforeEnter(to,from,next){  // avant d'arriver sur la page, o, verifie si l'id du lien corespond a un id de notre data, si oui, on dirige sur la page, sinon on l'envoie sur la page erreur
    //   const threadExist = dataFromJson.threads.find(thread => thread.id === to.params.id) // on verifie si l'id transmis par le lien existe dans notre data threads.id
    //   threadExist 
    //   ? next() 
    //   : next({ //si le thread n'existe pas ( selon l'id du lien donc du parametre ( params ) du lien)
    //     name : 'NotFound', // redirige sur la page notFound
    //     params : {pathMatch : to.path.substring(1).split('/')}, // en lui conservant le lien url precedent pour qu'il voie ou est l'erreur dans le lien
    //     query : to.query, // le params renvoie que le lien avec le parametre, mais si le lien contient par ex : thread/123?id=fdsfsdf    lle ?id=fdsfsdf  ne sera pas conserver, c'est pourquoi on utilise le query
    //     hash : to.hash // pareil que le query mais pour le hash ex : thread/123#rzerzer    transmet le #rzerzer
    //   })
    // }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    component : NotFound,
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
router.beforeEach(()=>{
  store.dispatch('unsubscribeAllSnapshots')
})

export default router