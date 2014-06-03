/**
 * Grunt config file, inspired by ngbp.
 *
 * You can use:
 *   - "grunt dev": for development
 *   - "grunt watch": for watching
 *   - "grunt release --type=<major|minor|patch>": to release
 */
module.exports = function (grunt) {
    'use strict';
    /* jshint camelcase: false */

    require('load-grunt-tasks')(grunt);

    // Release type.
    var type = grunt.option('type');

    // Build config file
    var userConfig = require('./build.config.js');

    // Tasks config
    var taskConfig = {

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> by <%= pkg.author %> - ' +
                'Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>> */\n'
        },

        clean: [
            '<%= build_dir %>',
            '<%= compile_dir %>'
        ],

        copy: {
            build_app_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: [ '<%= vendor_files.assets %>' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/assets',
                        expand: true
                    }
                ]
            }
        },

        concat: {
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },

            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        ngmin: {
            compile: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        less: {
            build: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                }
            },
            compile: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                },
                options: {
                    cleancss: true,
                    compress: true
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= compile_dir %>/assets',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= compile_dir %>/assets'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= compile_dir %>/assets',
                    src: '{,*/}*.svg',
                    dest: '<%= compile_dir %>/assets'
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: [
                'Gruntfile.js'
            ],
            src: [
                '<%= app_files.js %>'
            ]
        },

        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= build_dir %>/templates-app.js'
            },

            common: {
                options: {
                    base: 'src/common'
                },
                src: [ '<%= app_files.ctpl %>' ],
                dest: '<%= build_dir %>/templates-common.js'
            }
        },

        index: {
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.common.dest %>',
                    '<%= html2js.app.dest %>',
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            },
            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            }
        },

        concurrent: {
            assets: [
                'imagemin',
                'svgmin'
            ]
        },

        // Watch
        delta: {

            options: {
                livereload: true    // Default port = 35729
            },

            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [ 'jshint:gruntfile' ],
                options: {
                    livereload: false
                }
            },

            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: [ /*'jshint:src',*/ 'copy:build_appjs' ]
            },

            assets: {
                files: [
                    'src/assets/**/*'
                ],
                tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
            },

            html: {
                files: [ '<%= app_files.html %>' ],
                tasks: [ 'index:build' ]
            },

            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
                ],
                tasks: [ 'html2js' ]
            },

            less: {
                files: [ 'src/**/*.less' ],
                tasks: [ 'less:build' ]
            }

        },

        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                commit: true,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'upstream'
            }
        }

    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    // Watch
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', [ 'build', 'delta' ]);

    // Default: help
    grunt.registerTask('default', function () {
        grunt.log.writeln('\n Hello! You\'re using the Grunt tool for the "' + taskConfig.pkg.name + '" app.');
        grunt.log.writeln('\n You can use:');
        grunt.log.writeln('    - "grunt dev": for development');
        grunt.log.writeln('    - "grunt watch": for watching');
        grunt.log.writeln('    - "grunt release --type=<major|minor|patch>": to release');
    });

    // Dev
    grunt.registerTask('build', [
        'clean', 'html2js', 'jshint', 'less:build',
        'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
        'copy:build_appjs', 'copy:build_vendorjs', 'index:build'
    ]);
    grunt.registerTask('dev', 'build');

    // Prod
    grunt.registerTask('compile', [
        'less:compile', 'copy:compile_assets', 'concurrent:assets', 'ngmin', 'concat:compile_js', 'uglify', 'index:compile'
    ]);

    // Release
    grunt.registerTask('release', function () {
        if (!type) {
            grunt.fail.fatal('You need to choose a release type [--type=<major|minor|patch>].');
            return false;
        }
        grunt.task.run([ 'bump-only:' + type, 'updatePkgConfig', 'build', 'compile', 'bump-commit' ]);
    });

    // ---

    // Trick to get the new version from pkg for bump
    grunt.registerTask('updatePkgConfig', function () {
        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
    });

    function filterForJS (files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    function filterForCSS (files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });
        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
            process: function (contents/*, path*/) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version')
                    }
                });
            }
        });
    });

};
