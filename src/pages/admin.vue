<template>
<div class="layout-content-main">
  <Table :columns="columns" :data="list"></Table>
</div>
</template>
<script>
export default {
  created: async function() {
    let result = await this.$http.get(`/monitor/`);
    this.list = [result.body];
  },
  data() {
    return {
      columns: [
        {
          title: '进行中任务',
          key: 'runningWorkers',
          // render: (h, params) => {
          //   return h('router-link', {
          //     props: {
          //       to: {name: 'detail', params: {_id: params.row._id}}
          //     }
          //   }, [params.row.group]);
          // }
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
      list: []
    }
  }
}
</script>
