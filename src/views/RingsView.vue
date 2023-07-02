<script lang="ts" setup>
import RingLink from '@/components/RingLink.vue';
import type { Paginated, Ring } from '@/models/models';
import { ref, type Ref } from 'vue';
const rings : Ref<Array<Ring>> = ref([]);

const current = ref(0);
const total = ref(0);
const after = ref('');
const limit = 15;

const fetchRings = async () => {
    const response = await fetch(`${window._settings.baseUrl}/rings?limit=${limit}&after=${encodeURIComponent(after.value)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status == 200) {
        const data: Paginated<Ring> = await response.json();
        rings.value.push(...data.items);
        current.value += data.items.length;
        total.value = data.total;
        after.value = data.after;
    } else {
        console.error(`Unable to fetch rings: ${response.status}`)
    }
}

fetchRings();
</script>

<template>
<h1>Rings</h1>

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Description</th>
            <th class="number">Subscribers</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="ring in rings" :key="ring.name">
            <td><RingLink :name="ring.name" :color="ring.primaryColor" /></td>
            <td>{{ ring.title }}</td>
            <td>{{ ring.description }}</td>
            <td class="number">{{ ring.subscribers }}</td>
        </tr>
    </tbody>
</table>

<div v-if="current < total">
    <button @click="fetchRings()">Load more</button>
</div>
</template>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;

    th {
        text-align: left;
    }

    th, td {
        padding: 0.5rem;
    }

    th.number, td.number {
        text-align: right;
    }
}
</style>