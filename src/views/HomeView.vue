<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue';

</script>

<template>
  <main>
    <div class="main-title">
      <img src="/logo.svg" class="logo"/>
      <h1>rings.social</h1>
    </div>
    <p>
      <i>Rings</i> is a welcoming social news aggregation website that focuses
      on building communities ("rings") and creating meaningful discussions.
      <br/>

    </p>
    <div class="cta-buttons">
      <RouterLink to="/r/popular">
        <ActionButton>Explore</ActionButton>
      </RouterLink>

      <a href="https://github.com/rings-social/">
        <ActionButton :secondary="true">Contribute</ActionButton>
     </a>
    </div>

    <div class="details">
      We're still building the product and we're still missing a lot of features:
      in the meantime you can sign-up, explore the website and contribute to the project by giving your feedback and sharing your ideas.
    </div>
  </main>
</template>

<!-- CSS for an amazing landing page -->
<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 80vh;
  padding: 20px;

  .main-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    img.logo {
      height: 100px;
      width: 100px;
    }
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.5rem;
    font-weight: 300;
    text-align: center;
    max-width: 800px;
  }

  .cta-buttons {
    display: flex;
    gap: 10px;
    margin-top: 2em;
    margin-bottom: 2em;

    a {
      text-decoration: none;
    }
  }

  .primary-button,
  .secondary-button {
    height: 50px;
    padding: 10px 20px;
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .primary-button {
    background-color: #4c6ef5;
    color: #fff;
  }

  .secondary-button {
    background-color: transparent;
    border: 2px solid #4c6ef5;
    color: #4c6ef5;
  }

  .primary-button:hover,
  .secondary-button:hover {
    background-color: #3c57cb;
    color: #fff;
  }

  .details {
    font-weight: 300;
    text-align: center;
    max-width: 800px;
  }
}
</style>
