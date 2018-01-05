<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <Col span="5" class="layout-menu-left">
                <Menu :active-name="activeName" theme="dark" width="auto" :open-names="['1']" @on-select="select">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            话题
                        </template>
                        <MenuItem name="post">话题录入</MenuItem>
                        <MenuItem name="list">话题留存</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col span="19">
                <div class="layout-content">
                  <router-view></router-view>
                </div>
                <div class="layout-copy">
                    2011-2017 &copy; www.inewbit.com
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
      created: function(){
        this.$router.afterEach((to, from)=>{
          this.activeName = this.$router.currentRoute.name;
        });
      },
      methods: {
        select (name) {
          this.$router.push({name});
        }
      },
      data () {
        return {
          activeName: 'post'
        }
      }
    }
</script>
