import React, { Component } from 'react'

import {connect} from 'react-redux'
import {ACTIONS} from '../../actions/index'

import instance from '../../http.js'
import Avatar from '../../components/avater.js'

import '../../App.less'
import './chinfor.less'

function move(obj) {
    obj.onmousedown = function(e) { //鼠标按下事件
        e = e || window.event; //事件对象
        let x_down = e.clientX; //鼠标按下X的坐标
        let y_down = e.clientY; //鼠标按下Y的坐标
        let leftDown = this.offsetLeft; //获取盒子的初始left值
        let topDown = this.offsetTop; //获取盒子的初始top值

        document.onmousemove = function(e) { //鼠标移动事件
            e = e || window.event;
            let x_move = e.clientX; //鼠标移动X的坐标
            let y_move = e.clientY; //鼠标移动Y的坐标
            //移动的减去按下的坐标坐标 = 移动的距离
            let x_now = x_move - x_down;
            let y_now = y_move - y_down;
            let ow = obj.offsetWidth;
			let oh = obj.offsetHeight;

            if(ow + leftDown + x_now <= 160) {
	            obj.style.left = 160 - ow + 'px';
	        }else if(leftDown + x_now >= 0){
	            obj.style.left = '0px';
	        }
	        else{
	            obj.style.left = leftDown + x_now + 'px';
            }

            if(oh + topDown + y_now <= 160) {
            	obj.style.top = 160 - oh + 'px';
            }else if(topDown + y_now >= 0) {
            	obj.style.top = '0px';
            }else {
            	obj.style.top = topDown + y_now + 'px';
        	}
    	}
        document.onmouseup = function() { //鼠标抬起事件
            //清除移动和抬起事件
            this.onmousemove = this.onmouseup = null;
        }
        return false //阻止默认事件
    }
}

const mapStateToProps = state => ({
	infor: state.infor
})

const mapDispatchToProps = dispatch => ({
	saveInfor: (infor) => dispatch(ACTIONS.saveInfor(infor)),
	showSuc: words => dispatch(ACTIONS.showSuc(words)),
	showFail: words => dispatch(ACTIONS.showFail(words)),
})

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cflag: false,	//修改否
			ccont: this.props.val
		}
	}	

	handleChange(e) {
		this.setState({
			ccont: e.target.value
		})
	}

	handleClick() {
		this.setState({
			cflag: !this.state.cflag
		})
	}

	submit() {
		this.handleClick();
		this.props.submit(this.state.ccont);
	}

	render() {
		return (
			<div className="item">
				<div className="item_intro">
					{this.props.proper}
				</div>
				{
					(this.state.cflag===true) ? (
						<div className="item_detail">
							<input type="text" onChange={this.handleChange.bind(this)} value={this.state.ccont}/> 
							<button onClick={this.submit.bind(this)}>确认</button>
							<button className="cancel" onClick={this.handleClick.bind(this)}>取消</button>
						</div>
					) : (
					<div className="item_detail">
						{this.props.val}
						<a href="javascript:;" className="tochan" onClick={this.handleClick.bind(this)}>修改</a>
					</div>
					)
				}
			</div>
		)
	}
}

class ItemEmail extends Component {
	constructor(props) {
		super(props);
	}	

	render() {
		return (
			<div className="item">
				<div className="item_intro">
					{this.props.proper}
				</div>
				<div className="item_detail">
					{this.props.val}
				</div>
			</div>
		)
	}
}

class ItemSex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cflag: false,	//修改否
			ccont: '',
			sflag: Number(this.props.val)
		}
	}	

	handleChange(e) {
		this.setState({
			ccont: e.target.value
		})
	}


	handleSex(e) {
		let val = (e.target.id === "famale") ? 0 : (e.target.id === "male" ? 1 : 3);
		this.setState({
			sflag: val
		})
	}

	handleClick() {
		this.setState({
			cflag: !this.state.cflag
		})
	}

	submit() {
		this.handleClick();
		this.props.submit(this.state.sflag);
		//尚未完善  个人信息未添加性别
	}

	render() {
		return (
			<div className="item">
				<div className="item_intro">
					{this.props.proper}
				</div>
				{
					(this.state.cflag===true) ? (
						<div className="item_detail sex">
							<input type="radio" name="sex" id="male" checked={this.state.sflag === 1} onClick={this.handleSex.bind(this)}/><label for="male">男</label>
							<input type="radio" name="sex" id="famale" checked={this.state.sflag === 0} onClick={this.handleSex.bind(this)}/><label for="famale">女</label>
							<input type="radio" name="sex" id="other" checked={this.state.sflag === 3} onClick={this.handleSex.bind(this)}/><label for="other">其他</label>
							<button onClick={this.submit.bind(this)}>确认</button>
							<button className="cancel" onClick={this.handleClick.bind(this)}>取消</button>
						</div>
					) : (
					<div className="item_detail">
						{(this.props.val == 0) ? "女" : ((this.props.val == 1) ? "男" : "其他") }
						<a href="javascript:;" className="tochan" onClick={this.handleClick.bind(this)}>修改</a>
					</div>
					)
				}
			</div>
		)
	}
}

class ChInfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			click: false,
			icon: '',
			cflag: false,
			val: this.props.infor.userName,
			blob: {}
		}
	}

	handleChange(e) {
		this.setState({
			val: e.target.value
		})
	}

	handleClick() {
		this.setState({
			cflag: !this.state.cflag
		})
	}

	submit(obj) {
		let _this = this;
		instance.post('user/doUserUpdate', obj, {
			headers: {
				"Authorization": localStorage.getItem("token")
			}
		}).then(res => {
			if(res.data.success) {
				_this.props.showSuc('修改成功！');
				_this.props.saveInfor(obj);
			}
		})
	}

	submitSex(val) {
		let infor = {
			"userName": this.props.infor.userName,
			"userGraph": this.props.infor.userGraph,
			"userId": this.props.infor.userId,
			"userGender": Number(val),
			"userAddress": this.props.infor.userAddress || "",
			"userCareer": this.props.infor.userCareer || "",
			"userEducation": this.props.infor.userEducation || ""
		}
		this.submit(infor);
	}

	submitGraph(val) {
		let infor = {
			"userName": this.props.infor.userName,
			"userGraph": val,
			"userId": this.props.infor.userId,
			"userGender": this.props.infor.userGender,
			"userAddress": this.props.infor.userAddress || "",
			"userCareer": this.props.infor.userCareer || "",
			"userEducation": this.props.infor.userEducation || ""
		}
		this.submit(infor);
	}

	submitAddress(val) {
		let infor = {
			"userName": this.props.infor.userName,
			"userGraph": this.props.infor.userGraph,
			"userId": this.props.infor.userId,
			"userGender": this.props.infor.userGender,
			"userAddress": val || "",
			"userCareer": this.props.infor.userCareer || "",
			"userEducation": this.props.infor.userEducation || ""
		}
		this.submit(infor);
	}

	submituserCareer(val) {
		let infor = {
			"userName": this.props.infor.userName,
			"userGraph": this.props.infor.userGraph,
			"userId": this.props.infor.userId,
			"userGender": this.props.infor.userGender,
			"userAddress": this.props.infor.userAddress || "",
			"userCareer": val|| "",
			"userEducation": this.props.infor.userEducation || ""
		}
		this.submit(infor);

	}

	submitEducation(val) {
		let infor = {
			"userName": this.props.infor.userName,
			"userGraph": this.props.infor.userGraph,
			"userId": this.props.infor.userId,
			"userGender": this.props.infor.userGender,
			"userAddress": this.props.infor.userAddress || "",
			"userCareer": this.props.infor.userCareer || "",
			"userEducation": val|| ""
		}
		this.submit(infor);
	}

	submitName() {
		// let _this = this;
		this.handleClick();
		let infor = {
			"userName": this.state.val,
			"userGraph": this.props.infor.userGraph,
			"userId": this.props.infor.userId,
			"userGender": this.props.infor.userGender,
			"userAddress": this.props.infor.userAddress || "",
			"userCareer": this.props.infor.userCareer || "",
			"userEducation": this.props.infor.userEducation || ""
		}
		this.submit(infor);
	}

	loadImg(e) {
		this.show();

		let oImg = new Image();
		let files = e.target.files;    //为了获取存储图片的信息的File对象
  		let _this = this;
	    let reader = new FileReader();     //创建FileReader对象 
	    if(!files.length) return;

	    reader.readAsDataURL(files[0]);     //利用readerDtaURL将图片读成base64

	    reader.onload = function(e) {        //监听reader读取完成事件
	    //当读取完成时，reader.result就是要的base64
	        oImg.src = this.result;
	    }

	    let formFile = new FormData();
	    formFile.append("file", files[0]);

        instance.post(`user/upload/${this.props.infor.userId}`, formFile, {
				headers: {
					"Content-Type": "mutipart/form-data",
					"Authorization": localStorage.getItem("token")
				}
			}).then(res => {
				if(res.data.success) {
					let infor = {
						..._this.props.infor,
						"userPic":res.data.success.split("/").pop()
					}
					_this.props.saveInfor(infor)
					_this.props.showSuc("修改成功！");
				}
			}).catch(err => {
				_this.props.showFail(err);
			})
			
	    oImg.onload = () => {
	        let canvas = document.createElement("canvas");
		    let point = document.getElementById('circle');

	        let context = canvas.getContext('2d');           //为canvas设置上下文
	        let maxW = 160, maxH = 160;
	        //oImg的初始宽、高 
	        let originW = oImg.width;               
	        let originH = oImg.height;

	        //设置目标宽、高
	        let targW = originW, targH = originH;

	        //判断图片是否超过限制  等比缩放 
	        if(originW > maxW || originH > maxH) {
	            if(originH/originW < maxH/maxW) {
	                targH = maxH;
	                targW = Math.round(maxH * (originW / originH));
	            }else {
	                targW = maxW;
	 	            targH = Math.round(maxW * (originH / originW));
	            }
	        }
	        //设置canvas的宽、高
	        canvas.width = targW;
	        canvas.height = targH;
	        //清除画布
	        context.clearRect(0,0,targW,targH);
	        //利用drawImage将图片oImg按照目标宽、高绘制到画布上
	        context.drawImage(oImg,0,0,targW,targH);

	        canvas.toBlob(function (blob) {
                _this.setState({
                	blob: blob
                })
            },files.type || 'image/jpg');

	        let inner =  document.getElementById("inner");
	        inner.appendChild(canvas);
	        canvas.style.left = targW <= 160 ? ((80 - targW/2) + 'px') : ((-targW/2 + 80) + 'px');
	        canvas.style.top = targH <= 160 ? ((80 - targH/2) + 'px') : ((-targH/2 + 80) + 'px');

	        move(canvas);
		    point.onmousedown = function(e) { 
		        e = e || window.event; 
		        let x_down = e.clientX; //鼠标按下X的坐标
		        let leftDown = this.offsetLeft; //获取初始left值

		        document.onmousemove = function(e) { //鼠标移动事件
		            e = e || window.event;
		            let x_move = e.clientX; 
		            let x_now = x_move - x_down;
					let left = 0;
		            //赋值给left和top
		            if(leftDown + x_now >= 245) {
		            	left = 245;
		            }else if(leftDown + x_now <= 0) {
		            	left = 0;
		            }else {
		            	left = leftDown + x_now;
		        	}

		        	point.style.left = left + 'px';
		        	let tW = targW * (1 + (left/245));
		        	let tH = targH * (1 + (left/245));
					 canvas.width = tW;
					 canvas.height = tH;
					 //清除画布
					 context.clearRect(0,0,tW,tH);
					 //利用drawImage将图片oImg按照目标宽、高绘制到画布上
					 context.drawImage(oImg,0,0,tW,tH);

					 canvas.toBlob(function (blob) {
				        _this.setState({
				     	blob: blob
				     })
				    },files.type || 'image/jpg');

		    	}
		        document.onmouseup = function() { //鼠标抬起事件
		            //清除移动和抬起事件
		            this.onmousemove = this.onmouseup = null;
		        }
		        return false //阻止默认事件
	    	}
	    }
	}


	show() {
		this.setState({
			click: !this.state.click
		})
	}

	render() {
		return (
			<div className="chinfor">
				{
					//this.state.click ? <Avatar id={this.props.infor.userId} cancel={this.show.bind(this)} blob={this.state.blob}/> : ""
				}
			
				<div className="lefter">
					<div className="avater">
						<img src={`http://118.89.221.170:8080/news/resources/pic/${this.props.infor.userPic}`}/>
						<div className="cover"></div>
						<input type="file" onChange={this.loadImg.bind(this)}/>
					</div>
				</div>
				<div className="righter">
					{
						this.state.cflag ? (
							<div className="username">
								<input type="text" value={this.state.val} onChange={this.handleChange.bind(this)}/>
								<button onClick={this.submitName.bind(this)}>确定</button>
								<button className="cancel" onClick={this.handleClick.bind(this)}>取消</button>
							</div>
						) : (
							<h1>{this.props.infor.userName}
								<a className="tochan" href="javascript:;" onClick={this.handleClick.bind(this)}>修改</a>
							</h1>
						)
					}
					<ItemSex proper={"性别"} val={this.props.infor.userGender} submit={this.submitSex.bind(this)}/>
					<ItemEmail proper={"邮箱"} val={this.props.infor.userEmail}/>
					<Item proper={"签名"} val={this.props.infor.userGraph} submit={this.submitGraph.bind(this)}/>
					<Item proper={"地址"} val={this.props.infor.userAddress} submit={this.submitAddress.bind(this)}/>
					<Item proper={"职业"} val={this.props.infor.userCareer} submit={this.submituserCareer.bind(this)}/>
					<Item proper={"学校"} val={this.props.infor.userEducation} submit={this.submitEducation.bind(this)}/>
				</div>
			</div>
		)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChInfor)