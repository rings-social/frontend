<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue';
import type { ErrorMessage, User } from '@/models/models';
import router from '@/router';
import { useUserStore, type Value } from '@/stores/user';
import { ref, watch } from 'vue';

const { user, idToken } = useUserStore();

const username = ref('');

const shouldCheck = ref(false);
const validUsername = ref(true);
const invalidUsernameMessage = ref('');
const availableUsername = ref(false);

type UsernameAvailabilityResponse = {
    available: boolean;
}

const assignUsername = async () => {
    try {
        const response = await fetch(`${window._settings.baseUrl}/signup/username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                username: username.value,
            }),
        });

        if(response.status == 200){
            // Username assigned
            const userResponse: User = await response.json();
            const userV = user as Value<User>;
            userV.available = true
            userV.value = userResponse;
            router.push('/');
        } else if(response.status == 400){
            // Username is invalid
            const responseError: ErrorMessage = await response.json();
            validUsername.value = false;
            invalidUsernameMessage.value = responseError.error;
        }            
    } catch (error) {
        console.error(error);
    }
}

watch(username, async (newUsername) => {
    if(newUsername.length >= 4){
        shouldCheck.value = true;
        // Check if username is available
        try {
            const response = await fetch(`${window._settings.baseUrl}/signup/usernameAvailability?username=${encodeURIComponent(newUsername)}`);
            if(response.status == 200){
                validUsername.value = true;

                // Username is available / unavailable
                const data: UsernameAvailabilityResponse = await response.json();
                availableUsername.value = data.available;
                invalidUsernameMessage.value = data.available ? '' : 'Username is already taken';
            } else if(response.status == 400){
                // Username is invalid
                const responseError: ErrorMessage = await response.json();
                validUsername.value = false;
                invalidUsernameMessage.value = responseError.error;
            }            
        } catch (error) {
            console.error(error);
        }
    } else {
        shouldCheck.value = false
    }
});

</script>

<template>
    <div class="create-profile-page">
        <h1 class="main-title">Welcome to Rings!</h1>
        <p>
            Choose an username to continue. 
            You'll not be able to change your username in the future.
        </p>
        <form class="profile-creation-form">
            <input 
                type="text" 
                placeholder="Username" 
                v-model="username"
                :class="{
                    'invalid': !validUsername && shouldCheck,
                    'unavailable': !availableUsername && shouldCheck && validUsername,
                    'available': availableUsername && shouldCheck && validUsername,
                }"
            />
            <span 
            v-if="shouldCheck && (!validUsername || !availableUsername)" 
                class="invalid-username-message">
                {{ invalidUsernameMessage }}
            </span>
            <ActionButton 
                class="confirm-button"
                :disabled="!shouldCheck"
                @click="assignUsername"
            >
            Confirm
            </ActionButton>
        </form>
    </div>
</template>

<style scoped lang="scss">
.create-profile-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    font-family: 'Nunito Variable', sans-serif;
    border: var(--generic-border);
    border-radius: var(--generic-border-radius);
    box-shadow: var(--generic-box-shadow);
    padding: var(--generic-padding);
    padding: 42px 24px;
    background-color: var(--color-post-background);
    width: 450px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    h1.main-title {
        font-weight: bold;
        font-size: 32px;
        text-align: center;
        margin-bottom: 20px;
    }

    form.profile-creation-form {
        width: 80%;
        margin-top: 24px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        row-gap: 8px;

        label {
            font-weight: bold;
            font-size: 16px;
            text-align: left;
        }

        input {
            color: var(--color-text);
            height: 40px;
            border: var(--generic-border);
            border-radius: var(--generic-border-radius);
            padding: var(--generic-padding);
            background-color: var(--color-post-background);
            font-size: 16px;
            outline: none;
            margin-bottom: 8px;
        }

        input.invalid {
            border-color: var(--color-error);
        }

        input.unavailable {
            border-color: var(--color-error-soft);
        }

        input.available {
            border-color: var(--color-success);
        }

        span.invalid-username-message {
            color: var(--color-error);
        }
    }
}
</style>