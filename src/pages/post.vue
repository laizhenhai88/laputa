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
            let urls = [], splits = this.urls.split('\n');
            for (let i in splits) {
              if (splits[i].trim().length > 0) {
                urls.push(splits[i].trim());
              }
            }
            let result = await this.$http.post(`/topic/`, {group:this.group,urls:urls});
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
