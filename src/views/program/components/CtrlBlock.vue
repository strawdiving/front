<template>
  <div class="block-container">
    <div class="inner-container" :class="unsaved?'unsaved-style':''">
      {{type}}
    </div>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      label: "",
      icon: "",
    }
  },
  props:{
    type: {
      type: String,
      required: true,
      default: 'block'
    },
    unsaved: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped>
.block-container {
  display: inline-block;
  width: 55px;
  height: 55px;
}

.inner-container {
  width: 100%;
  height: 100%;
  border: 1px solid #888;
  border-radius: 1px;
  background: cornflowerblue;
  display: -webkit-box;
  -webkit-box-pack:center;
  -webkit-box-align:center;
  cursor: default;
  font-size: 13px;
}
.unsaved-style {
  font-style: italic;
}
</style>
