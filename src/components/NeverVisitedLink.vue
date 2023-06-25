<script setup lang="ts">
const props = defineProps({
    to: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <RouterLink 
        :to="props.to"
        class="link"
    >
        <slot></slot>
    </RouterLink>
</template>

<style scoped lang="scss">
.link, .link:visited {
    color: var(--color-link);
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
}
</style>