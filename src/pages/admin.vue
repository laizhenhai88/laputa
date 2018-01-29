<template>
<div class="layout-content-main">
  <Alert :type="pause?'error':'success'" show-icon>{{pause?'调度暂停':'调度进行中'}}</Alert>
  <Table :columns="columns" :data="list"></Table>
  <br>
  <Table :columns="columnsGroup" :data="groups"></Table>
  <br>
  <Button :type="pause?'success':'error'" v-on:click="toggle" long>{{pause?'启动调度':'暂停调度'}}</Button>
</div>
</template>
<script>
export default {
  created: async function() {
    let result = await this.$http.get(`/tm/monitor`);
    this.list = [result.body];
    let groups = []
    for (let key in result.body.groups) {
      result.body.groups[key].id = key
      groups.push(result.body.groups[key])
    }
    this.groups = groups;
    this.pause = result.body.pause;
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
      columnsGroup: [{
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
      groups: [],
      pause: false
    }
  },
  methods: {
    toggle: async function() {
      await this.$http.post(`/tm/pause/toggle`);
      this.pause = !this.pause;
      this.$Message.success('操作成功');
    }
  }
}
</script>
