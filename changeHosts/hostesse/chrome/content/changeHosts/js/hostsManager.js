/**
 * Definitions selector manager (just to decouple each part of plugin)
 *
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};
	
(function(){
	
    coders.changeHosts.hostsManager = {
       
        ctx: coders.changeHosts.applicationContext,

        setContext: function(applicationContext){
            this.ctx = applicationContext;
        },
        
        changeHosts: function(content){
            var hostLocation = this.ctx.preferenceUtils.getString(this.ctx.hostLocationPref);
			if(this.ctx.browserUtils.isBlank(hostLocation)){
				throw new FileNotFoundException();
			}
                
            this.ctx.logUtils.debug("Writing new hosts to: " + hostLocation);
            this.ctx.fileUtils.save(hostLocation, content);

            //Execute post-script if its necessary
            var executePostScript = this.ctx.preferenceUtils.getBool(this.ctx.executePostScriptPref);
            if (executePostScript) {
            	try{
	                this.ctx.logUtils.debug("Running post-script file...");
	                var postScript = this.ctx.preferenceUtils.getString(this.ctx.postScriptLocationPref);
	                this.ctx.fileUtils.execute(postScript);
            	}catch(e){
            		this.ctx.logUtils.error("Error running post script" + e);
            		var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.errorRunningPostScript");
            		alert(msg);
            	}
            }

            var flushOnChange = this.ctx.preferenceUtils.getBool(this.ctx.flushDNSOnChangePref);
            if (flushOnChange && this.ctx.dnsFlusher.integrated()){
                var browserWindow = this.ctx.browserUtils.getBrowserWindow();

                var evt = browserWindow.document.createEvent("Events");
                evt.initEvent("DNSFlusherEvent", true, false);
                browserWindow.document.dispatchEvent(evt);                
            }    

            this.ctx.logUtils.info("Hosts changed.")
            return true;
        },

        getDefaultHostPath: function(){
            return coders.browserUtils.isWindows() ? "c:\\windows\\system32\\drivers\\etc\\hosts" : "/etc/hosts";
        },

		findHostsColor: function(path){
			if (path && path != undefined && path != null){
				var hostsPath = path;
			}else{
				var hostsPath = this.ctx.preferenceUtils.getString("current-host");
			}
			this.ctx.logUtils.info("Looking from a color to path: " + hostsPath);
			if(hostsPath){
				var hostsConfig = this.ctx.dao.findHostsConfig(hostsPath);
				if (hostsConfig && hostsConfig.color){
					//Found a specific color for this hosts
					this.ctx.logUtils.info("Found hosts specific color " + hostsConfig.color + " for path: " + hostsPath);
					return hostsConfig.color;
				}else{
					var lio = hostsPath.lastIndexOf(this.ctx.fileUtils.getFileSeparator());
					var hostsFolder = hostsPath.substr(0, lio);
					this.ctx.logUtils.info("Looking form hosts folder color for path: " + hostsFolder);
					var folderHostsConfig = this.ctx.dao.findHostsConfig(hostsFolder);
					if (folderHostsConfig && folderHostsConfig.color){
						// Found a specific color for this hosts' folder
						this.ctx.logUtils.info("Found folder specific color " + folderHostsConfig.color + " for path: " + hostsPath);
						return folderHostsConfig.color;	
					}else{
						var regexConfigs = this.ctx.dao.findAllRegexConfig();
			            for(var i = 0; i < regexConfigs.length; i++){
			                var regexConfig = regexConfigs[i];
			                var regex = new RegExp(regexConfig.regex, 'i');

			                if (hostsPath.match(regex)){
			               		// Found a regex that matches this hosts path
			               		this.ctx.logUtils.info("Found regex that matches: Hostspath: " + hostsPath + " Regex: " + regex);
			               		return regexConfig.color;	
			                }
			            }
					}
				}
			}

			return this.ctx.preferenceUtils.getString("definition-color");
		}
    }
})();
