import React, {Component} from 'react'
import request from 'superagent'
import Payment from './Payment'
import Transactions from './Transactions'

export default class Overview extends Component {
  constructor(props){
    super(props)
    this.state = {
      balance: '',
      name: '',
      view:'',
      logs:{}
    }
  }

  getLogs(){
    request.get('/api/user/history').end(function(err, res){
      console.log('error', err)
      var data = JSON.parse(res.text)
      this.setState(Object.assign({},this.state,{logs: data}))
    }.bind(this))
  }

  componentDidMount(){
    this.getLogs()
    request.get('/api/user').end(function(err, res){
      console.log('error', err)
      var { first_name, balance } = JSON.parse(res.text)
      console.log('first', first_name)
      this.setState({ name: first_name, balance: balance })
    }.bind(this))

  }
  showLogs(){
    this.getLogs()
    this.setState(Object.assign({},this.state,{view: 'logs'}))
  }

  showForm(){
    this.setState(Object.assign({},this.state,{view: 'form'}))
  }
  handleTransition(amount){
    this.setState(Object.assign({},this.state,{balance: Number(this.state.balance)-Number(amount)}))
  }

  render(){

    return(
      <div>
        <h1>Hello {this.state.name}</h1>
        <h3>Your balance is </h3><h2>$ {this.state.balance}</h2>
        <h4>Would you like to:</h4>
        <button className='btn btn-default' onClick={this.showLogs.bind(this)}>View Transaction History</button>
        <button className='btn btn-primary' onClick={this.showForm.bind(this)}>Make a Payment</button>
        <div className={this.state.view=='form'? "active": 'hide'}>
          <Payment handleTransition={this.handleTransition.bind(this)}/>
        </div>
        <div className={this.state.view=='logs'? "active": 'hide'}>
          <Transactions logs={this.state.logs}/>
        </div>
      </div>
    )
  }
}
