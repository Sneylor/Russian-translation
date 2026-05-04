const fs = require('fs');
const content = fs.readFileSync('/home/paolo/github/hypernet-explorer/js/plugins/MarkovTextGenerator.js', 'utf8');
let balance = 0;
const lines = content.split('\n');
lines.forEach((line, index) => {
    for (let char of line) {
        if (char === '(') balance++;
        if (char === ')') balance--;
    }
    console.log(`${index + 1}: ${balance}`);
});
