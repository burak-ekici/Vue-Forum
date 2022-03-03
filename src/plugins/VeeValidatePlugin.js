import {defineRule , Form, Field , ErrorMessage} from 'vee-validate'
import {required, email, min, max } from '@vee-validate/rules'

export default (app)=>{

  defineRule('required', required )                                //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function
  defineRule('email', email )                                //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function
  defineRule('min', min )                                //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function
  defineRule('max', max )                                //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function

  app.component('VeeForm' , Form)
  app.component('VeeField' , Field)
  app.component('VeeErrorMessage' , ErrorMessage)

}