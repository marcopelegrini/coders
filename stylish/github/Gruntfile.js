module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            less: {
                files: ['*.less'],
                tasks: ['less']
            }
        },

        less: {
            development: {
				options: {
					compress: true,
					ieCompat: false,
					optimization: 9
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
