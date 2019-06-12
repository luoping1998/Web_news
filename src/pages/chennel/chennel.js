import React, { Component } from 'react'
import '../../App.less'
import './chennel.less'

import {NavLink} from 'react-router-dom'
import instance from '../../http.js'

import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'

class NavItem  extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		let data = this.props.data;
		return (
			<a className="nav_item" onClick={this.props.bookDetails} href="javascript:;" id={data.id} >
				<h2>{data.title}</h2>
				<div className="item_dts">
					{data.pic ? <img src={data.pic}/> : ""}
					<div dangerouslySetInnerHTML = {{ __html:data.introduction }}></div>
				</div>
			</a>

		)
	}
}

class ItemBox extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		let data = this.props.data
		return (
			<a className="item_box" onClick={this.props.bookDetails} href="javascript:;" id={data.id}>
				<img src={data.pic}/>
				<h2>
					{data.title}
				</h2> 
			</a>
		)
	}
}

class Slider extends Component{
	constructor(props) {
		super(props);	
	}

	render() {
		let data = this.props.data;
		return (
			<a className="slide" onClick={this.props.bookDetails} href="javascript:;" id={data.id}>
				<img src={data.pic}/>
				<div className="tit">{data.title}</div>
			</a>
		)
	}
}

class Split extends Component{
	constructor(props){
		super(props)
	}

	render() {
		let data = this.props.data;
		return (
			<a className="sp_item" onClick={this.props.bookDetails} href="javascript:;" id={data.id}>
				<img src={data.pic}/>
					<div className="cont">
					<h3>{data.title}</h3>
					<p dangerouslySetInnerHTML = {{ __html:data.introduction }}></p>
				</div>
			</a>
		)
	}
}

class Chennel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'tech',
			page: 1,
			pageSize: 24,
			sdata: {},
			splits: [],
			nowcont: [],	//
			nowzixun: [],	//最新资讯
			nivitems: [],	//左部推荐
			itemboxs: []	//右部推荐
		}

		this.bookDetails = this.bookDetails.bind(this);
		this.doMount.bind(this);
	}

	doMount() {
		this.props.inload();
		let _this = this;
		instance.get(`/new/${this.state.type}/${this.state.page}/${this.state.pageSize}/detail`)
				.then(res => {
					let cont = res.data.data;
					_this.setState({
						sdata: cont[0],
						nowzixun: cont.slice(1, 8),
						nivitems: cont.slice(8, 13),
						itemboxs: cont.slice(13,21),
						splits: cont.slice(21, 24)
					},()=>{
						_this.props.loaded();
					})
				})
	}

	componentWillUpdate(nextProps) {
        let type = nextProps.location.pathname.split('/').pop();
        if(type !== this.state.type) {
        	this.setState({
        		type: type
        	},()=>{
        		this.doMount();
        	})
        }

    }

    componentDidMount() {
    	let type = this.props.location.pathname.split('/').pop();
    	this.setState({
        	type: type
        },()=>{
        	this.doMount();
        })
    }

	bookDetails(e) {
		let type = this.state.type, 
			id = e.currentTarget.id;
		this.props.history.push(`/news/${type}/${id}`)
	}

	render() {
		let phs = this.state.nowzixun.map((val, index) => (<a onClick={this.bookDetails} key={val.id} id={val.id} href="javascript:;">{index > 0 ? (<p >{val.title}</p>) : (<p className="main">{val.title}</p>)}</a>));
		let nivs = this.state.nivitems.map(val => (<NavItem data={val} key={val.id} bookDetails={this.bookDetails}/>))
		let items = this.state.itemboxs.map(val => (<ItemBox data={val} key={val.id} bookDetails={this.bookDetails}/>))
		let splits = this.state.splits.map(val => (<Split data={val} key={val.id} bookDetails={this.bookDetails}/>))
		return (
			<div className="chennel">
				<ul className="sub_bar">
					<NavLink activeClassName="link_act" to="/chennel/tech"><li>科技</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/fan"><li>娱乐</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/military"><li>时政</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/money"><li>财经</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/sport"><li>体育</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/funny"><li>搞笑</li></NavLink>
					<NavLink activeClassName="link_act" to="/chennel/more"><li>更多</li></NavLink>
				</ul>
				<div className="ch_main">
					<div className="up_nav">
						<Slider data={this.state.sdata} bookDetails={this.bookDetails}/>
						<div className="new_nav same_bd">
							<div className="same_hd">
								<h2>最新资讯</h2>
							</div>
							{phs}
						</div>
					</div>
					<div className="split_nav">
						{splits}
					</div>
					<div className="left_nav">
						{nivs}
					</div>
					<div className="rtf_nav">
						{items}
					</div>
				</div>
			</div>
		)
	}
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
	inload: () => dispatch(ACTIONS.Loading()),
	loaded: () => dispatch(ACTIONS.Loaded())
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Chennel)