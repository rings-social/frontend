<script setup lang="ts">
import router from '@/router';
import { computed } from 'vue';

const props = defineProps({
    username: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 64,
    },
    redirectOnClick: {
        type: Boolean,
        default: true,
    },
});

const profilePictureUrl = computed(() => {
    return `${window._settings.baseUrl}/users/${props.username}/profilePicture`;
});

const handleClick = () => {
    if(props.redirectOnClick){
        router.push(`/u/${props.username}`);
    }
}
</script>

<template>
    <img 
        :src="profilePictureUrl"
        :alt="`${username}'s profile picture`" 
        class="profile-picture"
        :width="size"
        :height="size"
        draggable="false"
        @click="handleClick"
    />
</template>

<style scoped lang="scss">
    .profile-picture {
        cursor: pointer;
        object-fit: cover;
        border-radius: 100%;
        user-select: none;
    }
</style>