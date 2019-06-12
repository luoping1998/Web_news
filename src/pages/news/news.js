import React, {Component} from 'react'
import instance from '../../http.js'

import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'

const Nothing = () => {
	return (
		<div className="nothing">
			<div className="pic"></div>
			<p>还没有人评论呢...</p>
		</div>
		)
}
class CmtItem extends Component{

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="cmt_item">
				<img className="avater" src={`http://118.89.221.170:8080/news/resources/pic/${this.props.data.userPic}`}/>
				<div className="item_cont">
					<p className="user">{this.props.data.userName} <span>{this.props.data.commentTime}</span></p>
					<p className="cont">{this.props.data.commentInfo}</p>
					<p className="reply">回复 · {0}条回复</p>
				</div>
				<div className="cmt_act">
					<div className="act">
						<a className="like" href="javascript:;" id={this.props.data.commentId} onClick={this.props.handleClick}/>
						<p>{this.props.data.commentIden}</p>
					</div>

				</div>
			</div>
		)
	}
}

const ItemAll = ({data, handleClick}) => {
	return (
		<div className="news_item">
			<img className="news_img" src={data.pic}/>
			<div className="news_words">
				<p><a href="javascript:;" onClick={handleClick} id={data.id}>{data.title}</a></p>
				<p>{data.source}· 评论 {data.commentList.length}</p>
			</div>
		</div>
	)
}

class News extends Component {
	constructor(props){
		super(props);
		this.state = {
			data: {},
			comment: [],
			recds: [],
			id: 0,
			type: undefined,
			page: 1,
			pageSize: 5,
			val: ""
		}
	}

	bookDetails(e) {
		let type = this.state.type, 
			id = e.currentTarget.id;
		this.props.history.push(`/news/${type}/${id}`)
	}

	doMount(type, id) {
		let _this = this;
		instance.get(`new/detailWith/${type}/${id}`)
				.then(res => {
					_this.setState((state, props) => {
						return {
							type: type,
							id: id,
							data: Object.assign({}, _this.state.data, res.data.data),
							comment: res.data.data.commentList
						}
					}, () => {
						_this.doRecd(type, id);
					})
				})

	}

	doRecd(type, id) {
		let _this = this;
		instance.get(`new/${type}/${this.state.page}/${this.state.pageSize}/detail`)
				.then(res => {
					_this.setState({
						recds: res.data.data
					})
				})
	}

	mountMore() {
		let _this = this;
		let count = this.state.page + 1;
		instance.get(`new/${this.state.type}/${count}/${this.state.pageSize}/detail`)
				.then(res => {
					_this.setState((state, props) => {
						return {
							recds: state.recds.concat(res.data.data),
							page: state.page+1
						}
					})
				})
	}

	addComment() {
		if(this.state.val) {
			let _this = this;
			instance.post(`new/addComment/${this.state.type}`, {
				"commentInfo": this.state.val,
				"commentNewsId": Number(this.state.id),
				"commentUserId": this.props.infor.userId,
				"commentTime": new Date().getTime()
			},{
				headers: {
					"Authorization": localStorage.getItem("token")
				} 
			}).then(res => {
				if(res.data.success){
					_this.props.showSuc('评论成功！');
					_this.setState((state, props) => {
						return {
							comment: state.comment.concat([res.data.comment])
						}
					})
				}else {
					_this.props.showFail(res.data.failure);
				}
			})
		}
	}

	handleChange(e) {
		this.setState({
			val: e.target.value
		})
	}

	addHumbs(e) {
		let id = e.target.id;
		console.log(id);
		instance.get(`new/give-the-humbs-up/${this.state.type}`,{
			params: {
				commentId: id
			},
			headers: {
				"Authorization": localStorage.getItem("token")
			}
		}).then(res => {
			console.log(res);
		})
	}

	componentDidMount() {
		let arr = this.props.history.location.pathname.split('/')
		let id = arr.pop();
		let type = arr.pop();
		this.doMount(type, id);
	}

	componentWillUpdate() {
    	let arr = this.props.history.location.pathname.split('/')
		let id = arr.pop();
		if(this.state.id !== id) {
			let type = arr.pop();
			this.doMount(type, id);
		}
	}

	render() {
		let recds = this.state.recds.map(val => (<ItemAll data={val} key={val.id} handleClick={this.bookDetails.bind(this)}/>))
		let cmts = this.state.comment.map(val => (<CmtItem data={val} key={val.commentId} handleClick={this.addHumbs.bind(this)}/>))
		return (
			<div className="news">
				<div className="news_bd">
					<h1>{this.state.data.title}</h1>
					<p className="gray"><span className="type">{this.state.data.type}</span>{this.state.data.source} {this.state.data.datetime}</p>
					<div className="article" dangerouslySetInnerHTML = {{ __html:this.state.data.introduction}}>
					</div>
					<div className="cmt_bd">
						<div className="cmt_ipt">
							<img className="avater" src={`http://118.89.221.170:8080/news/resources/pic/${this.props.infor.userPic}`}/>
							<input type="text" className="cmt_input" value={this.state.val} onChange={this.handleChange.bind(this)}/>
							<a className="btn blue" onClick={this.addComment.bind(this)} href="javascript:;">提交</a>
						</div>
						{
							cmts.length ? cmts : (<Nothing />)
						}
					</div>
				</div>
				<div className="news_more">
					<div className="same_hd">
						<h2>相似推荐</h2>
						{recds}
						<a className="get_more" onClick={this.mountMore.bind(this)} href="javascript:;">加载更多...</a>
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
	showSuc: words => dispatch(ACTIONS.showSuc(words)),
	showFail: words => dispatch(ACTIONS.showFail(words)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps

)(News)