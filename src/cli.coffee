# Command to expose vw as a socket/rest server

fs = require 'fs'
path = require 'path'
package_json = JSON.parse fs.readFileSync path.join(__dirname, '../package.json')
server = require './server'
doc = """
#{package_json.description}

Usage:
    vw-server [options] <port> [<vw_param>...]

Options:
    --help
    --version

Description:
    This is what it does....

"""
{docopt} = require 'docopt', version: package_json.version
options = docopt doc
server options['<port>'], options['<vw_param']
