<template>
  <div class="container">
    <h1>My profile</h1>
    <!-- <div class="flex-grid">
      <div class="col-3 push-top">
        
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />

      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{user.username}}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.posts" />
      </div>
    </div> -->
  </div>
</template>
<script>
// import PostList from '@/components/PostList'
// import { mapGetters } from 'vuex'
// import UserProfileCard from '../components/UserProfileCard.vue'
// import UserProfileCardEditor from '../components/UserProfileCardEditor.vue'
import store from '@/store/index'
export default {
  // components: { PostList , UserProfileCard , UserProfileCardEditor },
  props:{
    edit:{
      default:false,
      type:Boolean
    }
  },
  computed: {
    user(){
      return this.$store.getters.authUser // on peux appeler le getter comme ceci
      // ...mapGetters({user:'authUser'})  ou avec ...mapgetter
    }
    // ...mapGetters({ user: 'authUser' }),    // user vaux le retour de la fonction authUser qui est dans le store ( getters)
  },
  beforeRouteEnter(to, from){   // On a pas accés a this.$store avec ces fonction du router ici donc on import le store
    if(!store.state.authId) return {name:'Home'}
  },
  beforeRouteUpdate(to, from){

  },
  beforeRouteLeave(to, from){
    
  },
  created(){
    this.$emit('ready')
  }
}
</script>
