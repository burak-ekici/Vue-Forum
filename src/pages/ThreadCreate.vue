<template>
  <div v-if='asyncDateStatus_ready' class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save='save' @cancel='cancel'/>
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
  computed:{
      forum () {
        return findById(this.$store.state.forums, this.forumId) ||''  // erreur sans || '' car la data n'est pas encore chargé par firebase lorsque la page se monte, donc donné comme valeur '' le temp de chargé
      }
  },
  methods: {
    ...mapActions(['createThread','fetchForum']),
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

  }
}
</script>

