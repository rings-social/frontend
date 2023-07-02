<script setup lang="ts">
import router from '@/router';
import { computed, watch, type Ref, ref } from 'vue';
import { type Paginated, type Ring } from '@/models/models';

const query = ref('');
const showResults = ref(false);
const results: Ref<Array<Ring>> = ref([]);

type Result = {
    name: string,
    title: string,
    description: string
};

const showDefaultResults = async ()=>{
    const response = await fetch(`${window._settings.baseUrl}/rings?limit=5`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(response.status == 200){
        const data: Paginated<Ring> = await response.json();
        results.value = data.items;
        showResults.value = true;
    } else {
        console.error(`Unable to fetch rings: ${response.status}`)
    }
}

watch(query, () => {
    if (query.value.length > 0) {
        // Fetch results from /api/v1/rings?q=query
        fetch(`${window._settings.baseUrl}/rings?q=${query.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                console.error(`Unable to fetch rings: ${response.status}`)
                return [];
            }
        })
        .then((data: Paginated<Ring>) => {
            results.value = data.items;
        });
    }
});

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
</script>

<template>
    <div class="search-bar" @focusout="hideResults">
        <input 
            type="text" 
            placeholder="Search" 
            v-model="query"
            @focus="showDefaultResults"
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
                v-for="result in results" 
                v-bind:id="result.name"
                @click="visit(result.name)"
            >
                <div class="search-result-title">{{ result.name }}</div>
                <div class="search-result-subtitle">{{ result.description }}</div>
            </div>
            <div class="view-all">
                <router-link to="/rings">View all rings</router-link>
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

        .view-all {
            display: flex;
            color: var(--color-interaction);
            justify-content: center;
            align-items: center;
            padding: 10px 0px;
            margin-top: 8px;
            border-bottom: 1px solid #ccc;
            width: 100%;

            &:last-child {
                border-bottom: none;
            }

            a {
                color: var(--color-search-results-subtitle);
                font-size: 0.9rem;
                text-decoration: none;
            }
        }
    }
}
</style>