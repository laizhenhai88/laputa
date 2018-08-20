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
    let res = await axios.get(Api.task.delayTasks)
    this.setState({loading: false, data: res.data})
  }

  runNow = async (task) => {
    await axios.post(Api.task.runDelayTaskNow, {_id: task._id});
    message.success('操作成功')
    this.props.timer.setTimeout(() => {
      this.props.history.push('/task/admin')
    }, 2000)
  }

  render() {
    const columns = [
      {
        title: '',
        dataIndex: 'xxx',
        key: 'xxx',
        render: (i, v) => {
          return <a href="###" onClick={() => {
              this.runNow(v)
            }}>立即执行</a>
        }
      }, {
        title: '待分配任务',
        dataIndex: 'xxx2',
        key: 'xxx2',
        render: (i, v) => {
          return <div>{JSON.stringify(v)}</div>
        }
      }
    ];

    return (<div>
      <Table columns={columns} bordered={true} pagination={false} rowKey='_id' dataSource={this.state.data} loading={this.state.loading}/>
    </div>)
  }
}

export default TimerWrapper(MyComponent)
