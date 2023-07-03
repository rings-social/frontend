<script setup lang="ts">
import { ref, type PropType, type Ref, computed } from 'vue';
import type { SimplePost } from '@/models/models';
import { DateTime } from 'luxon';
import RingLink from './RingLink.vue';
import VoteContainer from './VoteContainer.vue';
import UserLink from './UserLink.vue';
import ProfilePicture from './ProfilePicture.vue';
import RenderedMarkdown from './RenderedMarkdown.vue';
import router from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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

const rootElement = ref(null);
const rightElement = ref(null);

const visitStory = (event: MouseEvent) => {
    if(event.target == rootElement.value || event.target == rightElement.value) {
        router.push(`/r/${props.post.ringName}/${props.post.id}`);
    }
}

</script>

<template>
    <div class="post" @click="visitStory" ref="rootElement">
        <div class="post-left">
            <!-- Upvote / Downvote area, in a stylish way -->
            <VoteContainer :score="post.score"/>
        </div>

        <div class="post-right" ref="rightElement">
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
                <div class="post-actions element-divider" v-if="!singlePostView">
                    <span class="post-divider">•</span>
                    <span class="post-action">
                    <RouterLink :to="`/r/${post.ringName}/${post.id}`">
                        <FontAwesomeIcon class="icon" :icon="['fas', 'message']" />
                        <span class="post-action-text">{{ post.commentsCount }}</span>
                    </RouterLink></span>
                </div>
            </div>

            <div class="post-body" v-if="post.body != null">
                <RenderedMarkdown :markdown="post.body" />
            </div>
        </div>

        <img 
            :src="`https://picsum.photos/seed/${post.id}/200/300`"
            class="post-image"
            alt="Post Image">
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
    max-height: 250px;

    align-items: center;


    .post-image {
        height: 80px;
        width: 80px;
        flex-shrink: 1;
        object-fit: cover;
    }

    .post-right {
        flex: 1;
        justify-content: flex-start;
    }

    .post-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 35px;
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
    }

    .post-actions {
        .post-action {

            a {
                color: var(--color-action-comment);
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }

                .icon {
                    margin-right: 6px;
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
