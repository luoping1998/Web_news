import React, {Component} from 'react'

import '../../App.less'

import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'

import FadeSlide from '../../components/slider.js'
import Load from '../../components/load.js'
import instance from '../../http.js'

//图片 + 主题 + 类型 + 来源
const ItemAll = ({data, handleClick}) => {
	return (
		<a className="news_item" type={data.type} id={data.id} onClick={handleClick} href="javascript:;">
			<img className="news_img" src={data.pic}/>
			<div className="news_words">
				<h2>{data.title}</h2>
				<p><span className="type">{data.type}</span> {data.source} · 评论{data.commentList.length} · {data.datetime}</p>
			</div>
		</a>
	)
}

//仅主题
const ItemEasy = ({data, handleClick}) => {
	return (
		<div className="news_words all" type={data.type} id={data.id} onClick={handleClick}>
			<h2>{data.title}</h2>
			<p><span className="type">{data.type}</span> {data.source} · 评论{data.commentList.length} · {data.datetime}</p>
		</div>
	)
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: 1,
			pageSize: 15,
			mains: []
		}
	}

	getMore() {
		let _this = this;
		let count = this.state.page + 1;
		instance.get(`new/home/${count}/${this.state.pageSize}/detail`)
				.then(res => {
					_this.setState((state, props) => {
						return {
							mains: state.mains.concat(res.data.data),
							page: state.page + 1
						}
					})
				})
	}

	
	componentWillMount() {
		this.props.inload();
		let _this = this;
		instance.get(`new/home/${this.state.page}/${this.state.pageSize}/detail`)
				.then(res => {
					_this.setState({
						data: res.data.data
					}, ()=>{
						_this.props.loaded();
					})
				})
		this.getMore();
	}

	handleClick(e) {
		let type = e.currentTarget.type, 
			id = e.currentTarget.id;
		this.props.history.push(`/news/${type}/${id}`)
	}

	render() {
		let arr = this.state.data.slice(0, 5);
		let alls = this.state.data.slice(5,15).map((val, index) => {
			return val.pic ? (<ItemAll data={val} index={index} handleClick={this.handleClick.bind(this)}/>) : (<ItemEasy data={val} index={index} handleClick={this.handleClick.bind(this)}/>)
		})

		let phs = this.state.mains.map((val, index) => {
			return (<a href="javascript:;" onClick={this.handleClick.bind(this)} key={index} id={val.id} type={val.type}><p className={(index % 5 == 0) ? "main" : ""}>{val.title}</p></a>)
		})
		return (

			<div className="news_main">
				<div className="main_bd">
					<div className="slide">
						<FadeSlide imgs={arr} />
					</div>
					<div className="news_wipper">
						{alls}
					</div>
				</div>

				<div className="hot_bd same_bd">
					<div className="same_hd"><h2>热闻要点</h2></div>
					{phs}
					<div className="get_more" onClick={this.getMore.bind(this)}>加载更多...</div>
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
)(Home)