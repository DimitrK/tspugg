module.exports = function (grunt) {
    var settings = grunt.file.readJSON('./config/config.json');
    settings.environment = process.env.NODE_ENV || settings.environment;
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        settings: settings,
        dbSettings: settings[settings.environment],
        deployments: {
            options: {
                target: '<%= settings.environment %>'
            },
            development: {
                title: '<%= settings.environment %>',
                user: '<%= settings.development.username %>',
                pass: '<%= settings.development.password %>',
                host: '<%= settings.development.host %>',
                database: '<%= settings.development.database %>'
            },
            test: {
                title: '<%= settings.environment %>',
                user: '<%= settings.test.username %>',
                pass: '<%= settings.test.password %>',
                host: '<%= settings.test.host %>',
                database: '<%= settings.test.database %>'
            },
            production: {
                title: '<%= settings.environment %>',
                user: '<%= settings.production.username %>',
                pass: '<%= settings.production.password %>',
                host: '<%= settings.production.host %>',
                database: '<%= settings.production.database %>'
            }
        },
        bgShell: {
            createDB: {
                cmd: "mysql --host=<%= dbSettings.host %> -u<%=dbSettings.username%> -p<%=dbSettings.password%> -e \"create database <%=dbSettings.database%>; GRANT ALL PRIVILEGES ON <%= dbSettings.database %>.* TO <%= dbSettings.username %>@<%= dbSettings.host %> IDENTIFIED BY '<%= dbSettings.password %>'\" "
            },
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
            },
            envNot: {
                cmd: "set NODE_ENV=<%= settings.environment %>"
            }
        }
    });
    grunt.loadNpmTasks('grunt-deployments');
    grunt.loadNpmTasks('grunt-bg-shell');
    // Default task(s).
    grunt.task.registerTask("livestart", ['bgShell:liveStart']);
    grunt.task.registerTask("livetest", ['bgShell:liveTest', 'bgShell:envNot']);
    grunt.task.registerTask("createdb", ['bgShell:createDB']);


};
