import React, {Component} from 'react'
import{ HashRouter, Switch, Route, Redirect} from 'react-router-dom'
import './App.less'

import { connect } from 'react-redux'
import {ACTIONS} from './actions/index'

import Login from './pages/login/login.js'
import Load from './components/load.js'
import Pop from './components/pop.js'

import './App.less'

//引入components
import Header from './components/header/header.js'
import Home from './pages/home/home.js'
import Chennel from './pages/chennel/chennel.js'
import News from './pages/news/news.js'
import Infor from './pages/infor/infor.js'
import ChInfor from './pages/chinfor/chinfor.js'

class App extends Component{
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			mes: '',
			type: 0
		}
		this.showLogin = this.showLogin.bind(this);
		this.hiddenLogin = this.hiddenLogin.bind(this);
	}

	showLogin(e) {
		this.setState({
			show: true,
			type: Number(e.target.getAttribute("index"))
		})
	}

	hiddenLogin() {
		this.setState({
			show: false
		})
	}

	hasLog() {
		localStorage.setItem("log", true);
		this.props.hasLog();
	}

	notLog() {
		localStorage.clear()
		this.props.logOut();
	}

	cancel() {
		this.props.popHidden();
	}

	render() {
		return (
			<HashRouter>
				<div className="main_bd">
					{(this.props.pop.show===true) ? <Pop type={this.props.pop.type} words={this.props.pop.words} cancel={this.cancel.bind(this)}/> : "" }
					{this.props.load ? <Load /> : ""}
					<Header showLogin={this.showLogin.bind(this)} 
							log={this.props.log}
							notLog={this.notLog.bind(this)}/>
					{
						this.state.show ? (<Login hasLog={this.hasLog.bind(this)} hiddenLogin={this.hiddenLogin} type={this.state.type}/>) : ""
					}
					{

					}
					<Switch>
						<Redirect exact path="/" to={{pathname: "/home"}} />
						<Route path="/home" component={Home}/> 
						<Route path="/chennel" component={Chennel}/> 
						<Route path="/news" component={News} />
						<Route path="/infor" component={Infor} />
						<Route path="/chinfor" component={ChInfor} />
					</Switch>
					<div className="top_bar">
						<div className="report_item">
							<img src="//s3a.pstatp.com/toutiao/resource/ntoutiao_web/static/image/other/report_logo_15cc24e.png"/>
							<p>网上有害信息举报</p>
						</div>
						<div className="to_top">^</div>
					</div>
				</div>
			</HashRouter>
		)
	}
}

const mapStateToProps = state => ({
	load: state.load,
	log: state.log,
	pop: state.pop
})

const mapDispatchToProps = dispatch => ({
	logOut: ()=> dispatch(ACTIONS.logOut()),
	hasLog: () => dispatch(ACTIONS.hasLog()),
	popHidden: () => dispatch(ACTIONS.popHidden())
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)