import React, {Component} from 'react'
function TimerWrapper(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.timerids = {
        setTimeout: [],
        setInterval: []
      }
      this.timer = {
        setTimeout: (cb, t) => {
          let id = setTimeout(cb, t)
          this.timerids.setTimeout.push(id)
          return id
        },
        setInterval: (cb, t) => {
          let id = setInterval(cb, t)
          this.timerids.setInterval.push(id)
          return id
        },
        setIntervalRunNow: (cb, t) => {
          let id = setInterval(cb, t)
          this.timerids.setInterval.push(id)
          cb()
          return id
        }
      }
    }

    componentDidMount() {}

    componentWillUnmount() {
      this.timerids.setTimeout.forEach(id => clearTimeout(id))
      this.timerids.setInterval.forEach(id => clearInterval(id))
    }

    render() {
      return <WrappedComponent timer={this.timer} {...this.props}/>;
    }
  };
}

export default TimerWrapper
