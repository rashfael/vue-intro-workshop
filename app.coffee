axis = require 'axis'
autoprefixer = require 'autoprefixer-stylus'
dynamic_content = require 'dynamic-content'

module.exports =
	debug: true
	extensions: [dynamic_content()]
	output: 'public'
	ignores: ['README.md', '.gitignore', 'layouts/*', '**/_*', '**/*.sw*', 'shopping-list-api/*']

	stylus:
		use: [axis(), autoprefixer()]

	layouts:
		default: 'layouts/presentation.jade'
