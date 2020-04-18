const axios = require('axios');

const functions = {

    fetchInventory: () =>
    axios
    .get('http://64.225.29.130/inventory/view')
    .then(res => res.data)
    .catch(err => 'error'),
    
};

module.exports = {functions};