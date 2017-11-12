<template>
  <div class="container" v-if='d.main'>
    <h1>{{d.main.title}}</h1>
    <p>{{d.main.time}}</p>
    <p>{{d.main.note}}</p>
    <img :src="'/' + d.main._id + '.jpg'">
    <img :src="'/' + item._id + '-image.jpg'" v-for="(item, index) in d.items" :key="index">
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      d:{
      }
    }
  },
  created: async function() {
    let result = await this.$http.get(`/fuli/detail/${this.id}`);
    this.d = result.body;
  },
  methods: {
  }
}
</script>

<style scoped>
.container{
  margin:0px auto;
  width: 1000px;
  text-align: center;
}
</style>
