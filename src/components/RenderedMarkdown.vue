<script lang="ts" setup>
import { marked } from 'marked';
import createDOMPrufiy from 'dompurify';
import { computed } from 'vue';

const props = defineProps({
    markdown: {
        type: String,
        required: true
    }
});

const dompurify = createDOMPrufiy(window);
const c = computed(() => {
    return {
        renderedBody: (body: string) => {
            const renderedMd = marked.parse(body);
            const sanitized = dompurify.sanitize(renderedMd,
                {ALLOWED_TAGS: ['b', 'i', 'em', 'li', 'ul', 'ol', 'strong', 'a', 'code', 'pre', 'br', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
            );
            return sanitized;
        },
    }
});
</script>

<template>
    <div class="rendered-markdown" v-html="c.renderedBody(props.markdown)">
    </div>
</template>

<style lang="scss">
.rendered-markdown {
    a {
        color: var(--color-link);

        &:visited {
            color: var(--color-link-visited);
        }
    }

    pre {
        display: block;
        margin-top: 1em;
        margin-bottom: 1em;

        code {
            display: block;
            margin-top: 5px;
            background-color: var(--color-code-background);
            padding: var(--code-block-padding);
        }
    }

    p {
        code {
            background-color: var(--color-code-background);
            padding: var(--code-inline-padding);
        }
    }
}</style>