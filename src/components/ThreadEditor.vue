<template>
    
    <VeeForm @submit="save">

      <AppFormField label="Title" name="title" v-model="form.title" rules="required" />
      <AppFormField label="Content" name="text" v-model="form.text" as="textarea" rules="required" rows="8" cols="140" />

      <div class="btn-group">
        <button @click.prevent='$emit("cancel")' class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" name="Publish">
          <!-- {{title.length > 0 ? 'Update' : 'Publish'}}  <--- marche aussi -->
          {{existing ? 'Update' : 'Publish'}}
        </button>
      </div>
    </VeeForm>
    
</template>

<script>
import AppFormField from "./AppFormField.vue"
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            form: {
                title: this.title,
                text: this.text
            }
        };
    },
    computed: {
        existing() {
            return !!this.title; // "!!" permet de renvoyer un bouléen
        }
    },
    methods: {
        save() {
            this.$emit("clean");
            this.$emit("save", { ...this.form });
        }
    },
    watch: {
        form: {
            handler() {
                if (this.form.title !== this.title || this.form.text !== this.text) { // this.form.title regarde la data, this.title est definie par vue avec la fonction watch
                    this.$emit("dirty"); // de nouvelles données on été saisie, donc on emet dirty pour indiquer a la page ainsi qua sa fonction router de demander si l'utilisateur veux vraiment quitter la page au risque de perdre ce qu'il a entrer
                }
                else {
                    this.$emit("clean"); // rien n'a changé dans le formulaire
                }
            },
            deep: true
        }
    },
    components: { AppFormField }
}
</script>
