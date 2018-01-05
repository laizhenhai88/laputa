<template>
<div class="layout-content-main">
  <Table :columns="columns" :data="list"></Table>
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
      columns: [
        {
          title: '话题组',
          key: 'group',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: {name: 'detail', params: {_id: params.row._id}}
              }
            }, [params.row.group]);
          }
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
      ],
      list: []
    }
  }
}
</script>
