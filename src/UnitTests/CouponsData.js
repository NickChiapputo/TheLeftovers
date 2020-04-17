const axios = require('axios');

const functions = {

    fetchCoupons: () =>
    axios
    .get('http://64.225.29.130/coupons/view')
    .then(res => res.data)
    .catch(err => 'error'),

    appendCoupon: () =>
    axios
    .post('http://65.225.29.130/coupons/create',{
        name:'UnitTest',
        discount:'15',
        expiration:'2020-05-16',
        rewards:' UNIT TEST'
    })
    .then(res => res.data)
    .catch(err => 'error')
};

module.exports = {functions};