import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'
import instance from '../../http.js'

import '../../App.less'

class Comment extends Component {
	constructor(props) {
		super(props)
		this.state = {
			type: this.props.news_type,
			id: this.props.news_id
		}
	}

	viewNews() {
		this.props.goNews(this.state.type, this.state.id);
	}

	render() {
		return (
			<div className="cmt_box">
				<h3>{this.props.news_title}</h3>
				<div className="cmt_cont">
					<img src={`http://118.89.221.170:8080/news/resources/pic/${this.props.pic}`}/>
					<h4>{this.props.userName}</h4>
				</div>
				<p>
					{this.props.comment_info}
					<a href="javascript:;" onClick={this.viewNews.bind(this)}>阅读全文</a>
				</p>
			</div>
		)
	}
}

 class Infor extends Component{
 	constructor(props) {
 		super(props);

 		this.state = {
 			act: 0,		//0为评论 1为点赞
 			comment: []
 		}
 		this.handleAct = this.handleAct.bind(this);
 	}

 	goNews(type, id) {
		this.props.history.push(`/news/${type}/${id}`)
 	}

 	handleAct(e) {
 		this.setState({
 			act: Number(e.target.getAttribute("index"))
 		})
 	}

 	componentDidMount() {
 		let _this = this;
 		instance.get(`new/showInfoInUserPage/${this.props.infor.userId}`,{
 			headers: {
 				"Authorization": localStorage.getItem("token")
 			}
 		}).then(res => {
 			console.log(res.data.data);
 			if(res.data.success) {
 				_this.setState({
 					comment: res.data.data
 				})
 			}
 		})
 	}

 	render() {
 		let cmts = this.state.comment.map((val, index) => {
 			return <Comment {...val} goNews={this.goNews.bind(this)} pic={this.props.infor.userPic} userName={this.props.infor.userName}/>
 		})
 		return (
 			<div className="infor">
 				<div className="up_side">
 					<div className="top_bg"></div>
 					<div className="bt_inf">
 						<img className="avater" src={`http://118.89.221.170:8080/news/resources/pic/${this.props.infor.userPic}`}/>
 						<div className="user_inf">
 							<h2>{this.props.infor.userName}</h2>
 							<p>{this.props.infor.userGraph}</p>
 						</div>
 						<div className="btn white change">
 							<NavLink to="/chinfor">
 								<a style={{"color": "#0077e6"}}>编辑个人资料</a>
 							</NavLink>
 						</div>
 					</div>
 				</div>
 				<div className="dn_side">
 					<div className="act_side">
 						<ul>
 							<a href="javascript:;">
 								<li className={this.state.act === 0 ? "act_li" : ""} 
 									index={0}
 									onClick={this.handleAct}>评论
 								</li>
 							</a>
 							<a href="javascript:;">
 								<li className={this.state.act === 1 ? "act_li" : ""} 
 									index={1}
 									onClick={this.handleAct}>点赞
 								</li>
 							</a>
 						</ul>
 						<div className="show_list">
 							{cmts}
 						</div>
 					</div>
 					<div className="inf_side">
 						<ul>
 							<li>
 								<h2>关注</h2>
 								<p>{this.props.infor.userFollow}</p>
 							</li>
 							<li className="no-bd">
 								<h2>粉丝</h2>
 								<p>{this.props.infor.userFans}</p>
 							</li>
 						</ul>
 					</div>
 				</div>
 			</div>
 		)
 	}
 }


const mapStateToProps = state => ({
	infor: state.infor
})

const mapDispatchToProps = dispatch => ({
	saveInfor: infor => dispatch(ACTIONS.saveInfor(infor))
})


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Infor)