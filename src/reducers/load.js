const initialState = false

const load = (state = initialState, action) => {
	switch (action.type) {
		case 'IN_LOADING':
			return true;
		case 'HAS_LOADED':
			return false;
		default :
			return state;
	}
}

export default load