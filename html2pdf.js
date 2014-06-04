var phantom = require('phantom');

phantom.create(function(ph){
	ph.createPage(function(page){
		page.set('paperSize', {
			format: 'A4'
		}, function() {
			console.log('Page size is A4');
		})
		page.render(testPdf.pdf, function(){
			console.log('File is now written to disk.')
		})
	})
})
