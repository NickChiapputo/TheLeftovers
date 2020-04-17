const axios = require('axios');

const functions = {

    fetchMenu: () =>
    axios
    .get('http://64.225.29.130/coupons/view')
    .then(res => res.data)
    .catch(err => 'error'),
    
};

module.exports = {functions};