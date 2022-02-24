<template>
    
    <form @submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input
          v-model="form.title"
          type="text"
          id="thread_title"
          class="form-input"
          name="title"
        />
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
          v-model="form.text"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        ></textarea>
      </div>

      <div class="btn-group">
        <button @click.prevent='$emit("cancel")' class="btn btn-ghost">Cancel</button>
        <button @click.prevent='save' class="btn btn-blue" name="Publish">
          <!-- {{title.length > 0 ? 'Update' : 'Publish'}}  <--- marche aussi -->
          {{existing ? 'Update' : 'Publish'}}
        </button>
      </div>
    </form>
    
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        text:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            form:{
                title:this.title,
                text:this.text
            }
        }
    },
    computed:{
        existing(){
            return !!this.title    // "!!" permet de renvoyer un bouléen
        }
    },
    methods:{
        save(){
            this.$emit('clean')
            this.$emit('save', { ...this.form })
        }
    },
    watch:{
        form:{  // on donne le nom du champ que l'on veux observer, permet a vue de recuperer les données de cette data ,permet de savoir si on a changer quelque chose pour ne pas demander a ne pas quitter pour ne pas perdre les donnée saisie dans le formulaire
            handler(){
                if(this.form.title !== this.title || this.form.text !== this.text){ // this.form.title regarde la data, this.title est definie par vue avec la fonction watch
                    this.$emit('dirty') // de nouvelles données on été saisie, donc on emet dirty pour indiquer a la page ainsi qua sa fonction router de demander si l'utilisateur veux vraiment quitter la page au risque de perdre ce qu'il a entrer
                }else{
                    this.$emit('clean') // rien n'a changé dans le formulaire
                }
            },
            deep:true
        }
    }
}
</script>
