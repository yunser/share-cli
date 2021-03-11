#! /usr/bin/env node

const os = require('os');
// import fs from 'fs'
// import path from 'path'
const path = require('path');
var open = require('open');
let cp = require('child_process');
const portfinder = require('portfinder');
var qrcode = require('qrcode-terminal');
const handler = require('serve-handler')
const http = require('http')
const commander = require('commander')

commander
    .version('v0.0.1')
    .description('Share files on a local area network.')

commander
    .option('-v, --version', 'show version')
//     .option('-l, --list', 'show all cmd')
//     .option('-a, --add', 'Add bbq sauce')
//     .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
// console.log('demo-cli', process.cwd())

commander
    .helpOption('-h, --HELP')

// program.parse(process.argv);


///获取本机ip///
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


// console.log('cwd', process.cwd())
// console.log('process.argv /', process.argv)


commander.option('-o, --open', 'open url in browser.')

commander
    .command('in <folder>')
    .description('share files in a folder.')
    .action(async (folder) => {
        const options = commander.opts();
        // console.log('options', options)
        // console.log('folder', folder)
        const publicPath = path.resolve(process.cwd(), folder || '.')
        console.log(`share path: ${publicPath}`)

        const port = await portfinder.getPortPromise()
        // console.log('port: ' + port)
            // .then((port) => {
            //     //
            //     // `port` is guaranteed to be a free port
            //     // in this scope.
            //     //
            // })
            // .catch((err) => {
            //     //
            //     // Could not get a free port, `err` contains the reason.
            //     //
            // });
        
        const myHost = getIPAdress();
        // console.log('myHost', myHost)
        const url = `http://${myHost}:${port}`
        console.log(`share url: ${url}`)
        
        // http-server
        // cp.exec(`serve -p ${port}`, {  }, function(err, stdout, stderr){
        //     console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding), "error"+iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
        // });
        
    // console.log('process.argv /', process.argv)

        const server = http.createServer(async (request, response) => {
            // You pass two more arguments for config and middleware
            // More details here: https://github.com/vercel/serve-handler#options
            return await handler(request, response, {
                public: publicPath,
            });
        })
        
        server.listen(port, () => {
            // console.log(`Running at ${url}`)
        })

        console.log('You can scan the QR code with your mobile phone.')
        qrcode.generate(url)

        // cp.exec(`start ${url}`)
        // console.log('?', `start ${url}`)
        if (options.open) {
            open(url)
        }
    })

commander.parse(process.argv)

async function main() {
    
}

// main()
