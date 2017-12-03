<style scoped>
.header {
  text-align: center;
}
</style>
<template>
<div>
  <mt-header fixed title="话题监控"></mt-header>
  <mt-cell title="任务监控" :to="{name:'admin'}" is-link value="">
  </mt-cell>
  <h3 class="header">话题组</h3>
  <mt-cell v-for="item in list" :key="item._id" :title="item.group" :value="item.createTime" :to="{name: 'detail', params: {_id: item._id}}" is-link></mt-cell>
</div>
</template>
<script>
export default {
  created: async function() {
    let result = await this.$http.get(`/topic/`);
    this.list = result.body;
  },
  data() {
    return {
      list: []
    }
  }
}
</script>
