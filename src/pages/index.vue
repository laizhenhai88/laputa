<template>
<Scroll :on-reach-bottom="handleReachBottom" height="300">
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
    async handleReachBottom() {
      await new Promise((resolve)=>{
        setTimeout(()=>{
          resolve();
        }, 1000);
      });
      this.page++;
      let result = await this.$http.get(`/fuli/${this.page}`);
      for (let i in result.body) {
        this.list.push(result.body[i]);
      };
    }
  }
}
</script>

<style scoped>
/*html,body{
  width: 100%;
  height: 100%;
}*/
</style>
