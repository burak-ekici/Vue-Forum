import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

export default (app) => {
  app.component('VPagination', VPagination)   // plugin qui permeet d'avoir le nombre de page a la fin des posts
}