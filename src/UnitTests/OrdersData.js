const axios = require('axios');

const functions = {

    fetchOrders: () =>
    axios
    .get('http://64.225.29.130/orders/view')
    .then(res => res.data)
    .catch(err => 'error'),
    
};

module.exports = {functions};