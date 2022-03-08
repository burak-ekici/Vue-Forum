<template>
  <div class="col-full">
      <VeeForm @submit="save" :key="formKey">  <!-- on creer une clef aleatoire pour refresh le form et enlever le message d'erreur si il y a-->
          <AppFormField as="textarea" label="" name="text" v-model="postCopy.text" rows="10" cols="30" rules="required" />
          <div class="form-actions">
              <button class="btn-blue">
                  {{ buttonLabel}}
              </button>
          </div>
      </VeeForm>
  </div>
</template>

<script>
import AppFormField from "./AppFormField.vue"
export default {
    data() {
        return {
            postCopy: { ...this.post },
            formKey: Math.random()
        };
    },
    props: {
        post: {
            type: Object,
            default: () => ({ text: null })
        }
    },
    computed: {
        buttonLabel() {
            if (this.post.id) {
                return "Update Post";
            }
            else {
                return "Submit post";
            }
        }
    },
    methods: {
        save() {
            this.$emit("save", { post: this.postCopy });
            // this.post.push(post)
            // this.thread.post.push(postId)
            this.postCopy.text = "";
            this.formKey = Math.random() // permet de refresh le formulaire car le :key change lors de 'levent', c'est une sorte de this.$forceUpdate()
        },
    },
    components: { AppFormField }
}
</script>
