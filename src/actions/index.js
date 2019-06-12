const saveInfor = infor => ({
	type: 'SAVE_INFOR',
	infor
})

const hasLog = () => ({
	type: 'HAS_LOG'
})

const logOut = () => ({
	type: 'LOG_OUT'
})

const showSuc = words => ({
	type: 'SHOW_SUC',
	words
})

const showFail = words => ({
	type: 'SHOW_FAIL',
	words
})

const popHidden = () => ({
	type: 'POP_HIDDEN'
})

const Loading = () => ({
	type:'IN_LOADING'
})

const Loaded = () => ({
	type: 'HAS_LOADED'
})

export const ACTIONS = {
	saveInfor,
	hasLog,
	logOut,
	showSuc,
	showFail,
	popHidden,
	Loading,
	Loaded
}
