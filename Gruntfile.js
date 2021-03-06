var cp = require('child_process')

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'package.json', 'src/**/*.js'],
      options: {
      }
    },
    html2js: {
      options: {
        module: 'templates',
        rename: function(moduleName) {
          return moduleName.substring(moduleName.lastIndexOf('/') + 1);
        }
      },
      main: {
        src: ['src/**/*.html', '!src/**/index.html', '!src/**/solution/*.html'],
        dest: 'tmp/templates.js'
      }
    },
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [
          'lib/jquery-1.10.2.js',
          'lib/positioning.js',
          'lib/angular.js',
          'lib/angular-mocks.js',
          'lib/jasmine-matchers.js',
          'lib/moment.js',
          'src/**/*.js',
          'tmp/*.js'],
        browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome']
      },
      tdd: {
        autoWatch: true
      },
      ci: {
        singleRun: true
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true,
          middleware: function(connect, options){
            return [
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    },
    watch: {
      tdd: {
        files: [
          'src/**/*.js',
          'src/**/*.html' ],
        tasks: [ 'html2js' ],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('tdd', ['karmalize', 'watch:tdd']);

  grunt.registerTask('karmalize', 'start karma in a background grunt', function () {
    var karma = cp.spawn('grunt', ['karma:tdd']);

    karma.stdout.pipe(process.stdout);
  });

  grunt.registerTask('default', ['jshint', 'html2js', 'karma:ci']);
  grunt.registerTask('server', ['connect:server']);
};
