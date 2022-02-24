<template>

    <div class="post-list">

        <div v-for="post in posts" :key="post.id" class="post">


            <div class="user-info">

                <a href="#" class="user-name">{{findUser(post.userId).name}}</a>

                <a href="#">
                    <img  class="avatar-large" :src="findUser(post.userId).avatar" alt="">
                </a>

                <p class="desktop-only text-small">{{postCount(post.userId)}} posts</p>
                <p class="desktop-only text-small">{{threadCount(post.userId)}} threads</p>

            </div>


            <div class="post-content">

                <div class='col-full'>

                    <PostEditor
                        :post='post' 
                        @save="handleUpdate" 
                        v-if='editing === post.id'
                    />

                    <p v-else>{{post.text}}</p>

                </div>

                <a  
                    v-if='$store.state.auth.authId === post.userId'
                    @click.prevent='toggleEditMode(post.id)' 
                    href="#" 
                    style="margin-left: auto; padding-left:10px;"
                    class="link-unstyled" 
                    title="Make a change">

                    <fa icon="pencil-alt" />
                </a>

            </div>


            <div class="post-date text-faded">

                <div v-if='post.edited?.at' class="edition-info">edited</div>

                <appDate :timestamp="post.publishedAt" />
                
            </div>

        </div>

    </div>
</template>

<script>
import PostEditor from "./PostEditor.vue"
import { mapActions } from "vuex";
export default {
    props: {
        posts: {
            required: true,
            type: Array
        },
        usersPostsArray:{
            required:false,
            type:Array,
            default:[]
        },
        usersThreadsArray:{
            required:false,
            type:Array,
            default:[]
        }
    },
    components: { PostEditor },
    data() {
        return {
            editing: null,
            dataArray : []
        };
    },
    methods: {
        ...mapActions('posts',['updatePost']),
        ...mapActions('users',['usersThreadsCount','authUsersThreadsCount']),
        findUser(userId) {
            return this.$store.getters['users/user'](userId);
        },
        toggleEditMode(id) {
            this.editing = id === this.editing ? null : id;
        },
        handleUpdate(event){
            this.updatePost(event.post)
            this.editing = null
        },
        postCount(userID){
            return this.usersPostsArray.filter(el => el.userId === userID).length
        },
        threadCount(userID){
            return this.usersThreadsArray.filter(el => el.userId === userID).length || 0
        }
    },
    created() {
         this.$store.dispatch("users/fetchUsers", { ids: this.posts.map(post => post.userId) });
        
        setTimeout(()=>{
            this.$forceUpdate()

        },200)
        
    }
}
</script>


