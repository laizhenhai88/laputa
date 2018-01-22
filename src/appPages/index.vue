<style scoped>
.header {
  text-align: center;
}
</style>
<template>
<div>
  <mt-header fixed title="laputa"></mt-header>
  <mt-cell title="任务监控" :to="{name:'admin'}" is-link value="">
  </mt-cell>
</div>
</template>
<script>
export default {
  created: async function() {
  },
  data() {
    return {
    }
  }
}
</script>
