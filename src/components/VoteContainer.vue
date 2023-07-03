<script setup lang="ts">
const props = defineProps({
    score: {
        type: Number,
        required: true
    },

    spacing: {
        type: String,
        default: 'large'
    },

    votedUp: {
        type: Boolean,
        default: false,
    },

    votedDown: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['voteUp', 'voteDown']);
</script>

<template>
    <div class="vote-container" :class="{
        'vote-container-small': spacing === 'small',
        'vote-container-large': spacing === 'large'
    }">
        <div class="vote vote-up" @click="emit('voteUp')" :class="{
            'active': votedUp,
        }">
            <font-awesome-icon class="icon" :icon="['fas', 'chevron-up']" />
        </div>
        <div class="vote vote-count">{{ score }}</div>
        <div class="vote vote-down" @click="emit('voteDown')" :class="{
            'active': votedDown,
        }">
            <font-awesome-icon class="icon" :icon="['fas', 'chevron-down']" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.vote-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    &.vote-container-small {
        margin-top: 0;
    }

    &.vote-container-large {
        row-gap: 2px;
    }

    .vote-up,
    .vote-down {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: color 0.1s ease-in-out;
    }

    .vote-up:hover,
    .vote-up.active {
        color: var(--color-post-vote-up);
    }

    .vote-down:hover,
    .vote-down.active {
        color: var(--color-post-vote-down);
    }

    .vote-count {
        font-size: 1em;
        user-select: none;
    }
}</style>