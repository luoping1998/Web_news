import { combineReducers } from 'redux'
import infor from './infor.js'
import log from './log.js'
import pop from './pop.js'
import load from './load.js'

export default combineReducers({
	infor,		//个人信息
	log,		//是否登录flag
	pop,		//alert弹窗
	load, 		//加载中 
})