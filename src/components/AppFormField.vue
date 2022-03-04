<template>
  <div class="form-group">
    <label :for="name">{{label}}</label>
    <VeeField
      :name="name"
      :label="label"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      :id="name"
      class="form-input"
      v-bind="$attrs"  
    />  <!-- v-bind = "$attrs" recupere les autres propriété qui seront mis dans <AppFormField> et qui ne sont pas passé en props-->
    <VeeErrorMessage :name="name" class="form-error" />
    <!-- <div>{{$attrs}}</div> permet de voir ce qu'est $attrs ( objet qui contient les attributs mis dans ce component a partir du parent) -->
  </div>
</template>    


<script>
export default {
  props : {
    name : { type : String , required : true},
    label : { type : String , required : true},
    modelValue:{ type : String , default:''}
  }
}

</script>