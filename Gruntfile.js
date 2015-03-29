module.exports = function (grunt) {
    var settings = require('./config/config');
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        settings: settings,
        bgShell: {
            liveStart: {
                cmd: "npm run-script livestart",
                stdout: true,
                stderr: true,
                bg: false
            },
            liveTest: {
                cmd: "npm run-script livetest",
                stdout: function(message){
                    console.log(message);
                },
                stderr: true,
                bg: false
            }
        }
    });
    grunt.loadNpmTasks('grunt-bg-shell');
    // Default task(s).
    grunt.task.registerTask("livestart", ['bgShell:liveStart']);
    grunt.task.registerTask("livetest", ['bgShell:liveTest']);
    grunt.task.registerTask("createdb", ['bgShell:createDB']);


};
