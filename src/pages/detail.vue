<style>
.ivu-table .table-info-row-alive td{
  background-color: #2db7f5;
  color: #fff;
}
.ivu-table .table-info-row-dead td{
  background-color: #f60;
  color: #fff;
}
</style>
<template>
<Row>
  <Col span="24">
  <Card>
    <p slot="title">{{detail.group}} {{analysis}}</p>
    <Table :columns="columns" :data="detail.detail" :row-class-name="rowClassName"></Table>
  </Card>
  </Col>
</Row>
</template>
<script>
export default {
  props: ['_id'],
  created: async function() {
    let result = await this.$http.get(`/topic/detail/${this._id}`);
    this.detail = result.body;
  },
  data() {
    return {
      columns: [{
          title: 'URL',
          key: 'url'
        },
        {
          title: 'createTime',
          key: 'createTime'
        },
        {
          title: '1秒钟',
          key: 'sec'
        },
        {
          title: '1分钟',
          key: 'min'
        },
        {
          title: '10分钟',
          key: 'tenMin'
        },
        {
          title: '1小时',
          key: 'hour'
        },
        {
          title: '1天',
          key: 'day'
        }
      ],
      detail: {}
    }
  },
  computed: {
    analysis: function(){
      if (this.detail.detail) {
        let alive = 0;
        for (let i in this.detail.detail) {
          if (this.detail.detail[i].alive) {
            alive++;
          }
        }
        return `[${alive}/${this.detail.detail.length}] ${alive*100/this.detail.detail.length}%`;
      } else {
        return '';
      }
    }
  },
  methods: {
    rowClassName(row, index) {
      if (row.alive) {
        return 'table-info-row-alive';
      }
      return 'table-info-row-dead';
    }
  }
}
</script>
