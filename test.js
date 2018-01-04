const test = require('unit.js');

describe('Making first test', () => {
    it('Should pass always', () => {
        var str = 'Hello, world!';

        test.string(str).startsWith('Hello');
    });
});