<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue';
import ProfilePicture from './components/ProfilePicture.vue';
import { useUserStore } from './stores/user';
import ActionButton from './components/ActionButton.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { watch } from 'vue';
import type { User } from './models/models';
import router from './router';
const { loginWithRedirect, 
  getAccessTokenSilently, 
  user
 } = useAuth0();
const userStore = useUserStore();

const hasAccessToken = userStore.idToken != null;


watch(user, async (newUser) => {
  if (newUser !== undefined) {
    const accessToken = await getAccessTokenSilently(
      {
        detailedResponse: true,
      }
    );
    userStore.idToken = accessToken.id_token;
    await updateProfile();
  }
});

const updateProfile = async() =>{
  const response = await fetch(`${window._settings.baseUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${userStore.idToken}`,
    },
  });

  if(response.status == 200){
    const user: User = await response.json();
    userStore.user.value = user;
  } else if(response.status == 404){
    // User doesn't exist, create it
    // Redirect to user creation page
    router.push('/createUser');
  }
};

if(hasAccessToken && !userStore.user.available) {
  updateProfile();
}

const login = () => {
  loginWithRedirect();
}
</script>

<template>
  <!-- A social network header -->
  <header>
    <div class="wrapper">
      <RouterLink to="/" class="logo">
        <img src="/logo.svg" alt="Rings Social"/>
      </RouterLink>

      <SearchBar class="search-bar"/>

      <!-- User Profile Info -->
      <div class="profile" v-if="userStore.user.value != null">
        <span class="username">{{ userStore.user.value.username }}</span>
        <ProfilePicture 
          :username="userStore.user.value.username"
          class="profile-picture"
        />
      </div>
      <div class="user-creation" v-else-if="hasAccessToken">
        <!-- Creating the profile -->
        <ActionButton @click="$router.push('/createuser')">Create Profile</ActionButton>
      </div>
      <div class="login-area" v-else>
        <ActionButton @click="login">Login</ActionButton>
      </div>
    </div>
  </header>

  <div class="view">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-header-background);
  height: 70px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);


  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 20px;      
    column-gap: 24px;
  }

  .logo {
    display: block;
    height: 100%;
    width: 40px;
    height: 40px;
    img {
      height: 100%;
    }
    cursor: pointer;
  }

  .navbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .search-bar {
    width: 80%;
    max-width: 600px;
  }

  .profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 12px;

    .profile-picture {
      width: 40px;
      height: 40px;
      object-fit: cover;
      img {
        width: 100%;
        height: 100%;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }

  .login-area {

  }
}

div.view {
  margin-top: 20px;

  padding: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 1200px;
}

@media screen and (max-width: 400px){
  header {
    $imageSize: 32px;
    .logo {
      width: $imageSize;
      height: $imageSize;
      img {
        width: $imageSize;
        height: $imageSize;
      }
    }
    .search-bar {
      justify-self: stretch;
    }

    .profile {
      img {
        width: $imageSize;
        height: $imageSize;
      }
      .username {
        display: none;
      }
    }
  }
}
</style>
