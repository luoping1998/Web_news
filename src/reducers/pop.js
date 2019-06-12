const initialState = {
	show: false,
	words: "",
	type:"suc"
}

const pop = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_SUC':
			return Object.assign({}, state, {
				...state,
				show: true,
				type: 'suc',
				words: action.words
			})
		case 'SHOW_FAIL':
			return Object.assign({}, state, {
				...state,
				show: true,
				type: 'fail',
				words: action.words
			})
		case 'POP_HIDDEN':
			return Object.assign({}, state, {
				...state,
				show: false,
				words: ""
			})
		default :
			return state;
	}
}

export default pop