import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {Icon, Table, Divider, Upload, message} from 'antd'

const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: false,
  action: '/api/plugin/upload',
  beforeUpload(file, fileList) {
    let valid = /^[\w\.]+$/.test(file.name)
    if (!valid) {
      message.error('文件名不合法')
    }
    return valid
  }
};

const columns = [
  {
    title: '插件名称',
    dataIndex: 'pluginName',
    key: 'pluginName'
  }, {
    title: '最后更新时间',
    dataIndex: 'version',
    key: 'version'
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (<span>
      <a target='_self' href={`/api/plugin/download/${record.pluginName}`}>下载</a>
    </span>)
  }
];

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  async componentDidMount() {
    let response = await fetch('/api/plugin/')
    if (response.ok) {
      let body = await response.json()
      this.setState({data: body})
    }
  }

  onChange(info) {
    info.file.name = info.file.originFileObj.name
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`)
      let data = this.state.data.filter(v => v.pluginName != info.file.name)
      data.unshift(info.file.response)
      this.setState({data: data})
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }
  }

  render() {
    return (<div>
      <Dragger {...props} onChange={this.onChange.bind(this)}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox"/>
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">同名文件覆盖更新，文件名必须由数字、英文、下划线、小数点组成</p>
      </Dragger>
      <br/>
      <Table pagination={false} columns={columns} rowKey='_id' dataSource={this.state.data}/>
    </div>)
  }
}

export default MyComponent
