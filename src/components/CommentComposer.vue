<script setup lang="ts">
import { ref } from 'vue';
import ActionButton from './ActionButton.vue';
import type { Comment } from '@/models/models';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    postId: {
        type: Number,
        required: true,
    },
    parentId: {
        type: Number,
        required: false,
    },
    depth: {
        type: Number,
        default: 0,
    }
});

const emit = defineEmits(['comment']);

const userStore = useUserStore();

const commentContent = ref('');
const submit = async function () {
    // Submitting to POST /api/v1/comments
    const response = await fetch(`${window._settings.baseUrl}/posts/${props.postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.idToken}`
        },
        body: JSON.stringify({
            content: commentContent.value,
            parentId: props.parentId
        }),
    });

    if(response.status == 200) {
        let comment = await response.json() as Comment;
        emit('comment', comment);
    }

}

</script>

<template>
    <div class="comment-composer">
        <textarea class="post-comment-textarea" placeholder="What's on your mind?" rows="4"
            v-model="commentContent"></textarea>
        <ActionButton class="comment-button" @click="submit">
            Comment
        </ActionButton>
    </div>
</template>

<style lang="scss" scoped>
.comment-composer {
    display: flex;
    flex-direction: column;
    column-gap: 10px;
    row-gap: 10px;

    textarea {
        border-radius: var(--generic-border-radius);
        padding: var(--generic-padding);
    }

    .comment-button {
        align-self: flex-end;
    }


}
</style>