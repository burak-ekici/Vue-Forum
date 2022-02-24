import debounce from 'lodash/debounce' // fonction debounce de lodash qui va nous permetre de ne pas trigger le scroll de maniere incontrollé
// nous allons lui donner une fonction en premier parametre, et un temp en milliseconde en deuxieme paramatre qui va trigger l'event selon le temp definie
// en troisieme paramatre, il prend un objet pour le configurer, ici nous utilisons 'leading" qui permet de trigger l'event au premier scroll sinon il active 200ms apres
// et nous avons n'avons pas la mobile navbar qui disparait correctement ( latence )

//pour la custom directive voir le fichier ClickOutsideDirective.js
const PageScrolling = {
  mounted(el , binding){

    el.__pageScrollingHandler__ = debounce( (e)=>{
      
        binding.value(e)  
        
    } , 200 , {leading:true}) 

    document.addEventListener('scroll',  el.__pageScrollingHandler__)
    
  },
  unmounted(el) {
    document.removeEventListener('scroll',  el.__pageScrollingHandler__)
  },
}





export default (app)=>{ // app fait reference a l'application vue.js, on y a accés 
  app.directive('page-scrolling', PageScrolling)       // permet de creer la directive, prend en paramatre le nom de la directive et la directive en lui même en second paramatre
}