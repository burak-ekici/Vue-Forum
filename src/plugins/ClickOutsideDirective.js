const ClickOutsideDirective = {
  mounted(el , binding){

    el.__clickOutsideHandler__ = (e) =>{ // on attache la fonction a l'element du DOM pour pouvoir l'utiliser dans unmounted, et on utilise les __ pour eviter les croisement de fonctions
      if(!(el === e.target || el.contains(e.target))){ // el est l'element du DOM sur lequel la directive ets placé ex: <input custome-directive="function"> <input ...> sera le 'el'
        // binding est ici la fonction "() => userDropdownOpen = false" que l'on a dans v-click-outside="() => userDropdownOpen = false" dans le component TheNavbar
        binding.value(e)   // on execute la fonction , qui change la valeur de userDropdownOpen a false
      }
    }

    document.body.addEventListener('click',  el.__clickOutsideHandler__)
    
  },
  unmounted(el) {
    document.body.removeEventListener('click',  el.__clickOutsideHandler__)
  },
}





export default (app)=>{ // app fait reference a l'application vue.js, on y a accés 
  app.directive('click-outside', ClickOutsideDirective)       // permet de creer la directive, prend en paramatre le nom de la directive et la directive en lui même en second paramatre
}