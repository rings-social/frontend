<script setup lang="ts">

</script>

<template>
    <div class="not-found-view">
        <h1>Not found</h1>
        <p>The page you're looking for doesn't exist.</p>
    </div>
</template>

<style scoped lang="scss">
.not-found-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 80vh;
    padding: 20px;
    align-items: center;
    justify-content: center;

    h1 {
        font-size: 3rem;
        font-weight: 800;
    }
}
</style>