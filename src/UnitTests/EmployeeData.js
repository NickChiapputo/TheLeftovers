const axios = require('axios');

const functions = {

    fetchEmployees: () =>
    axios
    .get('http://64.225.29.130/employees/view')
    .then(res => res.data)
    .catch(err => 'error'),
    
};

module.exports = {functions};