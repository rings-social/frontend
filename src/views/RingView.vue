<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { Ring, SimplePost } from '@/models/models';
import SimplePostVue from '@/components/SimplePost.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter, type RouteLocationNormalized } from 'vue-router';
import ActionButtonVue from '@/components/ActionButton.vue';
import { getHeaders } from '@/utils/headers';
import router from '@/router';

let loaded: Ref<boolean> = ref(false);

let ring: Ref<Ring|null> = ref(null);
let posts: Ref<Array<SimplePost>|null> = ref(null);
let ringName: Ref<string> = ref('');
let multiRing: Ref<boolean> = ref(false);
const loadingError: Ref<string|null> = ref(null);

// We fetch posts from the API even when the user changes route (ring)
onBeforeRouteUpdate((to, from, next) => {
    load(to);
    next();
});

onBeforeRouteLeave((to, from, next) => {
    posts.value = null;
    loaded.value = false
    ring.value = null;
    next();
});



async function load(to: RouteLocationNormalized){
    ringName.value = to.params.ringName as string;

    loadRing();
    loadPosts();
}

async function loadRing(){ 
    fetch(window._settings.baseUrl + '/r/' + ringName.value, {
        headers: getHeaders(),
    })
    .then((response: Response) => {
        if(response.status == 404){
            router.push('/404');
        }
        return response;
    })
    .then((response: { json: () => any; }) => response.json())
    .then((data: Ring) => ring.value = data)
    .catch((error: any) => loadingError.value = `Unable to fetch ring: ${error}`);
}

async function loadPosts() {
    switch(ringName.value) {
        case 'popular':
        case 'all':
            multiRing.value = true;
            break;
        default:
            multiRing.value = false;
    }

    fetch(window._settings.baseUrl + '/r/' + ringName.value + '/posts', {
        headers: getHeaders(),
    })
    .then((response: { json: () => any; }) => response.json())
    .then((data: SimplePost[]) => posts.value = data)
    .then(() => {
        if(posts.value == null){
            posts.value = [];
        }
    })
    .catch((error: any) => loadingError.value = `Unable to fetch posts: ${error}`);
}

load(useRouter().currentRoute.value);
</script>

<template>
    <div class="ring">
        <div class="ring-content" v-if="ring != null && posts != null">
            <div class="ring-topbar">
                <div class="title-info">
                    <h2>
                        {{ ringName }}
                    </h2>
                    <p class="ring-description">
                        {{  ring.description }}
                    </p>
                    <p v-if="multiRing" class="multi-ring-notice">
                    This is an example of a multi-ring. You can't create a new post here. Visit another ring to create a post. 
                    </p>
                </div>
                <div class="ring-actions">
                    <router-link 
                        v-if="!multiRing" :to="'/r/' + ringName + '/createPost'"
                        class="action-button"
                    >
                        <ActionButtonVue :primary="true">
                            Create post
                        </ActionButtonVue>
                    </router-link>
                </div>
            </div>
            <div class="posts">
                <SimplePostVue 
                    v-for="post in posts" 
                    :key="post.id" 
                    :post="post" 
                    :multiRing="multiRing" 
                    v-if="posts.length > 0"
                />

                <div class="no-posts-yet" v-else>
                    <p>
                        No posts yet. Be the first to create one!
                    </p>
                </div>
            </div>
        </div>
        <div v-else-if="loadingError != null">
            <ErrorBox :loading-error="loadingError" />
        </div>
        <div v-else>
            <div class="loading">
                <div class="loading-text">Loading ...</div>
                <font-awesome-icon class="icon fa-spin" :icon="['fas', 'circle-notch']" />
            </div>
        </div>  
    </div>
</template>

<style scoped lang="scss">
.ring {

    .ring-topbar {
        display: flex;
        flex-direction: row;


        .title-info {
            flex-grow: 1;
        }
        
        .ring-actions {
            display: flex;
            flex-direction: row;
            column-gap: 10px;

            .action-button {
                text-decoration: none;
            }
        }

        .multi-ring-notice {
            color: var(--color-dimmed);
            margin-top: 14px;
        }
    }
    

    /* Posts is a collection of reddit-like entries */
    .posts {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        row-gap: 16px;
        margin-top: 20px;


        /* Post is a single entry */
    }
}

.loading {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    row-gap: 10px;
    width: 100px;
}
</style>