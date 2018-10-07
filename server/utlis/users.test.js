'use strict';
const expect = require('expect');
const {Users} = require('./users');

describe('Users',()=>{

    let users;
    beforeEach(()=>{
        users = new Users();
        users.users=[
            {
                id:'1',
                name: 'User1',
                room: 'Course'
            },
            {
                id:'2',
                name: 'User2',
                room: 'Course'
            },
            {
                id:'3',
                name: 'User3',
                room: 'Playground'
            }
        ]
    })


    it('should add new user',()=>{
        const users = new Users();
        const user = {
            id:'123',
            name:'test',
            room:'a'
        }
        const resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    })

    it('should return user"s name of room Course',()=>{
        const userList = users.getUserList('Course');
        expect(userList).toEqual(['User1', 'User2']);
    })

    it('should return user"s name of room Playground',()=>{
        const userList = users.getUserList('Playground');
        expect(userList).toEqual(['User3']);
    })

    it('should remove a user', ()=>{
        const userId = '1';
        const user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    })

    it('should not remove user', ()=>{
        const userId = 'test';
        const user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    })

    it('should find user', ()=>{
        const userId = '2';
        const user = users.getUser(userId);
        expect(user.id).toBe(userId);
    })

    it('should not find user', ()=>{
        const userId = 'test';
        const user = users.getUser(userId);
        expect(user).toNotExist();
    })

})