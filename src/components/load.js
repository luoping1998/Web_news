import React, {Component} from 'react'

import './load.less'

class Load extends Component{
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="loader" >
			  	<div className="dot"></div>
			  	<div className="dot"></div>
			 	<div className="dot"></div>
			 	<div className="dot"></div>
			  	<div className="dot"></div>
			</div>
		)
	}
}

export default Load