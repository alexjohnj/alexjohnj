module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          style: 'expanded',
          debugInfo: true,
          lineNumbers: true
        },
        files: {
          './static/css/styles.min.css': './static/css/styles.scss'
        }
      },

      dep: {
        options: {
          style: 'compressed'
        },
        files: {
          './static/css/styles.min.css': './static/css/styles.scss'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeEmptyAttributes: true,
          removeCommentsFromCDATA: true,
          removeRedundantAttributes: true,
          collapseBooleanAttributes: true
        },
        expand: true,
        src: './public/**/*.html',
      }
    },

    exec: {
      hugoBuild: 'hugo',
      clean: 'rm -rf ./public/*'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')

  grunt.registerTask('build', ['sass:dep', 'exec:clean', 'exec:hugoBuild', 'htmlmin:dist'])
};
