module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                "js/app/*.js"
            ],
            options: {
                jshintrc: '.jshintrc'
            },
        },
        jasmine: {
            all: {
                src: '<%= jshint.all %>',
                options: {
                    template: require('grunt-template-jasmine-istanbul'),
                    template: 'test/lib/custom.tmpl',
                    templateOptions: {
                        coverage: 'report/istanbul/coverage.json',
                        report: [{
                            type: 'html',
                            options: {
                                dir: 'test/report/istanbul'
                            }
                        }, {
                            type: 'text-summary'
                        }],
                        thresholds: {
                            lines: 80,
                            statements: 80,
                            branches: 80,
                            functions: 80
                        }
                    },
                    specs: 'test/spec/**/*spec.js',
                    keepRunner: true,
                    vendor: 'https://code.jquery.com/jquery-2.1.3.min.js',
                    styles: './css/*.css'
                }
            }
        },
        /* This would normally verify that we commit well structured code without failed tests
        in case someone forgot to run them (for the lazy ones) */
        githooks: {
            all: {
                'pre-commit': 'verify'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-githooks');

    grunt.registerTask('test', [
        'jasmine'
    ]);
    
    grunt.registerTask('verify',[
        'jshint', 'jasmine'
    ]);

};
