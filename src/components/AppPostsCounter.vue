<template>
  <span>{{totalPosts.length}}</span>
</template>

<script>
import { mapActions } from "vuex";

export default{
  data(){
    return {
      totalPosts : 0
    }
  },
  props:{
    id:{
      required:true,
      type: String
    }
  },
  methods:{
    ...mapActions('users',['usersPostsCount'])
  },
  async created(){
    this.totalPosts = await this.usersPostsCount({ userId : this.id })
  }
}
</script>