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
import { getHeaders } from '@/utils/headers';

let props = defineProps({
    post: {
        type: Object as PropType<SimplePost>,
        required: true
    },
    singlePostView: {
        type: Boolean as PropType<boolean>,
        default: false,
    },

    multiRing: {
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


const imageExpanded = ref(false);
const videoExpanded = ref(false);

const postVideo = computed(() => {
    if (props.post.link == null) {
        return '';
    }

    try {
        let url = new URL(props.post.link);
        let validHosts = ['i.imgur.com'];
        if (!validHosts.includes(url.hostname)) {
            return '';
        }

        // Valid extensions:
        let validExtensions = ['mp4'];
        let extension = url.pathname.split('.').pop() || '';
        if (validExtensions.includes(extension)) {
            return props.post.link;
        }

        return '';
    } catch(e) {
        return '';
    }
})

const postImage = computed(() => {
    if (props.post.link == null) {
        return '';
    }

    try {
        let url = new URL(props.post.link);
        let validHosts = ['i.imgur.com'];
        if (!validHosts.includes(url.hostname)) {
            return '';
        }

        // Valid extensions:
        let validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        let extension = url.pathname.split('.').pop() || '';
        if (validExtensions.includes(extension)) {
            return props.post.link;
        }

        return '';
    } catch(e) {
        return '';
    }
})

const visitStory = (event: MouseEvent) => {
    if (event.target == rootElement.value || event.target == rightElement.value) {
        router.push(`/r/${props.post.ringName}/${props.post.id}`);
    }
}

const sendVoteRequest = async (voteAction: 'upvote' | 'downvote') => {
    return await fetch(`${window._settings.baseUrl}/posts/${props.post.id}/${voteAction}`, {
        method: 'PUT',
        headers: getHeaders(),
    })
}

const voteUp = async () => {
    if (props.post.votedUp) {
        return;
    }

    // Send upvote request
    sendVoteRequest('upvote').then((res) => {
        if (res.status == 202) {
            if (props.post.votedDown) {
                props.post.score += 2;
            } else {
                props.post.score += 1;
            }
            props.post.votedUp = true;
            props.post.votedDown = false;
        }
    })

}

const voteDown = () => {
    if (props.post.votedDown) {
        return;
    }

    // Send downvote request
    sendVoteRequest('downvote').then((res) => {
        if (res.status == 202) {
            if (props.post.votedUp) {
                props.post.score -= 2;
            } else {
                props.post.score -= 1;
            }
            props.post.votedUp = false;
            props.post.votedDown = true;
        }
    })
}

const expandImage = () => {
    if (postImage.value == null) {
        return;
    }
    imageExpanded.value = !imageExpanded.value;
}

const expandVideo = () => {
    if (postVideo.value == null) {
        return;
    }
    videoExpanded.value = !videoExpanded.value;
}

</script>

<template>
    <div class="post" @click="visitStory" ref="rootElement">

            <div class="post-left">
                <!-- Upvote / Downvote area, in a stylish way -->
                <VoteContainer :score="post.score" 
                    :voted-up="post.votedUp" 
                    :voted-down="post.votedDown" 
                    @vote-up="voteUp"
                    @vote-down="voteDown" 
                />
            </div>

            <div class="post-right" ref="rightElement">
                <div v-if="post.link != null" class="post-title-container">
                    <a :href="post.link" class="post-link" target="_blank">
                        <span class="post-title">{{ post.title }}</span>
                    </a>
                </div>
                <div v-else class="post-title-container">
                    <RouterLink :to="`/r/${post.ringName}/${post.id}`" class="post-text">
                        <span class="post-title">{{ post.title }}</span>
                    </RouterLink>
                </div>
                <div class="post-metadata">
                    <div class="domain element-divider" v-if="post.domain">
                        <span class="post-domain">{{ post.domain }}</span>
                        <span class="post-divider">•</span>
                    </div>
                    <div class="ring element-divider" v-if="props.singlePostView || multiRing">
                        <RingLink :name="post.ringName" :color="post.ringColor"></RingLink>
                        <span class="post-divider">•</span>
                    </div>
                    <div class="author element-divider">
                        <div class="author-content">
                            <ProfilePicture :username="post.authorUsername" class="post-author-profile-picture" />
                            <UserLink :username="post.authorUsername" :admin="post.author.admin" class="post-author-username" />
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
                            </RouterLink>
                        </span>
                    </div>
                </div>

                <div class="post-body" v-if="post.body != null" :class="{ 'faded': !singlePostView }">
                    <div class="faded-overlay" v-if="!singlePostView"></div>
                    <RenderedMarkdown :markdown="post.body" />
                </div>

                <img 
                    :src="postImage"
                    @click="expandImage"
                    class="post-image"
                    :class="{ 'post-image': true, 'expanded': imageExpanded }"
                    v-if="post.link != null"
                    alt="Post Image">

                <video
                    class="post-video"
                    controls
                    :class="{ 'expanded': videoExpanded }"
                    v-if="postVideo != ''"    
                >
                    <source :src="postVideo" type="video/mp4">
                </video>
            </div>

        <img 
            :src="postImage"
            @click="expandImage"
            class="post-image-inline"
            :class="{ 'expanded': imageExpanded }"
            v-if="postImage != ''"
            alt="Post Image">
        <video
            class="post-video-inline"
            @click="expandVideo"
            :class="{ 'expanded': videoExpanded }"
            v-if="postVideo != ''"    
        >
            <source :src="postVideo" type="video/mp4">
        </video>
    </div>
</template>

<style scoped lang="scss">
$authorLineHeight: 24px;

.post {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: var(--color-post-background);
    border: var(--generic-border);
    padding: var(--generic-padding);
    column-gap: var(--generic-column-gap);
    border-radius: var(--generic-border-radius);
    row-gap: 14px;



    .post-image-inline, .post-video-inline {
        cursor: pointer;
        height: 80px;
        width: 80px;
        flex-shrink: 1;
        object-fit: cover;

        &.expanded {
            opacity: 0;
        }
    }

    .post-right {
        flex: 1;
        justify-content: flex-start;

        .post-image, .post-video {
            display: none;
            max-height: 500px;
            margin-top: 14px;
            margin-bottom: 14px;
            align-self: flex-start;
            object-fit: contain;

            &.expanded {
                display: block;
            }
        }
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
        position: relative;
        margin-top: 10px;

        &.faded {
            max-height: 100px;
            overflow: hidden;
        }

        div.faded-overlay {
            position: absolute;
            top: 50px;
            min-height: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, var(--color-post-background) 100%);
        }

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
                    display: none;

                    .post-divider {
                        display: none;
                    }
                }

                div.post-actions {
                    .post-divider {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
