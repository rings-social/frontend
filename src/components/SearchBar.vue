<script setup lang="ts">
import router from '@/router';
import { computed, ref } from 'vue';


type Result = {
    name: string,
    title: string,
    description: string
};

const knownRings = [
    {name: 'popular', title: 'Popular', description: 'The most popular posts on Rings'},
    {name: 'news', title: 'News', description: 'News from around the world'},
]

let c = computed(() => {
    return {
    results: knownRings.filter(ring => ring.name.includes(query.value)),
}});

function visit(name: string) {
    router.push(`/r/${name}`);
    query.value = '';
    showResults.value = false;
}

function hideResults() {
    setTimeout(() => {
        showResults.value = false;
    }, 250);
}

const query = ref<string>('');
const showResults = ref<boolean>(false);
</script>

<template>
    <div class="search-bar" @focusout="hideResults">
        <input 
            type="text" 
            placeholder="Search" 
            v-model="query"
            @focus="showResults = true"
        >
        <!-- Search Icon -->
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="icon" />
        <div class="search-results" 
            :class="{
                'hidden': !showResults,
            }"
            @focus="showResults = true"
        >
            <!-- Search Results -->
            <div 
                class="search-result" 
                v-for="result in c.results" 
                v-bind:id="result.name"
                @click="visit(result.name)"
            >
                <div class="search-result-title">r/{{ result.name }}</div>
                <div class="search-result-subtitle">{{ result.description }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.search-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    align-self: stretch;

    input {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding-left: 35px;
        z-index: 301;
    }

    .icon {
        color: var(--color-search-icon);
        position: absolute;
        left: 10px;
        z-index: 301;
    }

    .search-results {
        position: absolute;
        cursor: pointer;
        border: var(--generic-border);
        top: 100%;
        z-index: 300;
        margin-top: -2px;
        left: 0;
        width: 100%;
        background-color: var(--color-search-results-background);
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        padding: 10px;
        z-index: 300;

        &.hidden {
            display: none;
        }

        .search-result {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 0px;
            border-bottom: 1px solid #ccc;
            width: 100%;

            &:last-child {
                border-bottom: none;
            }

            .search-result-title {
                font-weight: 500;
                font-size: 1rem;
            }

            .search-result-subtitle {
                font-size: 0.9rem;
                color: var(--color-search-results-subtitle);
            }
        }
    }
}
</style>