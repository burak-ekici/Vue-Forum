<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="signIn" class="card card-form">  <!-- retirer le prevent avec VeeForm-->
        <h1 class="text-center">Login</h1>   

        <AppFormField label="Email" name="email" type="email" v-model="form.email" rules="required|email" />
        <AppFormField label="Password" name="password" type="password" v-model="form.password" rules="required" />
        

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Create an account?</router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click.prevent="signInWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>


<script>
// import {Form, Field , ErrorMessage} from 'vee-validate'
export default {
  // components:{
  //   VeeForm : Form,
  //   VeeField : Field,
  //   VeeErrorMessage: ErrorMessage
  // },
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('auth/signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error.message)
      }
    },
    async signInWithGoogle(){
      await this.$store.dispatch('auth/signInWithGoogle')
      this.successRedirect()
    },
    successRedirect(){
      const redirectTo = this.$route.query.redirectTo || {name : 'Home'}
      this.$router.push(redirectTo)     // $route is actual route , $router est le router en general
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>