<template>
  <div class="intersection-observer"></div>
</template>
<script>
export default {
  props: {
    done: { type: Boolean, default: false }
  },
  data () {
    return {
      observer: null
    }
  },
  mounted () {
    this.observer = new IntersectionObserver((entries, observer) => { //entries sera le composant <AppInfiniteScroll /> , ici on utilise pas observer qui est en parametre de la fonction
      entries.forEach((entry) => {
        if (entry.isIntersecting) this.$emit('load') // si le composant est visible sur l'ecran, on emet load
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.9
    })
    
    this.observer.observe(this.$el)  // this.$el renvoie le composant <AppInfiniteScroll /> donc <div class="intersection-observer"></div<
  },
  unmounted () {
    this.observer.unobserve(this.$el) // remove l'observer
  },
  watch: {
    done () {
      if (this.done) this.observer.unobserve(this.$el) // remove l'observer si on nous envoie une props true, ex : on a atteint le nombre maximum de posts par le profile, pas besoin d'en charger encore puisque tout est la.
    }
  }
}
</script>
<style scoped>
  div{
    position:relative;
    z-index:-1;
    pointer-events:none;
    bottom: 200px;
  }
</style>