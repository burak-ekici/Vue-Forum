<template>
  <AppHead>
    <title>Burak's Forum</title>
    <meta name="description" content="My Forum made with Vue 3" /> 

     <!-- Social -->
    <meta property="og:title" content="Vue.js 3 Master Class Forum">
    <meta property="og:description" content="An Awesome Vue.js 3 powered forum!">
    <meta property="og:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">

    <!-- Twitter -->
    <meta name="twitter:title" content="Vue.js 3 Master Class Forum">
    <meta name="twitter:description" content="An Awesome Vue.js 3 powered forum!">
    <meta name="twitter:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">
    <meta name="twitter:card" content="summary_large_image">
  </AppHead>
  <TheNavbar />
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`" />  <!-- le :key='$route.path' permet de destroy et regenerer la page a chaque changement de lien car si on reste sur une même page par exemple : thread/-Vff..  et que l'on va sur thread/-Other , la page va bugué, car il ne va pas recharger la page, il faut la detruire avant  -->
    <AppSpinner v-show="!showPage" />                                        
  </div>
  <AppNotifications />
</template>

<script>
import { mapActions } from 'vuex'
import TheNavbar from './components/TheNavbar.vue'
import AppNotifications from './components/AppNotifications.vue'
import AppSpinner from './components/AppSpinner.vue'
import Nprogress from 'nprogress'    // librairie pour une progress Bar en haut du navigateur
export default {
  components: { TheNavbar, AppSpinner, AppNotifications},
  name: 'App',
  data(){
    return{
      showPage:false
    }
  },
  methods:{
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady(){
      this.showPage = true
      Nprogress.done()
    }
  },
  created(){
    this.fetchAuthUser()
    Nprogress.configure({
      speed:200,
      showSpinner : false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      Nprogress.start()
    })
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@import "assets/style.css";
@import "~nprogress/nprogress.css";  /* permet de recuperer nprogress.css dans le node package avec ~ */

#nprogress .bar{
  background : #57AD8D !important     /* change la couleur du progress bar de la librairie Nprogress */
}
</style>
