<template>
<!-- component  qui liste les sujet du forum -->
<div v-if='asyncDataStatus_ready' class="col-large push-top">
    <h1>
        {{thread.title}}
        <router-link v-if="thread.userId === authUser?.id" :to='{name : "ThreadEdit" , id : this.id}' class='btn-green btn-small' tag="button">
        Edit Thread
        </router-link>
    </h1>
    <p>
        By <a href="#" class="link-unstyled">{{user}}</a>, <AppDate :timestamp="thread.publishedAt" />.
        <span
            v-if="thread.repliesCount"
            style="float:right; margin-top: 2px;"
            class="hide-mobile text-faded text-small"
            >{{thread.repliesCount}} replies by {{thread.contributorsCount}} contributors</span
        >
    </p>

    <PostList :posts="posts" :usersPostsArray='usersPostsArray' :usersThreadsArray='usersThreadsArray' />

    <post-editor v-if="authUser" @save="addPost" />

    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'SignIn', query:{redirectTo: $route.path}}">Sign In</router-link> or <router-link :to="{name: 'Register',  query:{redirectTo: $route.path}}">Register</router-link> to reply.
    </div>
    
</div>

</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions , mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import useNotifications from '@/composables/useNotifications'

export default {
    name:"ThreadShow",
    components:{
        PostList,
        PostEditor
    },
    data(){
        return {
            user : '',
            usersPostsArray : [], // s'initialise lors de created
            usersThreadsArray : []
        }
    },
    props:{
        id:{
            required: true,
            type:String
        }
    },
    setup () {
        const { addNotification } = useNotifications()
        return {addNotification}
    },
    mixins: [asyncDataStatus], 
    computed: {
        ...mapGetters('auth',['authUser']),
        threads () {
            return this.$store.state.threads.items
        },
        posts () {
            return this.$store.state.posts.items
        },
        thread () {
            return this.$store.getters['threads/thread'](this.id) || {}
        },
        threadPosts () {
            return this.posts.filter(post => post.threadId === this.id)
        }
    },
    watch:{
        posts : (newValue , oldValue)=>{
            return newValue
        }
    },
    methods:{
        ...mapActions('posts',['createPost', 'fetchPosts']),
        ...mapActions('threads',['fetchThread']),
        ...mapActions('users',['fetchUser', 'fetchUsers']),
        async fetchPostsWithUsers (ids) {
            // fetch the posts
            const posts = await this.fetchPosts({ ids })
            // fetch the users associated with the posts
            const users = posts.map(post => post.userId).concat(this.thread.userId)
            await this.fetchUsers({ ids: users })
        },
        addPost(eventData){
            const post = {
                ...eventData.post,
                threadId : this.id
            }
            this.createPost(post)
        }
    },
    async created() {
            // fetch Data from firebase
        await this.$store.dispatch("posts/resetPosts");
        const thread = await this.fetchThread({
            id: this.id,
            onSnapshot: async ({ isLocal, item, previousItem }) => {
                if (!this.asyncDataStatus_ready || isLocal) return
                const newPosts = difference(item.posts, previousItem.posts)
                await this.fetchPostsWithUsers(newPosts)
                this.addNotification({ message: 'Thread recently updated' })
            }
        })
        await this.fetchPostsWithUsers(thread.posts)
        


        

        const user = await this.fetchUser({id : thread.userId})
        
        this.user = user.username

        
        this.asyncDataStatus_fetched()
    }
}
</script>
