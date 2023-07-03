<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


</script>

<template>
    <!-- A loading spinner -->
    <div class="loading">
        <FontAwesomeIcon 
            :icon="['fas', 'circle-notch']" spin
            class="icon"    
        />
    </div>
</template>

<style lang="scss" scoped>
.loading {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 32px;
}
</style>