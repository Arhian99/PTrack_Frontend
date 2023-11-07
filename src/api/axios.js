import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8080'
});

// for debugging purposes only, delete in production
// axios.interceptors.request.use(request => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request
// });

















