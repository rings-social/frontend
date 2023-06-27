<script setup lang="ts">
const props = defineProps({
    primary: {
        type: Boolean,
        default: false,
    },
    secondary: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <div 
        class="button"
        :class="{ 
            'is-primary': props.primary, 
            'is-secondary': props.secondary,
            'disabled': props.disabled,
        }"
    >
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 8px;
    background-color: var(--color-primary);
    border: 1px solid transparent;
    color: var(--color-button-text);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease-in-out;


    &.is-secondary {
        color: var(--color-primary);
        background-color: transparent;
        border: 1px solid var(--color-primary);
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    &:hover:not(.disabled) {
        color: var(--color-button-text);
        background-color: var(--color-primary-hover);
    }
}
</style>