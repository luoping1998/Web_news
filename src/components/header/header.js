import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import '../../App.less'

import { connect } from 'react-redux'
import {ACTIONS} from '../../actions/index'

class Header extends Component{
	constructor(props) {
		super(props);
	}

	logOut() {
		this.props.logOut();
		this.props.showSuc('用户已退出');
	}

	render() {
		return (
			<div className="news_header">
				<div className="header_bd">
					<ul className="bd_lft">
						<NavLink to="/"><div className="bd_icon"></div></NavLink>
						<NavLink to="/home" activeClassName="link_act"><li>推荐</li></NavLink>
						<NavLink to="/chennel/tech" activeClassName="link_act"><li>频道</li></NavLink>
						<li></li>
						<li>
							<input type="text"/>
							<a href="javascript:;" className="btn blue">搜索</a>
						</li>
					</ul>
					{
						this.props.log ? 
						(					
							<div className="bd_rgt">
								<NavLink to="/infor"><img className="avater" src={`http://118.89.221.170:8080/news/resources/pic/${this.props.infor.userPic}`}/></NavLink>
								<a href="javascript:;" onClick={this.logOut.bind(this)}>退出</a>
							</div>
						) : 
						(
							<div className="bd_rgt">
								<a href="javascript:;" className="btn white" onClick={this.props.showLogin} index={0}>登录</a>
								<a href="javascript:;" className="btn blue" onClick={this.props.showLogin} index={1}>加入看点</a>
							</div>
						)
					}
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	log: state.log,
	infor: state.infor
})

const mapDispatchToProps = dispatch => ({
	logOut: () => (dispatch(ACTIONS.logOut())),
	showSuc: (words) => (dispatch(ACTIONS.showSuc(words)))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header)
