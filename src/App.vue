<template>
  <div id="app">
    <top />
    <index />
  </div>
</template>

<script>
import top from "./page/01.top";
import index from "./page/02.index";
export default {
  name: "app",
  components: {
    top,
    index
  },
  watch: {
    $route: function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
};
</script>

<style>
</style>