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
            />

            <div class="btn-group space-between">
                <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
                <button type="submit" class="btn-blue">Save</button>
            </div>
        </VeeForm>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppFormField from './AppFormField.vue'
export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            uploadingImage: false,
            activeUser: { ...this.user }
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
        save() {
            this.$store.dispatch("users/updateUser", { ...this.activeUser });
            this.$router.push({ name: "Profile" });
        },
        cancel() {
            this.$router.push({ name: "Profile" });
        }
    },
    components: { AppFormField }
}
</script>

