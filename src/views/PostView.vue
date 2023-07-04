<script lang="ts" setup>
import Comments from '@/components/Comments.vue';
import type { Post, Comment, SimplePost } from '@/models/models';
import { DateTime } from 'luxon';
import { ref, computed, type Ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter, type RouteLocationNormalized } from 'vue-router';
import SimplePostVue from '@/components/SimplePost.vue';
import CommentComposer from '@/components/CommentComposer.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import { getHeaders } from '@/utils/headers';


const post = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const numberOfComments = ref<number>(0);
const loadingError = ref<string|null>(null);
const commentsLoadingError = ref<string|null>(null);

onBeforeRouteUpdate(async (to, from, next) => {
    loadPost(to);
    next();
});

onBeforeRouteLeave(async (to, from, next) => {
    post.value = null;
    next();
});

async function loadComments(postId: string, postData: Post){
    const commentsResponse = await fetch(
        `${window._settings.baseUrl}/posts/${postId}/comments`,
        {
            headers: getHeaders(),
        }
    );
    if(commentsResponse.status != 200){
        let json = await commentsResponse.json();
        commentsLoadingError.value = `Unable to fetch comments: ${commentsResponse.status} ${commentsResponse.statusText} - ${json.error}`
        return;
    }
    
    const commentsData = await commentsResponse.json();
    if(commentsData != null){
        comments.value = commentsData;
    }
    numberOfComments.value = postData.commentsCount;
}

async function loadPost(to: RouteLocationNormalized){
    let postId = to.params.postId as string;
    try {
        const postResponse = await fetch(`${window._settings.baseUrl}/posts/${postId}`, 
        {
            headers: getHeaders(),
        });

        if(postResponse.status == 200){
            const postData: Post = await postResponse.json();
            post.value = postData;
            simplePost.value = {
                id: post.value.id,
                createdAt: post.value.createdAt,
                ringName: post.value.ring.name,
                ringColor: post.value.ring.primaryColor,
                authorUsername: post.value.author.username,
                author: post.value.author,
                title: post.value.title,
                body: post.value.body,
                link: post.value.link,
                domain: post.value.domain,
                score: post.value.score,
                commentsCount: post.value.commentsCount,
                ups: post.value.ups,
                downs: post.value.downs,
                nsfw: post.value.nsfw,
                votedUp: post.value.votedUp,
                votedDown: post.value.votedDown,
            } as SimplePost;

            await loadComments(postId, postData);
        } else {
            // Show error in UI
            loadingError.value = `Unable to fetch post: ${postResponse.status}`
        }
    } catch (e) {
        console.error(e);
        loadingError.value = `Unable to fetch post: ${e}`
    }
}

loadPost(useRouter().currentRoute.value);

const simplePost: Ref<SimplePost|null> = ref(null);

let c = computed(() => {
    return {
        postedOn: post.value ? DateTime.fromISO(post.value.createdAt).toRelative(): '',
        postedOnYmd: post.value ? DateTime.fromISO(post.value.createdAt).toLocaleString(DateTime.DATETIME_MED): '',
    }
});

const addComment = (comment: Comment) => {
    console.log('Adding comment')
    comments.value.push(comment);
    numberOfComments.value++;
}

const newComment = () => {
    numberOfComments.value++;
}
</script>
  

<template>
    <div class="post" v-if="simplePost != null">
        <SimplePostVue 
            :post="simplePost" 
            :singlePostView="true"
            :multiring="false" v-if="simplePost != null" />

        <!-- The post's comments -->
        <h3>Comments ({{ numberOfComments }})</h3>
        <div class="post-comments" v-if="comments.length > 0">
            <Comments :comments="comments" @newComment="newComment"/>
        </div>
        <div v-else-if="commentsLoadingError != null">
            <ErrorBox :loadingError="commentsLoadingError"/>
        </div>

        <!-- Comment composer -->

        <CommentComposer :postId="simplePost.id" @comment="addComment($event)"/>
    </div>
    <div class="post-error" v-else-if="loadingError != null">
        <ErrorBox :loadingError="loadingError"/>
    </div>
    <div class="post" v-else>
        <p>Loading...</p>
    </div>
</template>
  
<style scoped lang="scss">

h3 {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.post-comment-composer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 1rem;
    row-gap: 8px;
    width: 100%;

    .post-comment-textarea {
        flex-grow: 1;
        border: 1px solid var(--color-border);
        border-radius: var(--generic-border-radius);
        padding: 8px;
        resize: none;
        align-self: stretch;
        /* Automatic resize: */
        font-size: 0.9em;
        padding: 20px;
        outline: none;

        &:active {
            border: 2px solid var(--color-border-hover);
        }
    }

    .post-comment-button {
        background-color: var(--color-button-background);
        color: var(--color-button-text);
        border: none;
        border-radius: var(--generic-border-radius);
        padding: 8px 16px;
        font-size: 0.9em;
        font-weight: bold;
        cursor: pointer;
    }
}

.post-metadata {
    display: flex;
    font-size: 0.8em;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
    column-gap: 8px;

    .post-author {
        color: var(--color-user);
        font-weight: bold;
    }
    .post-date {
        color: #999;
    }
}

.post-body {
    margin-bottom: 2rem;
}
</style>