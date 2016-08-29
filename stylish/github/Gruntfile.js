module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            less: {
                files: ['*.js','*.less'],
                tasks: ['less']
            }
        },

        less: {
            development: {
				options: {
					compress: true,
					ieCompat: false
				},
                files: {
                    "style.css": "style.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s).
    grunt.registerTask('default', ['less']);
};
