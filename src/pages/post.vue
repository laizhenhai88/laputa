<template>
  <div class="layout-content-main">
    <Input v-model="group" placeholder="话题组"></Input>
    <br><br>
    <Input v-model="urls" type="textarea" :rows="10" placeholder="话题链接，必须带上http/https前缀，按回车分隔"></Input>
    <br><br>
    <Button type="primary" v-on:click="submit">提交</Button>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                group: '',
                urls: ''
            }
        },
        methods: {
          async submit () {
            let result = await this.$http.post(`/topic/`, this.$data);
            if (result.body.code == 1) {
              this.$Message.success('提交成功');
              this.$router.push({name: 'list'})
            } else {
              this.$Message.error('发布失败');
            }
          }
        }
    }
</script>
