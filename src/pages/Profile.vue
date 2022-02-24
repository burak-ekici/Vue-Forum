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
        <AppInfiniteScroll @load="loadMorePostFromFirebase(this.returnedPosts)" :done="user.posts.length >= 100" />
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
  data(){
    return {
      returnedPosts:[]
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters('auth',{user:'authUser'}), //  ou avec ...mapgetter
    lastPostFetched(){
      if(this.user.posts.length === 0) return null
      const length = this.user.posts?.length
      return this.user.posts[length-1]
    }
  },
  methods:{
    async loadMorePostFromFirebase(posts = null){
      if(posts){
        this.returnedPosts = await this.$store.dispatch("auth/fetchAuthUsersPosts",{ startAfterThisPost: this.lastPostFetched , postsFromComponent : this.returnedPosts })
      }else{
        this.returnedPosts = await this.$store.dispatch("auth/fetchAuthUsersPosts",{ startAfterThisPost: this.lastPostFetched })
      }
    }
  },
  async created(){

    await this.$store.dispatch('auth/fetchAuthUsersThreads')

    this.asyncDataStatus_fetched()
  }
}
</script>
