
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index' // permet d'acceder au store en dehors de l'instance vue
import FontAwesome from '@/plugins/FontAwesome' // retourne une fonction
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrolling from '@/plugins/PageScrollingDirective'
import Vue3Pagination from '@/plugins/Vue3Pagination'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
import {createHead} from '@vueuse/head'

const forumApp = createApp(App)



// forumApp.use(...) attend une fonction ou objet en parametre et l'instencie vace forumApp ex : le parametre FontAweseome est une fonction prenant en paramétre (app) => app.component(fa , FontAwesomeIcon)
// il s'instenciera par forumApp en paramétre
// tous les paramatres son des plugins ici
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)
forumApp.use(ClickOutsideDirective)  // notre plugin de Custom Directive
forumApp.use(PageScrolling)  // notre plugin de Custom Directive
forumApp.use(Vue3Pagination)  // notre plugin de Custom Directive
forumApp.use(VeeValidatePlugin)  // notre plugin de Custom Directive
forumApp.use(createHead())

// fonction dans la doc vue.js -> section (en anglais) 'base component names ->  puis detailed explanation' 
// Permet de chercher tous les fichier dans le dossier components qui commencent par App
// et les import globalement ,donc plus besoin d'importer dans les pages ou components , ni 
// besoin de definir dans l'export, le component
const requireComponent = require.context("./components", true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

// App.component , ou dans notre cas, forumApp.component permet d'ajouter un component
// dans le context global, donc pas besoin de l'importer ou declarer le component dans l'export des fichier
// ce code est en commentaire car au dessus il traite deja le cas car j'ai nommé ce component AppDate
// qui commence donc par App et donc cette ligne est executer par le script juste au dessus
// ------->
// forumApp.component('AppDate',AppDate)  

forumApp.mount('#app')
