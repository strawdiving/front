<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive exclude="threeD">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      key() {
        return this.$route.fullPath
      }
    }
  }
</script>

<style scoped>
  .app-main {
    /*navbar  = 70  */
    min-height: calc(100vh - 70px);
    width: 100%;
    position: relative;
    /*overflow-y: scroll;*/
  }
</style>
