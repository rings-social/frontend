<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue';
import ProfilePicture from './components/ProfilePicture.vue';
import { useUserStore } from './stores/user';
import ActionButton from './components/ActionButton.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, watch } from 'vue';
import type { User } from './models/models';
import router from './router';
const { loginWithRedirect,
  getAccessTokenSilently,
  logout,
  user,
} = useAuth0();
const userStore = useUserStore();
const { idToken } = userStore;
const userStoreUser = userStore.user;
const profileMenuOpen = ref(false);

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

watch(router.currentRoute, async (newRoute) => {
  profileMenuOpen.value = false;
});

const updateProfile = async () => {
  const response = await fetch(`${window._settings.baseUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${userStore.idToken}`,
    },
  });

  if (response.status == 200) {
    const user: User = await response.json();
    userStore.user.value = user;
  } else if (response.status == 404) {
    // User doesn't exist, create it
    // Redirect to user creation page
    router.push('/createUser');
  }
};

if (idToken != null) {
  // Check idToken validity
  let token = idToken.replace('-', '+').replace('_', '/');
  let payload = JSON.parse(atob(token.split('.')[1]));


  let now = new Date();
  if (now.getTime() > payload.exp * 1000) {
    console.log('Token is expired');
    // Token is expired
    userStore.idToken = null;
    userStore.user.available = false;
    userStore.user.value = undefined;
  }

}

if (userStore.idToken != null && !userStore.user.available) {
  updateProfile();
}

const login = () => {
  loginWithRedirect();
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
}

const visitProfile = () => {
  router.push(`/u/${userStore.user.value?.username}`);
  profileMenuOpen.value = false;
}

const doLogout = () => {
  userStoreUser.available = false;
  userStoreUser.value = undefined;
  userStore.idToken = null;

  logout({
    logoutParams: {
      returnTo: window.location.origin,
    }
  });
}

</script>

<template>
  <!-- A social network header -->
  <header>
    <div class="wrapper">
      <div class="content-left">
        <RouterLink to="/" class="logo">
          <img src="/logo.svg" alt="Rings Social" />
        </RouterLink>

        <div class="navigation">
          <RouterLink to="/comments">Comments</RouterLink>
          <RouterLink to="/rings">Rings</RouterLink>
        </div>
      </div>

      <SearchBar class="search-bar" />

      <!-- User Profile Info -->
      <div class="content-right">
        <div class="profile" v-if="userStore.user.value != null">
          <div class="profile-menu-button" @click="toggleProfileMenu">
            <ProfilePicture 
              :username="userStore.user.value.username" 
              class="profile-picture"
              :redirect-on-click="false"
              />
          </div>
          <div class="profile-menu-arrow" v-if="profileMenuOpen">
            <font-awesome-icon icon="caret-up" />
          </div>
          <div class="profile-menu" v-if="profileMenuOpen">
            <ActionButton @click="visitProfile" :secondary="true">Profile</ActionButton>
            <ActionButton @click="doLogout" :secondary="true">Logout</ActionButton>
          </div>

        </div>
        <div class="user-creation" v-else-if="idToken != null">
          <!-- Creating the profile -->
          <ActionButton @click="$router.push('/createuser')">Create Profile</ActionButton>
        </div>
        <div class="login-area" v-else>
          <ActionButton @click="login">Login</ActionButton>
        </div>
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
    padding: 20px 24px;
    column-gap: 24px;
  }

  .content-left {
    display: flex;
    flex-direction: row;
    column-gap: 24px;
    justify-content: space-between;
    flex-grow: 1;

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

    .navigation {
      display: flex;
      margin: 0px 12px;
      align-items: center;
      column-gap: 24px;
      flex-grow: 0.5;

      a,
      a:visited {
        color: var(--color-header-navigation-links);
        text-decoration: none;

        &.router-link-active {
          color: var(--color-header-navigation-links-active);
        }
      }
    }
  }

  .navbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .content-right {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: flex-end;

    .profile {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      column-gap: 12px;
      width: 200px;


      .profile-menu-arrow {
        position: absolute;
        font-size: 20px;
        top: calc(100% - 15px);
        right: 15px;
        color: var(--color-profile-menu-background);
        z-index: 300;
      }
      .profile-menu {
        position: absolute;
        top: calc(100% + 3px);
        right: 0;
        width: 100%;

        background-color: var(--color-profile-menu-background);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        z-index: 300;
      }

      .profile-menu-button {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        column-gap: 12px;
        width: 100%;
      }

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
  }

  .search-bar {
    flex-grow: 2;
    max-width: 600px;
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

@media screen and (max-width: 600px) {
  header {
    .content-left {
      .navigation {
        display: none;
      }
    }
  }
}


@media screen and (max-width: 400px) {
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
}</style>
