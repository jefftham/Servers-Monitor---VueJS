import axios from 'axios';

const axiosFB = axios.create({
  baseURL: 'https://servers-monitor-vuejs.firebaseio.com/',
});

export default axiosFB;
