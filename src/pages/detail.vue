<style>
.ivu-table .table-info-row-alive td {
  background-color: #2db7f5;
  color: #fff;
}

.ivu-table .table-info-row-dead td {
  background-color: #f60;
  color: #fff;
}

.ivu-table .table-info-row-total td {
  background-color: #187;
  color: #fff;
}
</style>
<template>
<div class="layout-content-main">
  <Row>
    <Col span="24">
    <Card>
      <p slot="title">{{detail.group}} {{analysis}}</p>
      <Table :columns="columns" :data="detail.detail" :row-class-name="rowClassName"></Table>
    </Card>
    </Col>
  </Row>
</div>
</template>
<script>
export default {
  props: ['_id'],
  created: async function() {
    let result = await this.$http.get(`/topic/detail/${this._id}`);
    let sec=0,min=0,tenMin=0,hour=0,day=0;
    let count = result.body.detail.length;
    for (let i in result.body.detail) {
      if (result.body.detail[i].sec) sec++;
      if (result.body.detail[i].min) min++;
      if (result.body.detail[i].tenMin) tenMin++;
      if (result.body.detail[i].hour) hour++;
      if (result.body.detail[i].day) day++;
    }
    result.body.detail.unshift({
      alive: true,
      sec: Math.floor(sec*100/count) + '%',
      min: Math.floor(min*100/count) + '%',
      tenMin: Math.floor(tenMin*100/count) + '%',
      hour: Math.floor(hour*100/count) + '%',
      day: Math.floor(day*100/count) + '%',
    });
    this.detail = result.body;
  },
  data() {
    return {
      columns: [{
          title: 'URL',
          key: 'url',
          render: (h, params) => {
            return h('a', {
              attrs: {
                href: params.row.url,
                target: '_blank'
              }
            }, [params.row.url]);
          }
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
    analysis: function() {
      let count = this.detail.detail.length-1;
      if (this.detail.detail) {
        let alive = 0;
        for (let i in this.detail.detail) {
          if (this.detail.detail[i].url && this.detail.detail[i].alive) {
            alive++;
          }
        }
        return `[${alive}/${count}] ${Math.floor(alive*100/count)}%`;
      } else {
        return '';
      }
    }
  },
  methods: {
    rowClassName(row, index) {
      if (!!!row.url) {
        return 'table-info-row-total';
      }
      if (row.alive) {
        return 'table-info-row-alive';
      }
      return 'table-info-row-dead';
    }
  }
}
</script>
