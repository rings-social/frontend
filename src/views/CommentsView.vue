<script lang="ts" setup>
import ActionButton from '@/components/ActionButton.vue';
import CommentsVue from '@/components/Comments.vue';
import LoadingVue from '@/components/Loading.vue';
import RenderedMarkdown from '@/components/RenderedMarkdown.vue';
import type { Comment, Paginated } from '@/models/models';
import { type Ref, ref } from 'vue';

const comments : Ref<Array<Comment>|null> = ref(null);
const fetchError : Ref<string|null> = ref(null);
const fetched = ref(0);
const totalItems = ref(0);
const after: Ref<string|null> = ref(null);

const hasMore = ref(false);

// Retrieve last comments by getting /comments
const fetchComments = async () => {
    let fetchUrl = `${window._settings.baseUrl}/comments`;
    if(after.value != null){
        fetchUrl += `?after=${after.value}`;
    }
    const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status == 200) {
        let paginatedResponse: Paginated<Comment> = await response.json();
        if(comments.value == null){
            comments.value = paginatedResponse.items;
        } else {
            comments.value.push(...paginatedResponse.items);
        }
        fetched.value += paginatedResponse.items.length;
        totalItems.value = paginatedResponse.total;
        after.value = paginatedResponse.after;
    } else {
        console.error(`Unable to fetch comments: ${response.status}`)
        fetchError.value = 'Unable to fetch comments: ' + response.status;
    }
}

fetchComments();

</script>

<template>
    <h1>Comments</h1>
    <div class="comments">
        <div class="comments-container" v-if="comments != null" >
        <CommentsVue 
            v-for="comment in comments" 
            :key="comment.id" 
            :comments="[comment]"
            :singleCommentView="true"
        />
        <div class="load-more" v-if="fetched < totalItems">
            <ActionButton @click="fetchComments()">Load more</ActionButton>
        </div>
        </div>
        <div class="loading" v-else>
            <LoadingVue />
        </div>
    </div>
</template>

<style lang="scss" scoped>
h1 {
    margin-bottom: 1rem;
}
.comments {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>