<script setup lang="ts">
import ProfilePicture from '@/components/ProfilePicture.vue';


</script>

<template>
    <div class="about-view">
        <h1>About</h1>
        <img src="/logo.svg" class="logo"/>
        <h2>Welcome to Rings</h2>
        <p>
            <i>Rings</i> is a welcoming social news aggregation website that focuses
            on building communities ("rings") and creating meaningful discussions.
        </p>
        <h2>Why Rings?</h2>
        <p>
            Rings is a project born from the passion for content-voting platforms such as HackerNews and Reddit. The whole idea started as an alternative platform for <a href="https://www.theverge.com/2023/6/8/23754780/reddit-api-updates-changes-news-announcements">the recent API changes that have basically killed third party apps</a>. <br/>
Our goal is to provide a backend that is compatible with the Reddit API, so that migrating the existing apps to Rings is as easy as changing the API endpoint. <br/>
On top of that, the long term goal is to provide a platform where the users are in control of the content and the website, and get some retribution for that. We want to put safeguards in place to avoid another situation like Twitter & Reddit. </br>
Our frontend code is open source (AGPLv3), and the backend code will soon be available as well licensed in the same way.
        </p>
        <h2>Features</h2>
        <p>
            Rings is still under development, but some features are already present:
        </p>
        <ul>
            <li>Sign up and login</li>
            <li>Comment on posts</li>
            <li>Upvote and downvote comments</li>
            <li>Partially view user profiles</li>
        </ul>

        <h2>Contribute</h2>
        <p>
            Rings is an open-source project, you can contribute to the project by giving your feedback and sharing your ideas.
        </p>
        <h3>Giving your feedback</h3>
        <p>
            There are different ways to give your feedback:
            <ol>
                <li>Open an issue on <a href="https://github.com/rings-social/frontend">GitHub</a></li>
                <li>Chat with us <a href="https://join.slack.com/t/ringssocial/shared_invite/zt-1xyl4xys4-fhjfig1CqmALL~cWqiIGcQ">on Slack</a></li>
                <li>Start a discussion on <a href="https://github.com/rings-social/frontend/discussions">GitHub</a></li>
                <li>Send me an email at denys@denv.it</li>
            </ol>
        </p>

        <h3>Adding features</h3>
        <p>
            You're welcome to contribute to the project by adding new features or fixing bugs.
            <br/>
            To do that, you can open a pull request on <a href="https://github.com/rings-social/frontend">frontend</a>.
        </p>
    </div>
</template>

<style scoped lang="scss">
.about-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 80vh;
    padding: 20px;

    .logo {
        height: 100px;
        width: 100px;
    }
}
</style>