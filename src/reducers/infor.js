const initialState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
	"userId":0,
	"userName":"",
	"userPw":"",
	"userEmail":"",
	"userFollow":0,
	"userFans":0,
	"userPic":"default.png",
	"userGraph":"",
	"userGender": 0,
	"userAddress": "",
	"userEducation":""
}

const infor = (state = initialState, action) => {
	switch(action.type) {
		case 'SAVE_INFOR':
			localStorage.setItem('user', JSON.stringify(action.infor));
			return Object.assign({}, state, {
				...action.infor
			})
		case 'LOG_OUT':
			return Object.assign({}, state, initialState)
		default :
			return state
	}
}

export default infor