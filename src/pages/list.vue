<template>
  <div class="layout-content-main">
    <Row v-for="(item, index) in list" :key="item._id">
      <Col>
        <router-link :to="{name:'detail',params:{_id:item._id}}"><h2>{{item.group}} {{item.createTime}}</h2></router-link>
      </Col>
    </Row>
  </div>
</template>
<script>
    export default {
        created: async function() {
          let result = await this.$http.get(`/topic/`);
          this.list = result.body;
        },
        data () {
            return {
                list: []
            }
        }
    }
</script>
