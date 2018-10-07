const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=>{
    it('should generate correct message object', ()=>{
        const from = 'admin';
        const text = 'test';
        const msg = generateMessage(from, text);
        expect(msg).toInclude({from, text});
        // expect(msg.from).toBe(from);
        // expect(msg.text).toBe(text);
        expect(msg.createdAt).toBeA('number');
    })
})

describe('generateLocatiionMessage', ()=>{
    it('should generate correct logation message object',()=>{
        const lat = 1;
        const lon = -1;
        const url = 'https://www.google.com/maps?q=1,-1'
        const from = 'admin';
        const msg = generateLocationMessage(from, lat, lon);
        expect(msg.createdAt).toBeA('number');
        expect(msg).toInclude({from, url});
    })
})