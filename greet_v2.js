var readline = require('readline');
var readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
readInterface.question("What's your name? ", function (name) {
    console.log("Hi ".concat(name, "!"));
    readInterface.close();
});
