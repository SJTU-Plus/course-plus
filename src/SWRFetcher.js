import { get } from 'axios';

export default (...args) => get(...args).then(resp => resp.data)
