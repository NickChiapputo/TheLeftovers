const { clock } = require('./get-time');

test('should output the current time in hours and minutes',()=>{
    const text = clock();
    expect('text').toBe('3:49pm');
}); 