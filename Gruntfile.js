// Allow grunt-cli to run this gruntfile and
// tell us what "grunt" is
module.exports = function(grunt){
	// Initialize the grunt configurations
	grunt.initConfig({
		// Configure the uglify task (grunt uglify)
		uglify: {
			development: {
				// Configure the set of files to use in this subtask.
				// It will be an array of file definitions
				files: [
					{
						// key is the destination, value is the source
						'public/scripts/min/app.min.js': ['public/scripts/*/*.js']
					}
				],

				// specify options for the uglify:development subtask
				options: {
					beautify: true,
					sourceMap: true
				}
			},

			// Configure the build subtask (grunt uglify:build)
			build: {
				// use grunt templating to use the same files from the dev subtask
				files: '<%= uglify.development.files %>'
			}
		},

		// Configure the watch task
		watch: {
			// watch js files
			// uglify development subtask
			js: {
				files: ['public/scripts/*/*.js'],
				tasks: 'uglify:development'
			}
		}


	});


grunt.registerTask('development', ['uglify:development', 'watch']);
grunt.registerTask('build', ['uglify:build'])

// Register a default task that will run on 'grunt'
grunt.registerTask('default', ['development']);

// Load tasks (plugins) installed via npm so that grunt
// can access and use them
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');

};
