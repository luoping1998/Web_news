import axios from 'axios'

let instance = axios.create({
	baseURL: 'http://118.89.221.170:8080/news'
})

instance.defaults.withCredentials = true;
export default instance