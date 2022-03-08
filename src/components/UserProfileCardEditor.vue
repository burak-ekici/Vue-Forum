<template>
    <div class="profile-card">
        <VeeForm @submit="save">
            <p class="text-center avatar-edit">
                <label for="avatar">
                    <AppAvatarImg
                        :src="activeUser.avatar "
                        :alt="`${user.name} profile picture`"
                        class="avatar-xlarge img-update"
                    />
                    <div class="avatar-upload-overlay">
                        <AppSpinner v-if="uploadingImage" color="white" position="static" />
                        <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: '8' }" />
                    </div>
                    <input
                        v-show="false"
                        type="file"
                        id="avatar"
                        accept="image/*"
                        @change="handleAvatarUpload"
                    />
                    
                </label>
            </p>
            <AppFormField
                v-model="activeUser.username"
                name="username"
                label="Username"
                type="text"
                placeholder="Username"
                rules="required"
            />
            <AppFormField
                v-model="activeUser.name"
                name="name"
                type="text"
                label="Name"
                placeholder="Full Name"
                rules="required"
            />
            <AppFormField
                as="textarea"
                v-model="activeUser.bio"
                name="bio"
                type="text"
                label="Bio"
                placeholder="Write a few words about yourself."
                id="user_bio"
            />

            <div class="stats">
                <span>{{ user.postsCount }} posts</span>
                <span>{{ user.threadsCount }} threads</span>
            </div>

            <hr />
            <AppFormField
                v-model="activeUser.website"
                name="website"
                type="text"
                label="Website"
                id="user_website"
                autocomplete="off"
                rules="url"
            />
            <AppFormField
                v-model="activeUser.email"
                name="email"
                type="text"
                label="Email"
                id="user_email"
                autocomplete="off"
                :rules="`required|email`"
            />
            <AppFormField
                v-model="activeUser.location"
                name="location"
                type="text"
                label="Location"
                id="user_location"
                autocomplete="off"
                list="locations"  
                @mouseenter="loadLocationOptions"
            /> <!-- list prend l'id de la datalist que l'on a creer, une datalist permet de stocker les option d'un input type-->
            <datalist id="locations" >
                <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
            </datalist>

            <div class="btn-group space-between">
                <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
                <button type="submit" class="btn-blue">Save</button>
            </div>
        </VeeForm>
        <UserProfileCardEditorUserChecker v-model="needsReAuth" @success="onReauthenticated" @fail="onReauthenticatedFailed" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppFormField from './AppFormField.vue'
import UserProfileCardEditorUserCheckerVue from './UserProfileCardEditorUserChecker.vue';
import UserProfileCardEditorUserChecker from './UserProfileCardEditorUserChecker.vue';
import useNotifications from '../composables/useNotifications';
export default {
    components:{
        UserProfileCardEditorUserCheckerVue
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup () {
        const { addNotification } = useNotifications()
        return { addNotification }
    },
    data() {
        return {
            uploadingImage: false,
            activeUser: { ...this.user },
            locationOptions : [],
            needsReAuth : false
        };
    },
    methods: {
        ...mapActions("auth", ["uploadAvatar"]),
        async handleAvatarUpload(e) {
            this.uploadingImage = true;
            const file = e.target.files[0];
            const uploadedImage = await this.uploadAvatar({ file });
            this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
            this.uploadingImage = false;
        },
        async onReauthenticated(){
            await this.$store.dispatch('auth/updateEmail', {email: this.activeUser.email})
            this.saveUserData()
        }, 
        async onReauthenticatedFailed(){
            this.addNotification({message : 'Error updating user', type : 'error', timeout:3000})
            this.$router.push({name : 'Profile'})
        },
        async saveUserData () {
            await this.$store.dispatch('users/updateUser', { ...this.activeUser, threads: this.activeUser.threadIds })
            this.$router.push({ name: 'Profile' })
            this.addNotification({ message: 'User successfully updated', timeout: 3000 })
        },
        async save () {
            const emailChanged = this.activeUser.email !== this.user.email
            if (emailChanged) {
                this.needsReAuth = true
            } else {
                this.saveUserData()
            }
        },
        cancel() {
            this.$router.push({ name: "Profile" });
        },
        async loadLocationOptions(){
            if(this.locationOptions.length) return   // si on a djea charger les locations, on ne le refait pas
            const res = await fetch('https://restcountries.com/v3/all')
            this.locationOptions = await res.json()   // probleme, la requeet se fait 2 fois car on a mis l'event qui apelle cette fonction dans un component qui prend v-bind="$attrs", donc en double, ici et dans le component, on dois donc metre inheritAttrs:false dans le composant enfant
        },
        
    },
    components: { AppFormField, UserProfileCardEditorUserChecker }
}
</script>

