module.exports = function(grunt) {

  grunt.initConfig({

	  	clean: ['dist'],
				
		requirejs: {
			
			build: {
			
				options: {
					
					paths: {
						'backbone': '../vendor/backbone-min',
						'underscore': '../vendor/underscore-min',
						'jquery': '../vendor/jquery-1.11.0.min',	
					},
					
					baseUrl: 'src',
			    	
			    	name: 'chess-grid',
			    	
			    	out: 'dist/chess-grid.min.js',
			    	
			    	exclude: ['backbone', 'underscore', 'jquery']
				}
		
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['clean', 'requirejs:build']);
};
