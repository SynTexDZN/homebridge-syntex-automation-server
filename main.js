const http = require('http'), url = require('url'), store = require('json-fs-store'), logger = require('syntex-logger');

const pluginID = 'homebridge-syntex-automation-server';
const pluginName = 'SynTexAutomationServer';

module.exports = (homebridge) => homebridge.registerPlatform(pluginID, pluginName, SynTexAutomationServer);

class SynTexAutomationServer
{
	constructor(log, config, api)
	{
        this.cacheDirectory = config['cacheDirectory'];
		this.logDirectory = config['logDirectory'];
		this.port = config['port'] || 1777;
		this.debug = config['debug'] || false;
        this.language = config['language'] || 'en';
        
        this.storage = store(this.cacheDirectory);

        this.logger = new logger('SynTexAutomationServer', this.logDirectory, this.debug, this.language);
        
        this.loadAutomation().then(() => this.initWebServer());
    }

    loadAutomation()
    {
        return new Promise((resolve) => {
			
			this.storage.load('automation', (err, obj) => {  

				if(!obj || err)
				{
					this.automation = [];
				}
				else
				{
					this.automation = obj.automation;
                }

                console.log(this.automation);
                
                resolve();
			});
		});
    }

    initWebServer()
    {
        var createServerCallback = (request, response) => {

			var urlParts = url.parse(request.url, true);
			var urlParams = urlParts.query;
			var urlPath = urlParts.pathname;
			var body = [];
			
			body = Buffer.concat(body).toString();

			response.statusCode = 200;
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader('Content-Type', 'application/json');

			if(urlPath.includes('.'))
			{
				urlPath = urlPath.split('.')[0];
            }
            
            if(urlPath == '/')
            {
                response.write('Hello');
                response.end();
            }
            else if(urlPath == '/update-automation')
            {
                if(urlParams.id != null)
                {
                    response.write('Success');
                }
                else
                {
                    response.write('Du hast keine ID angegeben!');
                }
                
                response.end();
            }
		};

		http.createServer(createServerCallback).listen(this.port, '0.0.0.0');
		
		this.logger.log('info', 'bridge', 'Bridge', 'SynTex Automation %port_running% [' + this.port + ']');
    }
}