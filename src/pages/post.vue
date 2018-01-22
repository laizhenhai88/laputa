<template>
  <div class="layout-content-main">
    <Input v-model="task" type="textarea" :rows="20"></Input>
    <br><br>
    <Button type="primary" v-on:click="submit">提交</Button>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                task: `
                  {
                    "type": "fuli/p0/list",
                    "delay": 0,
                    "group": {
                      "id": "fuli",
                      "done": "fuli/p0/list"
                    },
                    "params": {
                      "page": 1
                    }
                  }
                `
            }
        },
        methods: {
          async submit () {
            let result = await this.$http.post(`/addTask`, JSON.parse(this.task));
            if (result.body.code == 1) {
              this.$Message.success('提交成功');
              this.$router.push({name: 'admin'});
            } else {
              this.$Message.error('发布失败');
            }
          }
        }
    }
</script>
