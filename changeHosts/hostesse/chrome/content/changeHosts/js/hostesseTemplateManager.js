/**
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

(function(){

    coders.changeHosts.hostesseTemplateManager = {

    	ctx: coders.changeHosts.applicationContext,
        includePattern: new RegExp('{(.+)}','ig'),
        dirSeparatorPattern: new RegExp('/|\\\\', 'ig'),
        fileSeparator: null,

    	setContext: function(applicationContext){
    		this.ctx = applicationContext;
    	},

    	parse: function(fileName){
    		this.defaultHostFileExtension = this.ctx.preferenceUtils.getString('default-host-file-extension');
    		this.definitionsRootDir = this.ctx.preferenceUtils.getString('definitions-root-dir');
            this.fileSeparator = this.ctx.fileUtils.getFileSeparator();

            var content = '# => HOST FILE GERERATED BY CHANGE HOSTS FOR FIREFOX <= #\n'
    		return content + this._parse(fileName, this.definitionsRootDir);
		},

    	_parse: function(fileName, rootDir, includePath){
    		this.ctx.logUtils.debug("Reading file: " + fileName);

    		try{
    			var content = this.ctx.fileUtils.read(fileName);
    		}catch(e){
                if (e instanceof coders.changeHosts.FileNotFoundException){
                    if (includePath){
                        var lio = rootDir.lastIndexOf(this.fileSeparator);
                        if (lio > 0){
                            var newRootDir = rootDir.substring(0, lio);
                            this.ctx.logUtils.trace("Dropping down on root dir:  " + newRootDir);                    
                            return this._parse(newRootDir + this.fileSeparator + includePath + this.defaultHostFileExtension, newRootDir, includePath);
                        }
                    }
                }
    			this.ctx.logUtils.error("Error reading file " + fileName + "\n" + e);
    			return '#ERROR: Could not parse file/include ' + fileName + e;
    		}
    		var finalContent = '# Parsed => ' + fileName + '\n';			
    		var lines = content.split('\n');
			for(var i = 0;i < lines.length;i++){
				var lineValue = lines[i];
                //Reseting regex object
                this.includePattern.lastIndex=0;
				var match = this.includePattern.exec(lineValue);
				if (match){
					var includePath = match[1].trim();
					includePath = includePath.replace(this.dirSeparatorPattern, this.fileSeparator);
					var include = rootDir + this.fileSeparator + includePath  + this.defaultHostFileExtension;
					lineValue = this._parse(include, rootDir, includePath);
				}
				if (lineValue && lineValue != null){
					finalContent += lineValue + '\n';
				}
			}
			if (finalContent && finalContent != null){
				return finalContent;
			}
    	}
	};
})();