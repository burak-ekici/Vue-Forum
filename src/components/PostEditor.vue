<template>
  <div class="col-full">
      <form @submit.prevent="save" >
          <div class="form-group">
              <textarea v-model="postCopy.text" class="form-input" name="" id="" cols="30" rows="10"></textarea>
          </div>
          <div class="form-actions">
              <button class="btn-blue">
                  {{ buttonLabel}}
              </button>
          </div>
      </form>
  </div>
</template>

<script>
export default {
    data(){
        return{
            postCopy : {...this.post}
        }
    },
    props:{
        post: {
            type : Object,
            default : () => ({text:null})
        }
    },
    computed:{
        buttonLabel(){
            if(this.post.id){
                return 'Update Post'
            }else{
                return 'Submit post'
            }
        }
    },
    methods:{
        save(){
            this.$emit('save', { post : this.postCopy } )
            // this.post.push(post)
            // this.thread.post.push(postId)
            this.postCopy.text = ""
        },
        
    }

}
</script>
