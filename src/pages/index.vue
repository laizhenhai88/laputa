<template>
<Scroll :on-reach-bottom="handleReachBottom" height="auto">
  <Row :gutter="16">
    <Col span="6" v-for="(item, index) in list" :key="index">
      <Card>
        <div style="text-align:center">
          <img :src="'/' + item._id + '.jpg'" style="width:100%;">
          <h3>{{item.title}}</h3>
        </div>
      </Card>
    </Col>
  </Row>
</Scroll>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      page: 1
    }
  },
  created: async function() {
    let result = await this.$http.get(`/fuli/1`);
    this.list = result.body;
  },
  methods: {
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i);
          }
          resolve();
        }, 2000);
      });
    }
  }
}
</script>
