// Allow grunt-cli to run this gruntfile and
// tell us what "grunt" is
module.exports = function(grunt){
	// Initialize the grunt configurations
	grunt.initConfig({
		// Configure the uglify task (grunt uglify)
		ngmin: {
			controllers: {
				src: ['public/scripts/controllers/*.js'],
				dest: 'public/scripts/temp/controllers.js'
			},

			directives: {
				src: ['public/scripts/directives/*.js'],
				dest: 'public/scripts/temp/directives.js'

			},

			services: {
				src: ['public/scripts/services/*.js'],
				dest: 'public/scripts/temp/services.js'
			}
		},

		uglify: {
			development: {
				files: [{
					'public/scripts/min/controllers.min.js': ['public/scripts/temp/controllers.js'],
					'public/scripts/min/directives.min.js': ['public/scripts/temp/directives.js'],
					'public/scripts/min/services.min.js': ['public/scripts/temp/services.js']
				}],

				options: {
					beutify: true,
					sourceMap: true
				}
			}
		},

		watch: {
			js: {
				files: ['public/scripts/**/*.js', '!public/scripts/temp/**/*.js', '!public/scripts/min/**/*.js'],
				tasks: ['dev']
			}
		}






	});



// Register a default task that will run on 'grunt'
grunt.registerTask('dev', [ 'ngmin:controllers', 'ngmin:directives', 'ngmin:services', 'uglify:development'])

// Load tasks (plugins) installed via npm so that grunt
// can access and use them
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-ngmin');
grunt.loadNpmTasks('grunt-contrib-watch');

};
