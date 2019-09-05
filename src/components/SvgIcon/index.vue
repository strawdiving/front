<template>
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
  import "@/assets/iconfont/iconfont"
    export default {
      name: "svg-icon",
      props: {
        iconClass: {
          type: String,
          required: true
        }
      },
      computed: {
        iconName() {
          return `#icon-${this.iconClass}` //模板字符串（见MDN)，用反引号
        }
      }
    }
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
