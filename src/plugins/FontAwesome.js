import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faPencilAlt, faCamera)

export default (app) => {
    app.component('fa', FontAwesomeIcon)  /* font-awesome-icon, fa permet d'ecrire le component plus vite ex : <fa icon = '...' /> */ 
}