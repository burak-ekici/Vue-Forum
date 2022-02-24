<template>
<div v-if='asyncDataStatus_ready' class="container" >
    <div v-if="forum" class="col-full push-top">
        <div class="forum-header ">
            <div class="forum-details center">
                <h1>{{forum.name}}</h1>
                <p class="text-lead">{{forum.description}}</p>
            </div>
            <router-link
                :to="{name:'ThreadCreate', params: {forumId: forum.id}}"
                class="btn-green btn-small"
            >
                Start a thread
            </router-link>
        </div>
    </div>
    
    <div class="col-full push-top">
        <ThreadList :threads="threads" />
    </div>
</div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import {findById} from "@/helpers"
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
    components:{
        ThreadList
    },
    mixins: [asyncDataStatus], 
    props:{
        id:{
            required:true,
            type: String
        }
    },
    methods:{
        ...mapActions('users',['fetchUsers']),
        ...mapActions('threads', ['fetchThreads']),
        ...mapActions('forums',['fetchForum'])
    },
    computed:{
        forum(){
            return findById(this.$store.state.forums.items, this.id)
        },
        threads(){
            if(!this.forum) return []
            return this.forum.threads.map( threadId => this.$store.getters['threads/thread'](threadId))
        }
    },
    async created(){
        await this.$store.dispatch('threads/resetThreads')
        const forum = await this.fetchForum({id: this.id})
        const threads = await this.fetchThreads({ids: forum.threads})
        this.fetchUsers({ids: threads.map(thread=> thread.userId)})
        this.asyncDataStatus_fetched()
    }
}
</script>

