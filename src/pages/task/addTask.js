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
  Spin
} from 'antd'
import axios from 'axios'
import Api from '../../lib/Api'

import TimerWrapper from '../../lib/TimerWrapper'

const {Meta} = Card
const {Item: FormItem} = Form
const {TextArea} = Input

class MyForm extends Component {
  async _handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (<Form onSubmit={this._handleSubmit.bind(this)}>
      <FormItem>
        {
          getFieldDecorator('task', {
            rules: [
              {
                required: true,
                message: '任务数据不能为空'
              }
            ]
          })(<TextArea disabled={this.props.disabled} autosize={true} placeholder=''/>)
        }
      </FormItem>
      <Button disabled={this.props.disabled} type="primary" htmlType="submit">提交</Button>
    </Form>)
  }
}

const NewForm = Form.create({
  mapPropsToFields(props) {
    let fields = {}
    for (let key in props.formState) {
      fields[key] = Form.createFormField({value: props.formState[key]})
    }
    return fields
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange && props.onFieldsChange(fields)
  }
})(MyForm)

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      form: {
        task: `
            {
              "type": "instagram/tag2tag",
              "delay": 0,
              "timeout": 600000000,
              "params": {
                "tag": "#yoga"
              }
            }
        `
      }
    }
  }

  async componentDidMount() {
  }

  async onFieldsChange(fields) {
    let form = this.state.form
    for (let key in fields) {
      form[key] = fields[key].value
    }
    this.setState({form})
  }

  async _handleSubmit(values) {
    this.setState({loading: true})
    let res = await axios.post(Api.task.addTask, JSON.parse(values.task))
    if (res.data.code == 1) {
      message.success('提交成功')
      // this.props.timer.setTimeout(()=>{
      //   this.props.history.push('/task/admin')
      // }, 2000)
    } else {
      message.error('提交失败')
    }
    this.setState({loading: false})
  }

  render() {
    return (<NewForm formState={this.state.form} onFieldsChange={this.onFieldsChange.bind(this)} onSubmit={this._handleSubmit.bind(this)}/>)
  }
}

export default TimerWrapper(MyComponent)
