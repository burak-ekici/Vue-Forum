<template>
  <span>{{totalThreads}}</span>
</template>

<script>
import { mapActions  } from "vuex";

export default{
  props:{
    id:{
      required:true,
      type: String
    }
  },
  methods:{
    ...mapActions('users',['usersThreadsCount'])
  },
  computed:{
    totalThreads(){
      return  this.$store.getters['users/usersAllThreads'].filter( el => el.userId === this.id).length
    }
  },
  created(){
    this.usersThreadsCount({ userId : this.id })
  }
}
</script>