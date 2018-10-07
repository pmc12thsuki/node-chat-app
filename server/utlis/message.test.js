const expect = require('expect');
const generateMessage = require('./message');

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