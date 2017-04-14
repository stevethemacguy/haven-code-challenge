module.exports = function(grunt) {

    //Configuration for all modules 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Removes output folders (removes build folders with "clean:buildfiles")
        //Use "git clean:dry" to do a dry run.
        clean: {
            it: {
                src: ["live/css", "live/js"]
            },
            dry: {
                src: ["live/css", "live/js"],
                options: {
                    'no-write': true
                }
            },
            buildfiles: {
                src: ["css/build", "live/js/live.js"]
            },
            spritefiles: {
                src: ["live/images/sprites/*"]
            }
        },

        //Concat all css and js files into single files.
        concat: {
            css: {
                src: ['css/*.css'],
                dest: 'css/build/styles.css'
            },
            js: {
                src: [
                    //'js/*.js' // All JS in the js folder. Not used
                    //jQuery, jQueryUI, and jQuery Mobile are currently loaded as needed, so they don't appear here
                    'js/jquery.stellar.js',
                    'js/jquery.inview.min.js',
                    'js/main.js'
                ],
                dest: 'live/js/live.js'
            }
        },

        //Run PostCSS scripts (i.e. autoprefixer).
        postcss: {
            //Run autoprefixer on styles.css and overwrite the file
            dev: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                },
                src: 'css/styles.css',
                dest: 'css/styles.css'  //Overwrites the existing file
            },
            //Before the final concatenated css file is minified, run autoprefixer on the file
            build: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                },
                src: 'css/build/styles.css',
                dest: 'css/build/styles.css'  //Overwrite the existing file with result of autoprefixer
            }
        },

        //Creates index.html from dev.html by processing the build instructions (labeled as comments in dev.html).
        //In other words, index.html is the production "version" of dev.html.
        processhtml: {
            options: {
                // Task-specific options
            },
            dist: {
                files: {
                    'index.html': ['dev.html']  //dest : source
                }
            }
        },

        //Minify the HTML (NOTE: processhtml MUST be done before minifying, which strips all comments)
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    minifyJS: true
                },
                files: {
                    'index.html': 'dev.html'  // 'destination': 'source'
                }
            }
        },

        //Minify the CSS
        cssmin: {
            combined: {
                files: [
                    {
                        expand: true,
                        cwd: 'css/build',
                        src: 'styles.css',    //Use ['*.css', '!*.min.css'] for all files
                        dest: 'live/css',
                        ext: '.min.css'
                    }
                ]
            }
        },

        //Minify the JS
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'live/js/live.js',
                dest: 'live/js/live.min.js'
            }
        },

        sass: {
            dist: {
                /*files: {
                    'css/base.css': 'sass/base.scss',
                    'css/variables.css': 'sass/variables.scss',
                    'css/fonts.css': 'sass/fonts.scss',
                    'css/main.css': 'sass/main.scss'
                }*/
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
            },

            //When styles.css changes, run autoprefixer on the file.
            dev: {
                files: ['css/styles.css'],
                tasks: ['postcss:dev']
            }
            //Watch folders for changes. Removes build folders created in the process.
            //NOT currently used when testing, since minifying takes too long.
            /*scripts: {
                files: ['js/!*.js'],
                tasks: ['concat:js', 'uglify']
            },*/
            /*css: {
                files: ['css/!*.css'],
                tasks: ['concat:css', 'cssmin', 'clean:buildfiles']
            }*/
        }

    });

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean'); //Delete files or folders
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Watching files and running autoprefixer
    /*    Runt "grunt" before starting development. Currently, this watches for style.css changes and runs autoprefixer
          on the css whenever it's changed. If you don't want to watch the code (because of performance),
          you can just run "grunt postcss:dev" to run auto-prefixer once. Caution: un-prefixed css (transforms, animations, etc) might
          not work as expected until auto-prefixer is run.
    */

    // Dev Process
    //  Run the default "grunt" task.

    // Build process
    //  Run "grunt build"

    /* "Grunt Build" task
        1. Clean (Remove "live" folders)
        2. Concat CSS and JS files into single files
        3. Run autoprefixer on concatenated css file
        4. Process dev.html to create index.html (see comments for the processhtml task above)
        5. Minify HTML
        6. Minify CSS
        7. Minify JS
        8. Clean (Remove any build folders created in the process)
    */
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean:it', 'concat', 'postcss:build', 'processhtml', 'htmlmin', 'cssmin', 'uglify', 'clean:buildfiles']);
};