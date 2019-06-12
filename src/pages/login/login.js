import React, {Component} from 'react'
import '../../App.less'
import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'

import instance from '../../http.js'

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type, 		//默认为登录
			next: false,
			account: "",
			pass: "",
			vcode: "",
			email: "",
			num: 0,
			acmt: {			//账号提示
				words: "",	//提示语句
				type: 1 	//0 表示error 1表示success 
			},
			ecmt: {			//邮箱提示
				words: "",	//提示语句
				type: 1 	//0 表示error 1表示success 
			},
			pcmt: {			//密码提示
				words: "",	//提示语句
				type: 1 	//0 表示error 1表示success 
			},
			checkX: {		//注册验证密码
				words: "",
				type: 1,
				value: ""
			},
			checkY: {
				words: "",
				type: 1,
				value: ""
			}

		}
		this.handleAccount = this.handleAccount.bind(this);
		this.handlePass = this.handlePass.bind(this);
		this.handleVcode = this.handleVcode.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handleXPass = this.handleXPass.bind(this);
		this.handleYPass = this.handleYPass.bind(this);
		this.getVcode = this.getVcode.bind(this);
		this.toLog = this.toLog.bind(this);
		this.toReg = this.toReg.bind(this);
		this.toNext = this.toNext.bind(this);
	}

	handleAccount(e) {
		const account = e.target.value;
		let exp = /^[0-9a-zA-Z_-]+@[0-9a-zA-Z]+(\.[a-z]{2,3}){1,2}$/;
		let words = "";
		let type = 0;
		if(account === "") {
			words = "*邮箱不能为空";
			type = 1;
		}else if(!exp.test(account)) {
			words = "*邮箱不合法";
			type = 1;
		}else {
			words = "√ 邮箱合法";
			type = 0;
		}
		this.setState({
			account:account,
			acmt:{
				words: words,
				type: type
			}
		})
	}

	handlePass(e) {
		let pass = e.target.value;
		let words = "";
		let type = 0;

		if(pass === "") {
			words = "*请输入密码"
			type = 1;
		}else {
			words = "√ 密码合法";
			type = 0;
		}
		this.setState({
			pass: pass,
			pcmt: {
				words: words,
				type: type
			}
		})
	}

	handleVcode(e) {
		this.setState({
			vcode: e.target.value
		})
	}
	
	handleEmail(e) {
		const email = e.target.value;
		let exp = /^[0-9a-zA-Z_-]+@[0-9a-zA-Z]+(\.[a-z]{2,3}){1,2}$/;
		let words = "";
		let type = 0;
		if(email === "") {
			words = "请输入邮箱号";
			type = 1;
		}else if(!exp.test(email)) {
			words = "邮箱不合法";
			type = 1;
		}else {
			words = "√ 邮箱合法";
			type = 0;
		}
		this.setState({
			email:email,
			ecmt:{
				words: words,
				type: type
			}
		})
	}

	//获取验证码
	getVcode() {
		if(this.state.ecmt.type) {
			this.props.showFail(this.state.ecmt.words || "请输入邮箱号");
		}else {
			this.setState({
				num: '...'
			})
			let _this = this;
			instance.post(`user/vercode`,{
				"userEmail": _this.state.email
			}).then(res => {
				if(res.data.success) {

					_this.props.showSuc('验证码已发至邮箱')
				}else {
					_this.props.showFail(res.data.failure);
				}
			})
		}
	}

	getModifyVcode() {
		if(this.state.ecmt.type) {
			this.props.showFail(this.state.ecmt.words || "请输入邮箱号");
		}else {
			this.setState({
				num: '...'
			})
			let _this = this;
			instance.post(`user/modifyPwVercode`,{
				"userEmail": _this.state.email
			},{
				headers: {
					"Authorization": localStorage.getItem("token")
				}
			}).then(res => {
				if(res.data.success) {
					_this.props.showSuc('验证码已发至邮箱')
				}else {
					_this.props.showFail(res.data.failure);
				}
			})
		}
	}

	toLog() {
		if(this.state.acmt.type) {
			this.props.showFail(this.state.acmt.words || "请输入账号");
		}else if(this.state.pcmt.type) {
			this.props.showFail(this.state.pcmt.words || "请输入密码");
		}else {
			let _this = this;
			instance.post('/user/login',{
				"userEmail": this.state.account,
				"userPw": this.state.pass
			}).then(res => {
				localStorage.setItem("token", res.data.token);
				if(res.data.success) {
					_this.props.showSuc('登录成功');
					_this.props.hasLogin();
					_this.props.saveInfor(res.data.userInfo);
					_this.props.hasLog();
					_this.props.hiddenLogin();
				}else {
					_this.props.showFail(res.data.failure);
				}
			}).catch(err => {
				_this.props.showFail(err);
			})

		}
	}

	toNext() {
		if(this.state.ecmt.type) {
			this.props.showFail(this.state.ecmt.words || "请输入邮箱号");
		}else if(!this.state.vcode) {
			this.props.showFail("请输入验证码");
		}else {
			this.setState({
				next: true
			})
		}
	}

	toReg() {
		if(this.state.checkX.type) {
			this.props.showFail(this.state.checkX.words || "密码不能为空");
		}else if(this.state.checkY.type) {
			this.props.showFail(this.state.checkY.words || "请输入密码");
		}else {
			let _this = this;
			instance.post(`user/register/${_this.state.vcode}`,{
				"userEmail": _this.state.email,
				"userPw": _this.state.checkY.value
			}).then(res => {
				if(res.data.success) {
					//注册成功
					this.props.showSuc('注册成功！');
				}else {
					//注册失败
					this.props.showFail(res.data.failure)
				}
				_this.setState({
					type: 0,
					account: "",
					pass: "",
					vcode: "",
					email: "",
					checkX: {		//注册验证密码
						words: "",
						type: 1,
						value: ""
					},
					checkY: {
						words: "",
						type: 1,
						value: ""
					}
				})
			})
		}
	}

	handleXPass(e) {
		let pass = e.target.value;
		let words = "";
		let type = 0;
		if(pass === "") {
			words = "*请输入密码"
			type = 1;
		}else {
			words = "√ 密码合法";
			type = 0;
		}
		this.setState({
			checkX: {
				words: words,
				type: type,
				value: pass,
			}
		})
	}

	handleYPass(e) {
		let pass = e.target.value;
		let words = "";
		let type = 0;
		if(pass != this.state.checkX.value) {
			words = "*密码不一致"
			type = 1;
		}else {
			words = "√ 密码一致";
			type = 0;
		}
		this.setState({
			checkY: {
				words: words,
				type: type,
				value: pass
			}
		})
	}

	toModify() {
		if(this.state.checkX.type) {
			this.props.showFail(this.state.checkX.words || "密码不能为空");
		}else if(this.state.checkY.type) {
			this.props.showFail(this.state.checkY.words || "请输入密码");
		}else {
			let _this = this;
			instance.post(`user//modifyPw/${_this.state.vcode}`,{
				"userEmail": _this.state.email,
				"userPw": _this.state.checkY.value
			},{
				headers: {
					"Authorization": localStorage.getItem("token")
				}
			}).then(res => {
				if(res.data.success) {
					//注册成功
					this.props.showSuc('修改成功！');
				}else {
					//注册失败
					this.props.showFail(res.data.failure)
				}
				_this.setState({
					type: 0,
					account: "",
					pass: "",
					vcode: "",
					email: "",
					checkX: {		//注册验证密码
						words: "",
						type: 1,
						value: ""
					},
					checkY: {
						words: "",
						type: 1,
						value: ""
					}
				})
			})
		}
	}

	toForget() {
		this.setState({
			type: 2
		})
	}

	render() {
		return (
			<div className="log_cover" onClick={this.props.hiddenLogin}>
				<div className="box" onClick={(event)=>{event.preventDefault();event.stopPropagation();event.nativeEvent.stopImmediatePropagation();}}>
					<a href="javascript:;" className="close" onClick={this.props.hiddenLogin}></a>
					<div className="box_hd">
						<div className="icon"></div>
						{
							this.state.type === 0 
							?
							(
								<p>登录看点，发现更多</p>
							)
							:
							(
								<p>加入看点，发现更多</p>
							)
						}
					</div>
					{
						this.state.type === 0 
						? 
						(
							<div className="box_bd">
								<div className="box_line">
									<input type="text" placeholder="请输入账号" value={this.state.account} onChange={this.handleAccount} />
									<div className={"cmt " + (this.state.acmt.type == 0 ? "suc" : "err")}>{this.state.acmt.words}</div>
								</div>
								<div className="box_line">
									<input type="password" placeholder="请输入密码" value={this.state.pass} onChange={this.handlePass}/>
									<div className={"cmt " + (this.state.pcmt.type == 0 ? "suc" : "err")}>{this.state.pcmt.words}</div>
								</div>
								<p className="cmt"><a href="javascript:;" onClick={this.toForget.bind(this)}>忘记密码？</a></p>
								<a href="javascript:;" className="btn blue" onClick={this.toLog}>登录</a>
							</div>
						) 
						: ( 
							this.state.type === 1 ? 
							(
								this.state.next === true
								? 
								(
									<div className="box_bd">
									<div className="box_line">
										<input type="password" 
												placeholder="请输入密码" 
												value={this.state.checkX.value} 
												onChange={this.handleXPass}
										/>
										<div className={"cmt " + (this.state.checkX.type == 0 ? "suc" : "err")}>{this.state.checkX.words}</div>
									</div>
									<div className="box_line">
										<input type="password" 
												placeholder="二次输入密码" 
												value={this.state.checkY.value} 
												onChange={this.handleYPass}
										/>
										<div className={"cmt " + (this.state.checkY.type == 0 ? "suc" : "err")}>{this.state.checkY.words}</div>
									</div>
									<br/>
										<a href="javascript:;" className="btn blue" onClick={this.toReg}>注册</a>
									</div>
								) 
								: 
								(
									<div className="box_bd">
										<div className="box_line">
											<input type="text" placeholder="请输入邮箱号" value={this.state.email} onChange={this.handleEmail} />
											<div className={"cmt " + (this.state.ecmt.type == 0 ? "suc" : "err")}>{this.state.ecmt.words}</div>
										</div>
										<div className="box_line">
											<input type="text" placeholder="输入6位邮箱验证码" value={this.state.vcode} onChange={this.handleVcode} />
											{ (this.state.num == 0) ? (
												<a href="javascript:;" className="reg_btn" onClick={this.getVcode}>获取验证码</a>
												) : (
											<div className="reg_btn">{this.state.num}</div>
											)}
										</div>
										<br/>
										<a href="javascript:;" className="btn blue" onClick={this.toNext}>下一步</a>
									</div>
								)
							) : (
								this.state.next === true
								? 
								(
									<div className="box_bd">
									<div className="box_line">
										<input type="password" 
												placeholder="请输入密码" 
												value={this.state.checkX.value} 
												onChange={this.handleXPass}
										/>
										<div className={"cmt " + (this.state.checkX.type == 0 ? "suc" : "err")}>{this.state.checkX.words}</div>
									</div>
									<div className="box_line">
										<input type="password" 
												placeholder="二次输入密码" 
												value={this.state.checkY.value} 
												onChange={this.handleYPass}
										/>
										<div className={"cmt " + (this.state.checkY.type == 0 ? "suc" : "err")}>{this.state.checkY.words}</div>
									</div>
									<br/>
										<a href="javascript:;" className="btn blue" onClick={this.toModify.bind(this)}>确认</a>
									</div>
								) 
								: 
								(
									<div className="box_bd">
										<div className="box_line">
											<input type="text" placeholder="请输入邮箱号" value={this.state.email} onChange={this.handleEmail} />
											<div className={"cmt " + (this.state.ecmt.type == 0 ? "suc" : "err")}>{this.state.ecmt.words}</div>
										</div>
										<div className="box_line">
											<input type="text" placeholder="输入6位邮箱验证码" value={this.state.vcode} onChange={this.handleVcode} />
											{ (this.state.num == 0) ? (
												<a href="javascript:;" className="reg_btn" onClick={this.getModifyVcode.bind(this)}>获取验证码</a>
												) : (
											<div className="reg_btn">{this.state.num}</div>
											)}
										</div>
										<br/>
										<a href="javascript:;" className="btn blue" onClick={this.toNext}>下一步</a>
									</div>
								)
							)
						)
					}
					
					<div className="box_bt">
					{
						this.state.type === 0 
						? 
						(
							<p>没有账号？<a href="javascript:;" onClick={()=>{this.setState({type: 1})}}>注册</a></p>
						)
						:
						(
							<p>已有账号？<a href="javascript:;" onClick={()=>{this.setState({type: 0})}}>登录</a></p>
						)
					}
					</div>
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
	hasLogin: () => dispatch(ACTIONS.hasLog()),
	saveInfor: infor => dispatch(ACTIONS.saveInfor(infor)),
	showSuc: words => dispatch(ACTIONS.showSuc(words)),
	showFail: words => dispatch(ACTIONS.showFail(words)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login)