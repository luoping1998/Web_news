const initialState = localStorage.getItem("log") ? localStorage.getItem("log") : false

const log = (state = initialState, action) => {
	switch (action.type) {
		case 'HAS_LOG':
			localStorage.setItem('log', true);
			return true;
		case 'LOG_OUT':
			localStorage.clear();
			return false;
		default :
			return state;
	}
}

export default log