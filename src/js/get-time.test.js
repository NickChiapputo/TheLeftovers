const { week } = require('./get-time');

test('Should output the date from Sunday until Saturday', () => {
    let date = new Date();
    let currentweek = (date.getMonth()+1)+'/'+(date.getDate()-date.getDay())+'/'+date.getFullYear();
    let nextweek = (date.getMonth()+1)+'/'+(date.getDate()+(6-date.getDay()))+'/'+date.getFullYear();
    let duration = currentweek+'-'+nextweek;
    const text = week();
    expect(text).tobe(duration);
})
