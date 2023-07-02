<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue';
import RingLink from '@/components/RingLink.vue';
import { getHeaders } from '@/utils/headers';
import { ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const ringName = ref('');
const ringTitle = ref('');
const ringDescription = ref('');
const ringColor = ref('#FF0000');
const valid = ref(false);

const ringNameError: Ref<string|null> = ref(null);
const ringCreateError: Ref<string|null> = ref(null);
const router = useRouter();

const createRing = async () => {
    // Call POST /r/:ringName with ringName, ringDescription and ringColor
    const headers = getHeaders();
    headers['Content-Type'] = 'application/json';

    try {
        const response = await fetch(`${window._settings.baseUrl}/r/${ringName.value}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: ringTitle.value,
                description: ringDescription.value,
                color: ringColor.value,
            }),
        });

        if(response.status == 200){
            // Ring created
            router.push(`/r/${ringName.value}`);
        } else if(response.status == 400){
            // Ring name is invalid
            const responseError = await response.json();
            ringNameError.value = responseError.error;
        }            
    } catch (error) {
        console.error(error);
    }
}

const validateRingName = (name: string) => {
    if (name.length < 3) {
        ringNameError.value = 'Ring name is too short.';
        return false;
    }

    if (name.length > 20) {
        ringNameError.value = 'Ring name is too long.';
        return false;
    }

    // Lowercase only
    if (name.toLowerCase() !== name) {
        ringNameError.value = 'Ring name can only contain lowercase letters.';
        return false;
    }

    // Name can only contain letters, numbers and underscores.
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(name)) {
        ringNameError.value = 'Ring name can only contain letters, numbers and underscores.';
        return false;
    }

    return true;
}

watch(ringName, (newValue) => {
    valid.value = validateRingName(newValue);
    if(valid.value){
        ringNameError.value = null;
    }
})

const setColor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    ringColor.value = target.value;
}
</script>

<template>
    <div class="new-ring-view">
        <h1>New Ring</h1>
        <p>Fill the form below to create a new ring.</p>
        <form class="create-ring">
            <label for="ring-title">Identifier</label>
            <input 
                type="text" 
                placeholder="sport_fitness"
                v-model="ringName"
            />
            <p class="error" v-if="ringNameError">{{ ringNameError }}</p>
            <label for="ring-title">Title</label>
            <input type="text" 
                placeholder="Sports & Fitness"
                v-model="ringTitle"
            />
            <label for="ring-title">Description</label>
            <input type="text" 
                placeholder="A community to discuss about ..."
                v-model="ringDescription"    
            />
            <label for="color">Color</label>
            <input
                id="color" 
                type="color" 
                placeholder="Ring color"
                :value="ringColor"
                @input="setColor"
            />
            <ActionButton 
                :primary="true"
                class="button"    
                @click="createRing"
                :disabled="!valid"
            >Create</ActionButton>

            <p class="error" v-if="ringCreateError">{{ ringCreateError }}</p>
        </form>

        <div class="result">
            Preview:
            <RingLink 
                v-if="valid"
                :name="ringName"
                :color="ringColor"    
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.new-ring-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    row-gap: 16px;

    form.create-ring {
        display: flex;
        flex-direction: column;
        width: 300px;
        align-items: stretch;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;

        input {
            height: 50px;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            width: 100%;
            margin-top: 8px;
            margin-bottom: 16px;
        }

        label {
            text-align: left;
            margin-bottom: 0;
        }

        .button {
            margin-top: 24px;
            text-align: center;
        }

        .error {
            color: var(--color-danger);
            text-align: left;
        }
    }

    .result {
        display: flex;
        flex-direction: column;
        align-self: center;
        max-width: 120px;
        row-gap: 8px;
        align-items: center;
    }
}
</style>