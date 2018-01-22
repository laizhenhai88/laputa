<template>
<div class="layout-content-main">
  <Table :columns="columns" :data="list"></Table>
  <br>
  <Table :columns="columnsGroup" :data="groups"></Table>
</div>
</template>
<script>
export default {
  created: async function() {
    let result = await this.$http.get(`/monitor`);
    this.list = [result.body];
    let groups = []
    for (let key in result.body.groups) {
      result.body.groups[key].id = key
      groups.push(result.body.groups[key])
    }
    this.groups = groups;
  },
  data() {
    return {
      columns: [{
          title: '进行中任务',
          key: 'runningWorkers',
        },
        {
          title: '待分配任务',
          key: 'tasks'
        },
        {
          title: '偷懒的工人',
          key: 'workers'
        },
        {
          title: '延时的任务',
          key: 'delayTasks'
        },
      ],
      columnsGroup: [
        {
          title: '任务组id',
          key: 'id',
        },
        {
          title: '任务组cb',
          key: 'done',
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
      ],
      list: [],
      groups: []
    }
  }
}
</script>
