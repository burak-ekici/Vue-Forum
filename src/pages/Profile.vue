<template>
  <div class="container">
    <div class="flex-grid">
      <div class="col-3 push-top">
        
        <UserProfileCard :user="user" />
        <UserProfileCardEditor :user="user" />

        <p class="text-xsmall text-faded text-center">
          Member since june 2003, last visited 4 hours ago
        </p>

        <div class="text-center">
          <hr />
          <a href="edit-profile.html" class="btn-green btn-small"
            >Edit Profile</a
          >
        </div>
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> Joker's recent activity </span>
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
import { mapGetters } from 'vuex' //permet d'avoir les getter definie dans le store vuex
export default {
  components: { PostList , UserProfileCard , UserProfileCardEditor },
  computed: {
    user(){
      return this.$store.getters.authUser // on peux appeler le getter comme ceci
                                          // ou avec ...mapgetter
    }
    // ...mapGetters({ user: 'authUser' }),    // user vaux le retour de la fonction authUser qui est dans le store ( getters)
    
  }
}
</script>

<style scoped>
</style>