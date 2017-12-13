<template>
  <div class="markdown-body">
    <markdown-readme></markdown-readme>
  </div>
</template>

<script>
// import VueMarkdown from 'vue-markdown';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';
import readMe from '../../README.md';


export default {
  name: 'Main',
  data() {
    return {
    };
  },
  computed: {

  },
  render: h => h(readMe),
  components: {
    'markdown-readme': readMe,
  },
};
</script>

<style >
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}
</style>
