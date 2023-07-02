<script setup lang="ts">
import { ref, type PropType, type Ref, computed } from 'vue';
import type { SimplePost } from '@/models/models';
import { DateTime } from 'luxon';
import type { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import RingLink from './RingLink.vue';
import VoteContainer from './VoteContainer.vue';
import UserLink from './UserLink.vue';
import ProfilePicture from './ProfilePicture.vue';
import RenderedMarkdown from './RenderedMarkdown.vue';

let props = defineProps({
    post: {
        type: Object as PropType<SimplePost>,
        required: true
    },
    singlePostView: {
        type: Boolean as PropType<boolean>,
        default: false,
    }
});

let c = computed(() => {
    return {
        postedOn: DateTime.fromISO(props.post.createdAt).toRelative(),
        postedOnYmd: DateTime.fromISO(props.post.createdAt).toLocaleString(DateTime.DATETIME_MED),
    }
});

</script>

<template>
    <div class="post">
        <div class="post-left">
            <!-- Upvote / Downvote area, in a stylish way -->
            <VoteContainer :score="post.score"/>
        </div>

        <div class="post-right">
            <div v-if="post.link != null" class="post-title-container">
                <a 
                    :href="post.link" class="post-link" target="_blank"
                >
                    <span class="post-title">{{ post.title }}</span>
                </a>
            </div>
            <div v-else class="post-title-container">
                <RouterLink 
                    :to="`/r/${post.ringName}/${post.id}`" 
                    class="post-text"
                >
                <span class="post-title">{{ post.title }}</span>
                </RouterLink>
            </div>
            <div class="post-metadata">
                <div class="domain element-divider" v-if="post.domain">
                    <span class="post-domain">{{ post.domain }}</span>
                    <span class="post-divider">•</span>
                </div>
                <div class="ring element-divider" v-if="props.singlePostView">
                    <RingLink 
                        :name="post.ringName"
                        :color="post.ringColor"
                    ></RingLink>
                    <span class="post-divider">•</span>
                </div>
                <div class="author element-divider">
                    <div class="author-content">
                        <ProfilePicture
                            :username="post.authorUsername"
                            class="post-author-profile-picture"
                        />
                        <UserLink 
                            :username="post.authorUsername" 
                            :admin="post.author.admin"
                            class="post-author-username"/>
                    </div>
                    <span class="post-divider">•</span>
                </div>
                <div class="date element-divider">
                    <span class="post-date" :alt="c.postedOnYmd">{{ c.postedOn }}</span>
                </div>
                <span class="nsfw-tag" v-if="post.nsfw">NSFW</span>
            </div>

            <div class="post-body" v-if="post.body != null">
                <RenderedMarkdown :markdown="post.body" />
            </div>

            <div class="post-footer-divider" v-if="!singlePostView"></div>

            <div class="post-actions" v-if="!singlePostView">
                <RouterLink 
                    :to="`/r/${post.ringName}/${post.id}`" 
                    class="action action-comment"
                >
                    <font-awesome-icon class="icon" :icon="['fas', 'message']" />
                    <span class="action-text">{{ post.commentsCount }}</span>
                </RouterLink>
            </div>
        </div>

        <div class="post-image">
            <img :src="`https://picsum.photos/seed/${post.id}/200/300`" alt="Post Image">
        </div>
    </div>
</template>

<style scoped lang="scss">
$authorLineHeight: 24px;

.post {
    display: flex;
    flex-direction: row;
    width: 100%;
    column-gap: var(--generic-column-gap);
    
    background-color: var(--color-post-background);
    border: var(--generic-border);
    padding: var(--generic-padding);
    border-radius: var(--generic-border-radius);
    overflow: hidden;


    .post-image {
        display: flex;
        width: 150px;
        max-height: 100px;
        border-radius: 5px;
        overflow: hidden;
        img {
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
    }

    .post-right {
        flex: 1;
    }

    .post-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50px;
    }

    .post-footer-divider {
        height: 1px;

        background-color: var(--color-post-divider);
        margin: 1em 0px;
    }

    .post-body {
        margin-top: 10px;
    }


    .post-right {
        display: flex;
        flex-direction: column;
        width: 100%;

        .post-title-container {
            font-size: 20px;
            line-height: 20px;
            margin-bottom: 8px;
            
            span {
                font-weight: bold;
            }

            a {
                text-decoration: none;
                color: var(--color-post-type-text-title);
            }

            a.post-link {
                text-decoration: none;
                color: var(--color-post-title-link);

                &:visited {
                    color: var(--color-post-title-link-visited);
                }
            }
        }

        .post-actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 10px;

            .action {
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 5px;
                font-size: 1em;
                user-select: none;
                text-decoration: none;
            }

            .action-comment {
                display: flex;
                flex-direction: row;
                align-items: center;
                column-gap: 8px;

                color: var(--color-action-comment);
 
                &:hover {
                    background-color: var(--color-action-comment);
                    color: var(--color-action-text-hover);
                }
            }
        }
    }

    h2 {
        font-size: 24px;
        margin-bottom: 10px;
    }

    p {
        font-size: 18px;
    }

    .post-metadata {
        margin-top: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;

        font-size: 0.8em;

        .element-divider {
            display: flex;
            column-gap: 10px;

            .post-divider {
                align-self: center;
            }
        }

        .author-content {
            display: flex;
            column-gap: 6px;
            flex-direction: row;
            align-items: center;
            height: $authorLineHeight;

            .post-author-profile-picture {
                width: $authorLineHeight;
                height: $authorLineHeight;
            }
        }

        .post-date {
            color: #999;
        }

        .nsfw-tag {
            color: #fff;
            background-color: #830404;
            user-select: none;
            border-radius: 4px;
            padding: 0px 4px;
            font-weight: bold;
        }
    }
}

@media screen and (max-width: 600px) {
    .post {
        .post-image {
            display: none;
            width: 50px;
            max-height: 50px;
        }

        .post-left {
            margin-right: 8px;
        }
        
        .post-right {
            .post-metadata {
                div.date {
                    display: none;
                }

                div.author {
                    .post-divider {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
