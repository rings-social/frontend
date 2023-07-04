<script setup lang="ts">
import type { SocialLink, User } from '@/models/models';
import { type Ref, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProfilePicture from '@/components/ProfilePicture.vue';

// Username is in the route path :username
const username = useRoute().params.username as string;
const profilePictureUrl = `${window._settings.baseUrl}/users/${username}/profilePicture`;

const user: Ref<User | null> = ref(null);
const fetchUser = async () => {
    const response = await fetch(`${window._settings.baseUrl}/users/${username}`);
    user.value = await response.json();
};

const c = computed(() => {
    return {
        badgeDisplayText: (id: string) => {
            switch (id) {
                case 'admin':
                    return 'Admin';
                case 'supporter':
                    return 'Supporter';
                default:
                    return 'Unknown';
            }
        },

        getSocialUsername: (socialLink: SocialLink) => {
            switch (socialLink.platform) {
                case 'twitter':
                    return `@${socialLink.url.replace('https://twitter.com/', '')}`;
                case 'telegram':
                    return `@${socialLink.url.replace('https://t.me/', '')}`;
                case 'github':
                    return `@${socialLink.url.replace('https://github.com/', '')}`;
                case 'reddit':
                    return `u/${socialLink.url.replace('https://www.reddit.com/user/', '')}`;
                default:
                    return socialLink.url;
            }
        }
    }
});

onMounted(fetchUser);
</script>

<template>
    <div class="user-view" v-if="user != null">
        <div class="user-header">
            <div class="user-header-left">
                <div class="user-header-avatar">
                    <ProfilePicture :username="user.username" :size="120" />
                </div>
                <div class="username-box">
                    <h1 class="display-name">{{ user.displayName }}</h1>
                    <p class="username">{{ user.username }}</p>
                    <div class="user-badges">
                        <span class="badge" v-for="badge in user.badges" :key="badge.id"
                            :style="{ backgroundColor: badge.backgroundColor, color: badge.textColor }">
                            {{ c.badgeDisplayText(badge.id) }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="user-header-right">
                <div class="social-links">
                    <a v-for="link in user.socialLinks" :href="link.url" target="_blank" rel="noopener noreferrer">
                        <font-awesome-icon :icon="['fab', link.platform]" class="icon" />
                        <span class="link-text">{{ c.getSocialUsername(link) }}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.user-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: var(--generic-border-radius);
    background-color: var(--color-post-background);
    padding: var(--generic-padding);
    align-items: stretch;

    .user-header {
        display: flex;
        flex-direction: row;
        $avatarSize: 120px;
        column-gap: 24px;
        align-content: space-between;
        padding: 12px 48px;

        .user-header-left {
            display: flex;
            flex-direction: row;
            column-gap: 32px;
            align-items: center;
            flex-grow: 2;

            img.user-avatar {
                width: $avatarSize;
                height: $avatarSize;

                object-fit: cover;
                border-radius: $avatarSize;
            }

            .username-box {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .display-name {
                    font-size: 1.5rem;
                    font-weight: 500;
                }

                .username {
                    font-size: 1.2rem;
                    font-weight: 300;
                }

                .user-badges {
                    display: flex;
                    flex-direction: row;
                    column-gap: 8px;
                    margin-top: 8px;

                    .badge {
                        padding: 4px 12px;
                        border-radius: 16px;
                        font-size: 0.8rem;
                        font-weight: 500;
                        user-select: none;
                    }
                }
            }
        }

        .user-header-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            flex-grow: 1;
        }
    }

    .social-links {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: repeat(auto-fill, 1fr);
        row-gap: 4px;
        flex-direction: row;
        margin-top: 16px;

        a {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            column-gap: 8px;
            color: var(--color-text);
            transition: color 0.2s ease-in-out;
            font-size: 1.2rem;
            text-decoration: none;

            &:hover {
                color: var(--color-text-hover);
                text-decoration: underline;
            }

            .icon {
                font-size: 1.4rem;
            }

        }


    }
}

@media screen and (max-width: 768px) {
.user-view {
    .user-header {
        flex-direction: column;

        .user-header-right {
            align-items: center;
        }
    }
}
}
</style>