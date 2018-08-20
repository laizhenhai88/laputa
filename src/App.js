import './App.css'
import React, {Component} from 'react'
import {Layout, Menu, Icon} from 'antd'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Home from './pages/home'
import admin from './pages/task/admin'
import addTask from './pages/task/addTask'
import delayTask from './pages/task/delayTask'
import list from './pages/task/list'

const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

class App extends Component {

  onMenuClick({item, key, keyPath}) {
    this.router.history.push(key)
  }

  render() {
    return (<Router ref={(router) => {
        this.router = router;
      }}>
      <Layout>
        <Header className="header">
          <div className="logo"/>
        </Header>
        <Layout>
          <Sider width={200} style={{
              background: '#fff'
            }}>
            <Menu mode="inline" defaultOpenKeys={['account']} style={{
                height: '100%',
                borderRight: 0
              }} onClick={this.onMenuClick.bind(this)}>
              <SubMenu key="account" title={<span> < Icon type = "laptop" /> 任务管理</span>}>
                <Menu.Item key="/task/admin">监控</Menu.Item>
                <Menu.Item key="/task/addTask">提交任务</Menu.Item>
                <Menu.Item key="/task/delayTask">延时任务</Menu.Item>
                <Menu.Item key="/task/list">任务列表</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{
              padding: '24px'
            }}>
            <Content style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 800
              }}>
              <Route exact={true} path="/" component={Home}/>
              <Route exact={true} path="/task/admin" component={admin}/>
              <Route exact={true} path="/task/addTask" component={addTask}/>
              <Route exact={true} path="/task/delayTask" component={delayTask}/>
              <Route exact={true} path="/task/list" component={list}/>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>)
  }
}

export default App
