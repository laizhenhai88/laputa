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
const Search = Input.Search

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }

    this.filters = {}
  }

  async componentDidMount() {
    this.props.timer.setIntervalRunNow(this._load.bind(this), 10 * 1000)
  }

  async _load() {
    this.setState({loading: true})
    let res = await axios.post(Api.task.list, {filters: this.filters})
    this.setState({loading: false, data: res.data.data})
  }

  runAgain = async (task) => {
    delete task.status
    delete task.result
    delete task.finishTime
    delete task.createTime
    let res = await axios.post(Api.task.addTask, task)
    if (res.data.code == 1) {
      message.success('提交成功')
      this.props.timer.setTimeout(()=>{
        this.props.history.push('/task/admin')
      }, 2000)
    } else {
      message.error('提交失败')
    }
  }

  render() {
    const columns = [
      {
        title: '',
        dataIndex: 'xxx',
        key: 'xxx',
        render: (i, v) => {
          return <a href="###" onClick={() => {
              this.runAgain(v)
            }}>重新提交</a>
        }
      }, {
        title: '任务',
        dataIndex: 'xxx2',
        key: 'xxx2',
        render: (i, v) => {
          return <div>{JSON.stringify(v)}</div>
        }
      }
    ];

    return (<div>
      <Search style={{
          width: 500
        }} placeholder="查询条件JSON格式" onSearch={(f) => {
          this.filters = JSON.parse(f)
          this._load()
        }}/>
        <br/><br/>
      <Table columns={columns} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.data} loading={this.state.loading}/>
    </div>)
  }
}

export default TimerWrapper(MyComponent)
