<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form" >
        <h1 class="text-center">Register</h1>

        <!-- <div class="form-group"> -->
          <!-- <label for="name">Full Name</label> -->
          <!-- <VeeField name="name" label="Name" v-model="form.name" id="name" type="text" class="form-input" rules="required" />  rules="required" est definie dans VeeValidatePlugin -->
          <!-- <VeeErrorMessage name="name" class="form-error" /> -->
        <!-- </div> -->

        <!-- <div class="form-group">
          <label for="username">Username</label> -->
          <!-- <VeeField name="username" label="Username" v-model="form.username" id="username" type="text" class="form-input" rules="required|unique:users,username" /> label permet juste de recuperer avec {field} dans le plugin veevalidate pour rendre l'erreur avec la majuscule, sinno Field prend le name en parametre -->
          <!-- <VeeErrorMessage name="username" class="form-error" />
        </div>

        <div class="form-group">
          <label for="email">Email</label> -->
          <!-- <VeeField name="email" label="Email" v-model="form.email" id="email" type="email" class="form-input" :rules="{required: true , email: true, unique : {firebaseTable: 'users' , tableRow: 'email'}}" /> on peux aussi rules="required|email|unique:users,email"  , ca passera en arguments 2 varible qu iserons destructurer dans le plugin veevalidate  -->
          <!-- <VeeErrorMessage name="email" class="form-error" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <VeeField name="password" label="Password" v-model="form.password" id="password" type="password" class="form-input" rules="required|min:8" />
          <VeeErrorMessage name="password" class="form-error" />
        </div> -->

        <AppFormField v-model="form.name" name="name" label="Name" rules="required" type="text" />
        <AppFormField v-model="form.username" name="username" label="Username" rules="required|unique:users,username" type="text" />
        <AppFormField v-model="form.email" name="email" label="Email" rules="required|email|unique:users,email" type="email" />
        <AppFormField v-model="form.password" name="password" label="Password" rules="required|min:8" type="password" />

        <div class="form-group">
          <label for="avatar">
            Avatar 
            <div v-if="avatarPreview" > 
              <img :src="avatarPreview" class="avatar-xlarge" alt="">
            </div>
          </label>
          <VeeField name="avatar"  
            id="avatar" 
            type="file" 
            class="form-input" 
            @change="handleImageUpload"
            accept="image/*"
            />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click.prevent="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar:'',
      },
      avatarPreview: null
    }
  },
  methods: {
    async register () {
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
      this.$router.push('/')
    },
    async registerWithGoogle(){
      await this.$store.dispatch('auth/signInWithGoogle')
      this.$router.push('/')
    },
    handleImageUpload (e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>