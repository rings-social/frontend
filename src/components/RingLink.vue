<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

/* computeRingTextColor returns the text color that best fits the ring color. */
function computeRingTextColor(ringColor: string): string {
    let r = parseInt(ringColor.substring(1, 3), 16);
    let g = parseInt(ringColor.substring(3, 5), 16);
    let b = parseInt(ringColor.substring(5, 7), 16);

    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return (yiq >= 128) ? '#000' : '#fff';
}


const c = computed(() => {
    return {
        textColor: computeRingTextColor(props.color),
    }
});
</script>

<template>
<RouterLink :to="`/r/${name}`" class="post-ring" :style="{
        backgroundColor: color,
        color: c.textColor,
    }">
    <span >/r/{{ name }}</span>
</RouterLink>
</template>

<style lang="scss" scoped>
.post-ring {
    color: #fff;
    text-decoration: none;
    user-select: none;
    border-radius: 6px;
    padding: 0px 6px;

    span {
        font-weight: bold;
    }
}
</style>