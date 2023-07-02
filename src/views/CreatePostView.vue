<script lang="ts" setup>
import ActionButton from '@/components/ActionButton.vue';
import RingLink from '@/components/RingLink.vue';
import type { Post, Ring } from '@/models/models';
import { getHeaders } from '@/utils/headers';
import { ref, watch, type Ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();

const postTitle = ref('');
const postLink = ref('');
const postBody = ref('');
const postNsfw = ref(false);

watch([postTitle, postLink, postBody], () => {
    // Posts are valid only if:
    // - Title is not empty
    // - Titles are less than 300 characters
    // - One of Link OR Body is provided (not both)
    // - Body is less than 1000 characters
    // - Link is a valid URL

    // Title is not empty
    if(postTitle.value.length == 0){
        valid.value = false;
        return;
    }

    // Title is less than 300 characters
    if(postTitle.value.length > 300){
        valid.value = false;
        return;
    }

    // One of Link OR Body is provided (not both)
    if(postLink.value.length > 0 && postBody.value.length > 0){
        valid.value = false;
        return;
    }

    if(postLink.value.length < 1 && postBody.value.length < 1){
        valid.value = false;
        return;
    }

    // Body is less than 1000 characters
    if(postBody.value.length > 1000){
        valid.value = false;
        return;
    }

    // Link is a valid URL
    if(postLink.value.length > 0){
        try {
            let u = new URL(postLink.value);
            if(u.protocol != 'http:' && u.protocol != 'https:'){
                valid.value = false;
                return;
            }
        } catch (error) {
            valid.value = false;
            return;
        }
    }

    // Link is less than 300 chars

    valid.value = true;
});

const ring: Ref<Ring|null> = ref(null);
const valid: Ref<boolean> = ref(false);

const error = ref('');

// Load ring
const loadRing = async () => {
    const response = await fetch(`${window._settings.baseUrl}/r/${router.currentRoute.value.params.ringName}`);
    if(response.status == 200){
        ring.value = await response.json();
    }

    if(response.status == 404){
        router.push('/404');
    }
}

const createPost = async () => {
    const headers = getHeaders();
    headers['Content-Type'] = 'application/json';
    const response = await fetch(`${window._settings.baseUrl}/posts`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            title: postTitle.value,
            body: postBody.value == '' ? null : postBody.value,
            link: postLink.value == '' ? null : postLink.value,
            nsfw: postNsfw.value,
            ring: router.currentRoute.value.params.ringName,
        }),
    });

    if(response.status == 200){
        const post : Post = await response.json();
        router.push(`/r/${router.currentRoute.value.params.ringName}/${post.id}`);
    } else {
        const err = await response.json();
        error.value = err.error;

        setTimeout(() => {
            error.value = '';
        }, 5000);
    }
}

// Run this every time the page is loaded / navigated to
loadRing();

</script>

<template>
    <div class="new-post-view" v-if="ring != null">
        <h1>New Post in <RingLink 
            :name="ring.name" 
            :color="ring.primaryColor"
        /></h1>
        <form class="create-post">
            <label for="title">Title</label>
            <input 
                type="text" 
                placeholder="Title" 
                v-model="postTitle"
            />
            <label for="link">Link</label>
            <input
                id="link"
                type="text"
                placeholder="https://example.com/news/1"
                v-model="postLink"
            />

            <label for="content">Content</label>
            <textarea 
                placeholder="Post content"
                class="post-content"
                v-model="postBody"
            ></textarea>

            <label for="nsfw">NSFW</label>
            <input 
                id="nsfw"
                type="checkbox"
                v-model="postNsfw"
            />

            <ActionButton 
                :primary="true"
                class="button"    
                @click="createPost"
                :disabled="!valid"
            >Create</ActionButton>

            <p class="error" v-if="error != ''">{{ error }}</p>
        </form>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<style scoped lang="scss">
.new-post-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    row-gap: 16px;

    form.create-post {
        display: flex;
        flex-direction: column;
        width: 500px;
        align-items: stretch;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;

        input, textarea {
            height: 50px;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            width: 100%;
            margin-top: 8px;
            margin-bottom: 16px;
        }

        input[type="checkbox"] {
            height: 20px;
            width: 20px;
        }

        textarea {
            max-width: 100%;
            min-height: 100px;
        }

        label {
            text-align: left;
            margin-bottom: 0;
        }

        .button {
            margin-top: 24px;
            text-align: center;
        }

        .error {
            color: var(--color-danger);
            margin-top: 24px;
            text-align: center;
        }
    }

    .result {
        display: flex;
        flex-direction: column;
        align-self: center;
        max-width: 120px;
        row-gap: 8px;
        align-items: center;
    }
}
</style>