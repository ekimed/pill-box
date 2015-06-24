// Allow grunt-cli to run this gruntfile and
// tell us what "grunt" is
module.exports = function(grunt){
	// Initialize the grunt configurations
	grunt.initConfig({
		// Configure the uglify task (grunt uglify)
		ngmin: {
			controllers: {
				src: ['src/public/scripts/controllers/*.js'],
				dest: 'src/public/scripts/temp/controllers.js'
			},

			directives: {
				src: ['src/public/scripts/directives/*.js'],
				dest: 'src/public/scripts/temp/directives.js'

			},

			services: {
				src: ['src/public/scripts/services/*.js'],
				dest: 'src/public/scripts/temp/services.js'
			}
		},

		uglify: {
			development: {
				files: [{
					'src/public/scripts/min/controllers.min.js': ['src/public/scripts/temp/controllers.js'],
					'src/public/scripts/min/directives.min.js': ['src/public/scripts/temp/directives.js'],
					'src/public/scripts/min/services.min.js': ['src/public/scripts/temp/services.js']
				}],

				options: {
					beutify: true,
					sourceMap: true
				}
			}
		},

		watch: {
			js: {
				files: ['src/public/scripts/**/*.js', '!src/public/scripts/temp/**/*.js', '!src/public/scripts/min/**/*.js'],
				tasks: ['dev']
			}
		},
        // read-only task, single src property is needed
        jshint: {
            controllers: {
                src: ['src/public/scripts/controllers/*.js']
            },
            directives: {
                src: ['src/public/scripts/directives/*.js']
            },
            services: {
                src: ['src/public/scripts/services/*.js']
            }
        }






	});



// Register a default task that will run on 'grunt'
grunt.registerTask('dev', [ 'ngmin:controllers', 'ngmin:directives', 'ngmin:services', 'uglify:development'])

// Load tasks (plugins) installed via npm so that grunt
// can access and use them
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-ngmin');
grunt.loadNpmTasks('grunt-contrib-watch');

};
