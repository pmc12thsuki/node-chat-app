'use strict';

const moment = require('moment');

// Jan 1st 1970 00:00:00 am (UTC)
// const date = new Date();
// 1000 UTC means 1 second after the standard time, which is Jan 1st 1970 00:00:01 am
// js build-in Date is difficult to use

const date = moment();
console.log(date.format());
console.log(date.format('MMM Do, YYYY'));

date.add(1, 'year').subtract(9,'months');
console.log(date.format());

console.log(date.format('h:mm a'));

const timeStamp = moment().valueOf();
console.log(timeStamp);