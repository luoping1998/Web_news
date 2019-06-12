import React,{Component} from 'react'
import './avater.less'

import instance from '../http.js'

class Avatar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			click: false,
			// blob: this.props.blob
		}
	}

	handleIcon() {
		// let canvas = document.getElementsByTagName('canvas')[0];

		//新图片
		// let icon = document.createElement('canvas');
		// let context = icon.getContext('2d');
		// icon.width = 160;
		// icon.height = 160;
		// let sx = -canvas.offsetLeft;
		// let sy = -canvas.offsetTop;

		// let _this = this;

		// context.drawImage(canvas, sx, sy, 160, 160, 0, 0, 160, 160);
		
		// let img = new Image();
		// img.src = icon.toDataURL('image/png');

		// icon.toBlob(function (blob) {
		// let formData = new FormData();
		// 	formData.append("file", blob);
	        
	 //        instance.post(`user/upload/${_this.props.id}`, formData, {
		// 			headers: {
		// 				"Content-Type": "mutipart/form-data",
		// 				"Authorization": localStorage.getItem("token")
		// 			}
		// 		}).then(res => {
		// 			console.log(res);
		// 		}).catch(err => {
		// 			console.log(err);
		// 		})
  //       },'image/png');

		// this.setState({
		// 	click: false
		// })
	}

	render() {
		return (
			<div className="box_cover">
				<div className="box_bd">
					<h2>编辑头像</h2>
					<p>调整头像尺寸和位置</p>
					<div className="box_img">
						<div id="inner"></div>
					</div>
					<div className="box_close" onClick={this.props.cancel}></div>
					<div className="box_line">
						<div className="line">
							<div id="circle"></div>
						</div>
					</div>
					{
						this.state.click ? 
						(
							<a href="javascript:;"><div className="btn">上传中...</div></a>

						) : (
							<a href="javascript:;" onClick={this.props.cancel}><div className="btn" >保存</div></a>
						)
					}
				</div>
			</div>	
		)
	}
}

export default Avatar