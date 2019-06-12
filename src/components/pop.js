import React, {Component} from 'react'
import './load.less'

class Pop extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="pop">
				<div className="pop_box">
					<div className="pop_header">
						<a href="javascript:;" onClick={this.props.cancel}>×</a>
					</div>
					<div className={"pop_cont " + this.props.type}>
						<p>{this.props.words}</p>
					</div>
					<div className="pop_footer">
						<button onClick={this.props.cancel}>确 定</button>
					</div>
				</div>
			</div>
		)
	}
}

export default Pop