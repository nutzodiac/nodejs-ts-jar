const exec = require('child_process').exec;
const childPorcess = exec('java -jar ./app/Main.jar', function(err, stdout, stderr) {
    if (err) {
        console.log(err)
    }
    console.log(stdout)
})