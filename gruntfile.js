module.exports = function(grunt) {

    //Configuration for all modules 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    update: true //Only update changed files
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['**/*.scss'],
                    dest: 'src/sass/css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'src/sass/css/*.css',
                        'src/scripts/*.js',
                        'index.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './'
                }
            }
        }
    });

    //Load grunt modules
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Dev Process
    //  Run the default "grunt" task to:
    //    1. Watch and compile scss files as they change
    //    2. Run BrowserSync, which uploads the browser when css and js files changes

    // Running the code

    grunt.registerTask('default', ['browserSync', 'watch']);
};