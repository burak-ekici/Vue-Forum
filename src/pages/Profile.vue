<template>
  <div class="container">
    <div class="flex-grid">
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
    </div>
  </div>
</template>
<script>
import PostList from '@/components/PostList'
import UserProfileCard from '../components/UserProfileCard.vue'
import UserProfileCardEditor from '../components/UserProfileCardEditor.vue'
export default {
  components: { PostList , UserProfileCard , UserProfileCardEditor },
  props:{
    edit:{
      default:false,
      type:Boolean
    }
  },
  computed: {
    user(){
      return this.$store.getters.authUser // on peux appeler le getter comme ceci
                                          // ou avec ...mapgetter
    }
    // ...mapGetters({ user: 'authUser' }),    // user vaux le retour de la fonction authUser qui est dans le store ( getters)
    
  }
}
</script>
