<template>
<div v-if='asyncDataStatus_ready' class="container" >
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryList :forums="forums" :categories="categories" />
</div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import {mapActions} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
    components: {
        CategoryList
    },
    mixins: [asyncDataStatus], // fichier qui ajoute data et methods en plus et qui permet de l'utiliser dans plusieurs autres component
    computed:{
        categories(){
            return this.$store.state.categories
        },
        forums(){
            return this.$store.state.forums
        }
    },
    methods: {
        ...mapActions(['fetchAllCategories','fetchForums'])
    },
    async created() {   // mapactions aps utilisable dans beforeCreate, et props et data non disponible dans beforeCreate
        const categories = await this.fetchAllCategories();
        
        const forumIds = categories.map(category => category.forums).flat()   // flat petmet de casser les array dans les array, il prend en parametre le niveau de cassure doc : https://www.geeksforgeeks.org/javascript-array-flat-method/#:~:text=The%20arr.flat%20%28%29%20method%20was%20introduced%20in%20ES2019.,various%20libraries%20such%20as%20underscore.js%20were%20primarily%20used.
        
        await this.fetchForums({ids: forumIds}) 

        this.asyncDataStatus_fetched()

    },
}
</script>

