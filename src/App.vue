<template>
  <TheNavbar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TheNavbar from './components/TheNavbar.vue'
export default {
  components: { TheNavbar },
  name: 'App',
  methods:{
    ...mapActions(['fetchAuthUser'])
  },
  created(){
    this.fetchAuthUser()
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

</style>
