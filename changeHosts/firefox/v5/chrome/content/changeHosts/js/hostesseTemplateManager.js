/**
 * @author marcotulio
 */
(function(){

	Components.utils.import("chrome://changeHosts/content/js/ctech/logUtils.jsm");

    coders.ns("coders.changeHosts").hostesseTemplateManager = {

    	ctx: coders.changeHosts.applicationContext,
		logger: Log.repository.getLogger("coders.changeHosts.hostesseTemplateManager"),

		includePattern: new RegExp('{(.+)}','ig'),
        dirSeparatorPattern: new RegExp('/|\\\\', 'ig'),
        fileSeparator: null,

    	setContext: function(applicationContext){
    		this.ctx = applicationContext;
    	},

    	parse: function(filePath){
    		this.defaultHostFileExtension = this.ctx.preferenceUtils.getString('default-host-file-extension');
    		this.definitionsRootDir = this.ctx.preferenceUtils.getString('definitions-root-dir');
        	this.fileSeparator = this.ctx.fileUtils.getFileSeparator();

        	var header = '#> HOST FILE GERERATED BY CHANGE HOSTS FOR FIREFOX <#\n'

			return new Promise(function(resolve, reject) {
				this._parse(filePath, this.definitionsRootDir).then(content => {
					let finalResult = header + "\n" + content + "\n";
					resolve(finalResult);
				})
			}.bind(this));
		},

		_parse: function(filePath, rootDir, parsingCount = 0) {
			this.logger.debug("Parsing: " + filePath);
			if(parsingCount > 100){
				throw new Error("Stack overflowed");
			}
			return new Promise(function(resolve, reject) {
				this.ctx.fileUtils.read(filePath).then(content => {
					let fileName = filePath.replace(rootDir + this.fileSeparator, "");
					let result = '#> From: ' + fileName + '\n';

					let lines = content.split('\n');
					var dependencies = 0;
					lines.map((line) => {
						//Reseting regex object
						this.includePattern.lastIndex=0;
						let match = this.includePattern.exec(line);
						if (match){
							dependencies++;
							parsingCount++;
							let includeName = match[1].trim().replace(this.dirSeparatorPattern, this.fileSeparator);
							let includePath = rootDir + this.fileSeparator + includeName  + this.defaultHostFileExtension;

							this._parse(includePath, rootDir, parsingCount++).then((nestedResult) => {
								let finalNested = result.replace(line, nestedResult);
								dependencies--;
								result = finalNested;
								if (dependencies == 0){
									resolve(finalNested);
								}
							});
						}
						result += line + '\n';
					})
					result += '#> End: ' + fileName;
					if (dependencies == 0){
						resolve(result);
					}
				}).catch(exception => {
					this.logger.error("Error parsing: " + filePath + exception);
					resolve('#> ERROR: Could not parse file/include ' + filePath);
				});
			}.bind(this));
		}
	};
})();
