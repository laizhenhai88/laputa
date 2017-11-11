<template>
<Scroll :on-reach-bottom="handleReachBottom" height="auto">
  <Row :gutter="16">
    <router-link target='_blank' :to="{name:'detail',params:{id:item._id}}" v-for="(item, index) in list" :key="index">
      <Col class-name='cell' span="6">
        <Card>
          <div style="text-align:center">
            <img :src="'/' + item._id + '.jpg'" style="width:100%;">
            <h3 class='title'>{{item.title}}</h3>
          </div>
        </Card>
      </Col>
    </router-link>
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

<style>
html,body,.ivu-scroll-wrapper,.ivu-scroll-container{
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
.title{
  height:50px;
  overflow: hidden;
}
.cell{
  margin-bottom: 10px;
}
</style>
