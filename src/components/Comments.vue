<script setup lang="ts">
import type { Comment } from '@/models/models';
import { computed, ref, type PropType, type Ref } from 'vue';
import { DateTime } from 'luxon';
import VoteContainer from './VoteContainer.vue';
import UserLink from './UserLink.vue';
import CommentComposer from './CommentComposer.vue';
import { useUserStore } from '@/stores/user';
import RenderedMarkdown from './RenderedMarkdown.vue';

const showComposer: Ref<Boolean> = ref(false);
const props = defineProps({
    comments: {
        type: Array as PropType<Array<Comment>>,
        required: true
    },
    depth: {
        type: Number,
        default: 0,
    },
    singleCommentView: {
        type: Boolean as PropType<boolean>,
        default: false,
    }
});

const { user, idToken } = useUserStore();

const toggleComposer = (comment: Comment)=>{
    comment._showComposer = !comment._showComposer;
}

const deleteComment = async (comment: Comment) => {
    // Delete comment
    console.log(`Deleting ${comment.id} (by ${comment.author_id})`);
    // Call DELETE /posts/:postId/comments/:commentId
    const response = await fetch(`${window._settings.baseUrl}/posts/${comment.post_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${idToken}`
        },
    });

    if(response.status == 200) {
        comment.body = '[deleted]';
    }
}

const emit = defineEmits(['newComment']);
const c = computed(() => {
    return {
        username: ()=>{
            return user.value?.username;
        }
    }
});

const addComment = (comment: Comment, newComment: Comment) => {
    if(comment.replies == null) comment.replies = [];
    comment.replies.push(newComment);
    toggleComposer(comment);
    emit('newComment', null);
}

const voteUp = async (comment: Comment) => {
    const response = await fetch(`${window._settings.baseUrl}/posts/${comment.post_id}/comments/${comment.id}/upvote`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${idToken}`
        },
    });
    if(response.status == 200){
        if(comment.votedDown) {
            comment.score += 2;
        }
        else {
            comment.score++;
        }
        comment.votedUp = true;
        comment.votedDown = false;
    }
}

const voteDown = async (comment: Comment) => {
    const response = await fetch(`${window._settings.baseUrl}/posts/${comment.post_id}/comments/${comment.id}/downvote`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${idToken}`
        },
    });
    if(response.status == 200){
        if(comment.votedUp) {
            comment.score -= 2;
        }
        else {
            comment.score--;
        }
        comment.votedUp = false;
        comment.votedDown = true;
    }
}
</script>

<template>
    <div class="comments">
        <div 
            v-for="comment in props.comments" 
            :key="comment.post_id + '_' + comment.id" 
            class="comment" 
            :class="{
            'comment-depth-0': depth == 0,
            }"
        >
            <div class="comment-content">
                <div class="comment-left">
                    <VoteContainer 
                        :score="comment.score" 
                        spacing="small"
                        :votedUp="comment.votedUp"
                        :votedDown="comment.votedDown"
                        @voteUp="voteUp(comment)"
                        @voteDown="voteDown(comment)"
                    />
                    <div class="vertical-line"></div>
                </div>
                <div class="comment-right">
                    <div class="comment-metadata">
                        <UserLink 
                            :username="comment.author.username"
                            :admin="comment.author.admin"
                            class="comment-author"/>
                        <div class="comment-divider">•</div>
                        <RouterLink :to="`/r/${comment.post?.ringName}/${comment.post_id}/${comment.id}`" class="comment-date">
                            {{ DateTime.fromISO(comment.createdAt).toRelative() }}
                        </RouterLink>
                        <div class="comment-divider" v-if="singleCommentView">•</div>
                        <RouterLink 
                            class="comment-post-title"
                            v-if="singleCommentView"
                            :to="`/r/${comment.post?.ringName}/${comment.post_id}`"
                        >
                        {{ comment.post?.title }}
                        </RouterLink>
                    </div>
                    <div class="comment-body">
                        <RenderedMarkdown :markdown="comment.body" />
                    </div>
                    <div class="comment-actions">
                        <div class="action action-reply" @click="toggleComposer(comment)">
                            <font-awesome-icon class="icon" :icon="['fas', 'message']" />
                            <span class="text">Reply</span>
                        </div>
                        <div 
                            class="action action-delete" 
                            @click="deleteComment(comment)"
                            v-if="comment.author_id == c.username()"
                        >
                            <font-awesome-icon class="icon" :icon="['fas', 'trash']" />
                            <span class="text">Delete</span>
                        </div>
                    </div>

                    <div class="composer-container">
                        <CommentComposer 
                            v-if="comment._showComposer"
                            :postId="comment.post_id"
                            :parentId="comment.id"
                            :depth="comment.depth"
                            @comment="addComment(comment, $event)"
                        />
                    </div>

                    <div class="comment-children" v-if="comment.replies != null">
                        <div class="comment-children-divider" v-for="(n, i) in depth"></div>
                        <Comments 
                            :comments="comment.replies" 
                            :depth="comment.depth" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
/* 
    Not scoped, on purpose.
    Since we're rendering the markdown with marked, 
    we can't used scoped styles.
*/
.comments {
    display: flex;
    flex-direction: column;

    .comment {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        margin-bottom: 1rem;
        background-color: var(--color-post-background);
        border-radius: var(--generic-border-radius);
        padding: var(--comment-padding);

        &.comment-depth-0 {
            border: var(--generic-border);        
        }

        .comment-content {
            display: flex;
            flex-direction: row;
            align-self: stretch;
            column-gap: var(--generic-column-gap);

            .comment-left {
                display: flex;
                flex-direction: column;
                width: 1rem;

                .upvote-downvote-area {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    row-gap: 2px;
                }

                .vertical-line {
                    width: 2px;
                    height: 100%;
                    margin-top: 10px;
                    background-color: var(--color-comment-vertical-line);
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                }

            }
            .comment-right {
                display: flex;
                flex-direction: column;
                flex-grow: 1;

                .comment-body {
                    margin-bottom: 0.5rem;
                }

                .comment-metadata {
                    display: flex;
                    color: var(--color-dimmed);
                    font-size: 0.8rem;
                    column-gap: 10px;
                    margin-bottom: 8px;

                    .comment-date {
                        color: var(--color-dimmed);
                        transition: color 0.15s ease-in-out;
                        cursor: pointer;
                        &:hover {
                            color: var(--color-dimmed-hover);
                            text-decoration: underline;
                        }
                        text-decoration: none;
                    }

                    .comment-post-title {
                        color: var(--color-dimmed);
                        transition: color 0.15s ease-in-out;
                        cursor: pointer;
                        &:hover {
                            color: var(--color-dimmed-hover);
                            text-decoration: underline;
                        }
                        text-decoration: none;
                    }
                }

                .comment-actions {
                    display: flex;
                    flex-direction: row;
                    column-gap: 24px;
                    margin-top: 8px;

                    .action {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        column-gap: 4px;
                        cursor: pointer;
                        transition: color 0.15s ease-in-out;
                        font-size: 0.8rem;
                        color: var(--color-comment-actions);
                    }

                    .action.action-delete:hover {
                        color: var(--color-danger);
                    }
                    
                }

                .comment-composer {
                    margin-top: 16px;
                }
            }
        }

        .comment-children {
            margin-top: 8px;
            .comment-children-divider {
                width: 1px;
                margin-left: 0.5rem;
                margin-right: 0.5rem;
            }
        }
    }
}
</style>