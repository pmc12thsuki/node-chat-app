'use strict';
const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString',()=>{
    it('should reject non-string values', ()=>{
        const result = isRealString(1234);
        expect(result).toBeFalsy();
    })

    it('should reject string with only spaces', ()=>{
        const result = isRealString('       ');
        expect(result).toBeFalsy();
    })

    it('should allow string with non-space characters',()=>{
        const result = isRealString('  test123  ');
        expect(result).toBeTruthy();
    })
})