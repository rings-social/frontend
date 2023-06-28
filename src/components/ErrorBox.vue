<script setup lang="ts">
const props = defineProps({
    loadingError: {
        type: String,
        required: false,
    }
})
</script>

<template>
<!-- An error box / container -->
<div class="error-box">
    <!-- Use the v-if directive to only render the error message if loadingError is not null -->
    <div v-if="loadingError" class="error-message">
        <div class="error-message-title">
            Error
        </div>
        <div class="error-message-body">
            <!-- Use the v-html directive to render the HTML in the loadingError prop -->
            {{ loadingError }}
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.error-box {
    background-color: var(--color-error);
    color: var(--color-error-text);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 8px;
}

.error-message-title {
    font-weight: bold;
    margin-bottom: 4px;
    text-transform: uppercase;
}
</style>