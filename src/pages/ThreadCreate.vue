<template>
  <div v-if='this.asyncDataStatus_ready' class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save='save' @cancel='cancel' @dirty="formIsDirty = true" @clean="formIsDirty = false" />
  </div>
</template>
<script>
import ThreadEditor from "../components/ThreadEditor.vue"
import {findById} from "@/helpers"
import { mapActions } from "vuex"
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components:{
    ThreadEditor
  },
  mixins: [asyncDataStatus], 
  props: {
    forumId: { type: String, required: true }
  },
  data(){
    return{
      formIsDirty:false,
    }
  },
  computed:{
      forum () {
        return findById(this.$store.state.forums.items, this.forumId) ||''  // erreur sans || '' car la data n'est pas encore chargé par firebase lorsque la page se monte, donc donné comme valeur '' le temp de chargé
      }
  },
  methods: {
    ...mapActions('threads',['createThread']),
    ...mapActions('forums',['fetchForum']),
    async save ({title,text}) {
      // dispatch a vuex action
      const thread = await this.createThread({ text , title , forumId : this.forum.id})
      this.$router.push({name:'ThreadShow' , params: {id : thread.id}})
    },
    cancel(){
        this.$router.push({name:'Forum', params:{id : this.forum.id}})
    }
  },
  async created(){
    await this.fetchForum({id:this.forumId})

    this.asyncDataStatus_fetched()

  },
  beforeRouteLeave(to,from){
    if(this.formIsDirty){
      const confirmed = window.confirm('Are you sure you want to leave ? unsaved changes will be lost !')
      if (!confirmed ) return false // permet de ne pas quitter la page si on ne confirme pas, sinon comportement habituel donc on quitte la page
    }
  }
}
</script>

