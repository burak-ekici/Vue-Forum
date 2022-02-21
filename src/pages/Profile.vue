<template>
  <div class="container" style="width:100%">
    <h1>My profile</h1>
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
import { mapGetters } from 'vuex'
import UserProfileCard from '../components/UserProfileCard.vue'
import UserProfileCardEditor from '../components/UserProfileCardEditor.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus.js'
export default {
  components: { PostList , UserProfileCard , UserProfileCardEditor },
  props:{
    edit:{
      default:false,
      type:Boolean
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({user:'authUser'}) //  ou avec ...mapgetter
  },
  async created(){

    await this.$store.dispatch("fetchAuthUsersPosts")

    await this.$store.dispatch('fetchAuthUsersThreads')

    this.asyncDataStatus_fetched()
  }
}
</script>
