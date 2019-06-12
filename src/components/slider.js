import React, {Component} from 'react'
import Swiper from 'swiper/dist/js/swiper'

import 'swiper/dist/css/swiper.min.css'


class FadeSlide extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let mySwiper = new Swiper('.swiper-container', {
		    direction: 'horizontal',
		    effect : 'fade',
		    speed:300,
			autoplay:{
			    delay: 4000,
			    disableOnInteraction: false,
			},
		    loop: true,
		    pagination: {
      			el: '.swiper-pagination',
      			type: "bullets",
      			clickable: true,
    			clickableClass : 'my-pagination-clickable',
    		}
	  	})

		const Slides = this.props.imgs.map((val, index) => {
			return (
				<div className="swiper-slide" key={index}>
					<img src={val.pic} />
					<div className="slide_words">
						<h3 className="cont">{val.title}</h3>
					</div>
				</div>
			)
		})

		return (
			<div className="swiper-container focus_slide">
				<div className="swiper-wrapper">
			        {Slides}
			   	</div>
			   	<div className="swiper-pagination"></div>
			</div>
		)
	}

}

export default FadeSlide