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
        
        <v-pagination
            v-model="page"
            :pages="totalPages"
            active-color="#57AD8D"
        />
        
    </div>
</div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import {findById} from "@/helpers"
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import router from '../router'

export default {
    components:{
        ThreadList
    },
    mixins: [asyncDataStatus], 
    data(){
        return {
            page : parseInt(this.$route.query.page) || 1,
            perPage : 10
        }
    },
    props:{
        id:{
            required:true,
            type: String
        }
    },
    methods:{
        ...mapActions('users',['fetchUsers']),
        ...mapActions('threads', ['fetchThreads','createThread','fetchThreadsByPage']),
        ...mapActions('forums',['fetchForum'])
    },
    computed:{
        forum(){
            return findById(this.$store.state.forums.items, this.id)
        },
        threads(){
            if(!this.forum) return []
            return this.$store.state.threads.items
                .filter(el => el.forumId === this.forum.id)
                .map( thread => this.$store.getters['threads/thread'](thread.id))
        },
        threadCount(){
            return this.forum.threads.length || 0
        },
        totalPages(){
            if(!this.threadCount) return 0
            // this.$router.push({meta:{ maxPage : Math.ceil(this.threadCount / this.perPage ) ? Math.ceil(this.threadCount / this.perPage ) : 0}})
            return Math.ceil(this.threadCount / this.perPage) // ceil retourne l'arrondie superieur ex: 7.001 = 8
        }
    },
    watch:{
        async page (page){
            this.$router.push({query : { page: this.page }})
        }
    },
    async created(){
        await this.$store.dispatch('threads/resetThreads')
        const forum = await this.fetchForum({id: this.id})
        // const threads = await this.fetchThreads({ids: forum.threads})
        const threads = await this.fetchThreadsByPage({ids : forum.threads , page : this.page , perPage : this.perPage})
        this.fetchUsers({ids: threads.map(thread=> thread.userId)})
        this.asyncDataStatus_fetched()
    },
    
}
</script>

