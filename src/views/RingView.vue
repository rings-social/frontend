<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { SimplePost } from '@/models/models';
import SimplePostVue from '@/components/SimplePost.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter, type RouteLocationNormalized } from 'vue-router';
import ActionButtonVue from '@/components/ActionButton.vue';
import { getHeaders } from '@/utils/headers';

let loaded: Ref<boolean> = ref(false);
let posts: Ref<Array<SimplePost>> = ref([]);
let ringName: Ref<string> = ref('');
let multiRing: Ref<boolean> = ref(false);
const loadingError: Ref<string|null> = ref(null);

// We fetch posts from the API even when the user changes route (ring)
onBeforeRouteUpdate((to, from, next) => {
    loadPosts(to);
    next();
});

onBeforeRouteLeave((to, from, next) => {
    posts.value = [];
    loaded.value = false
    next();
});

function loadPosts(to: RouteLocationNormalized){
    ringName.value = to.params.ringName as string;

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
        .then(() => loaded.value = true)
        .catch((error: any) => loadingError.value = `Unable to fetch posts: ${error}`);
}

loadPosts(useRouter().currentRoute.value);
</script>

<template>
    <div class="ring">
        <div class="ring-content" v-if="loaded">
            <div class="ring-topbar">
                <div class="title-info">
                    <h2>
                        {{ ringName }}
                    </h2>
                    <p v-if="multiRing">
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
                <SimplePostVue v-for="post in posts" :key="post.id" :post="post" :multiRing="multiRing" />
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