import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {
  Icon,
  Table,
  Divider,
  Upload,
  message,
  Switch,
  Card,
  Button,
  Input,
  Form,
  Spin,
  Alert
} from 'antd'
import axios from 'axios'
import Api from '../../lib/Api'

import TimerWrapper from '../../lib/TimerWrapper'

const {Meta} = Card
const {Item: FormItem} = Form
const {TextArea} = Input

const columns = [
  {
    title: '进行中任务',
    dataIndex: 'runningWorkers',
    key: 'runningWorkers'
  }, {
    title: '待分配任务',
    dataIndex: 'tasks',
    key: 'tasks'
  }, {
    title: '偷懒的工人',
    dataIndex: 'workers',
    key: 'workers'
  }, {
    title: '延时的任务',
    dataIndex: 'delayTasks',
    key: 'delayTasks'
  }, {
    title: 'addTask溢出',
    dataIndex: 'addTaskOut',
    key: 'addTaskOut'
  }
];

const columnsGroup = [
  {
    title: '任务组id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '任务组cb',
    dataIndex: 'done',
    key: 'done'
  }, {
    title: '数量',
    dataIndex: 'count',
    key: 'count'
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }
];

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }
  }

  async componentDidMount() {
    this.props.timer.setIntervalRunNow(this._load.bind(this), 10 * 1000)
  }

  async _load() {
    this.setState({loading: true})
    let res = await axios.get(Api.task.monitor)
    let groups = []
    for (let key in res.data.groups) {
      res.data.groups[key].id = key
      groups.push(res.data.groups[key])
    }
    this.setState({
      loading: false,
      data: [res.data],
      groups,
      pause: res.data.pause
    })
  }

  async _onClick() {
    await axios.post(Api.task.toggle);
    this.setState({
      pause: !this.state.pause
    })
    message.success('操作成功')
  }

  render() {
    return (<div>
      <Alert message={this.state.pause
          ? '调度暂停'
          : '调度进行中'} type={this.state.pause
          ? 'error'
          : 'success'} showIcon="showIcon"/>
      <br/>
      <Table columns={columns} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.data} loading={this.state.loading}/>
      <br/>
      <Table columns={[{
            title: '进行中任务分析',
            dataIndex: 'runningTaskAnalyze',
            key: 'runningTaskAnalyze'
          }
        ]} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.data} loading={this.state.loading}/>
      <br/>
      <Table columns={[{
            title: '待分配任务分析',
            dataIndex: 'taskAnalyze',
            key: 'taskAnalyze'
          }
        ]} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.data} loading={this.state.loading}/>
      <br/>
      <Table columns={columnsGroup} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.groups} loading={this.state.loading}/>
      <br/>
      <Button type={this.state.pause
          ? 'primary'
          : 'danger'} style={{
          width: '100%'
        }} onClick={this._onClick.bind(this)}>{
          this.state.pause
            ? '启动调度'
            : '暂停调度'
        }</Button>
    </div>)
  }
}

export default TimerWrapper(MyComponent)
