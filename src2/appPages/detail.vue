<template>
<div>
  <mt-header fixed :title="`${detail.group} ${analysis}`"></mt-header>
  <mt-cell v-for="item,index in detail.detail" :key="item.url" :title="item.alive" :value="item.createTime"></mt-cell>
</div>
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
      detail: {}
    }
  },
  computed: {
    analysis: function() {
      let count = this.detail.detail.length;
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
