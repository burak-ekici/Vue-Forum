import {defineRule , Form, Field , ErrorMessage} from 'vee-validate'

export default (app)=>{

  defineRule('required', (value)=>{
    if(value && value.trim()) return true
    return 'this is required'
  })                                //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function

  app.component('VeeForm' , Form)
  app.component('VeeField' , Field)
  app.component('VeeErrorMessage' , ErrorMessage)

}