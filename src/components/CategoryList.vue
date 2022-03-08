<template>
  <ForumList
    v-for="category in categories"
    :forums="getForumsForCategory(category)"
    :key="category.id"
    :title ="category.name"
    :categoryId="category.id"
   />
</template>

<script>
import ForumList from '@/components/ForumList'
export default {
    components:{
        ForumList
    },
    props:{
        categories:{
            required: true,
            type: Array
        },
        forums:{
            required:true,
            type: Object
        }
    },
    methods:{
        getForumsForCategory(category){
            
            return this.forums.filter(forum => forum.categoryId === category.id)
        }
    }

    
}
</script>
