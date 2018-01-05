<template>
  <div>
    <mt-header fixed title="任务监控"></mt-header>
    <mt-cell title="进行中任务" :value="data.runningWorkers"></mt-cell>
    <mt-cell title="待分配任务" :value="data.tasks"></mt-cell>
    <mt-cell title="偷懒的工人" :value="data.workers"></mt-cell>
    <mt-cell title="延时的任务" :value="data.delayTasks"></mt-cell>
  </div>
</template>
<script>
export default {
  created: async function() {
    let result = await this.$http.get(`/monitor/`);
    this.data = result.body;
  },
  data() {
    return {
      data: {}
    }
  }
}
</script>
