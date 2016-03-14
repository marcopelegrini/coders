(function(){

    coders.ns("coders.changeHosts").applicationContext = {
        // Constants
        branchName: "extensions.changeHosts.",
        databaseName: "changeHosts.sqlite",
		bundleName: "coders.changeHosts.string-bundle",
        // Preferences
        readFilesLimit: "read-files-limit",
        hostLocationPref: "hosts-location",
        executePostScriptPref: "script-flag",
        postScriptLocationPref: "script-location",
        postScriptSudoPref: "script-sudo-flag",
        flushDNSOnChangePref: "flush-dns-on-change",
        logLevelPref: "log-level",

        // Options configs
        optionsWindowName: "changeHosts:settings",
        optionsWindowURI: "chrome://changeHosts/content/options.xul",
        optionsWindowConfig: "chrome,toolbar,dialog=no,resizable,all,dependent,centerscreen",

        treeStyleSheetHREF: "chrome://changehosts/skin/treeStyles.css",
		logger: Components.utils.import("chrome://changeHosts/content/js/ctech/logUtils.jsm"),

        // Utils
        browserUtils: null,
        fileUtils: null,
        databaseUtils: null,
        dao: null,
        preferenceUtils: null,
        hostsManager: null,
        hostesseTemplateManager: null,
        uiManager: null,
        dnsFlusher: null,
        optionsDefinitions: null,

        init: function(){
        		if(coders.browserUtils){
                	this.browserUtils = coders.browserUtils;
        		}

        		if(coders.fileUtils){
                	this.fileUtils = coders.fileUtils;
        		}

        		if(coders.preferenceUtils){
                	this.preferenceUtils = new coders.preferenceUtils(this.branchName, this.bundleName);
        		}

				if(this.logger){
					var logLevel = this.preferenceUtils.getString(this.logLevelPref);
					this.logger.configureLogger("coders.changeHosts", logLevel);
                }

                if(coders.databaseUtils){
                	this.databaseUtils = new coders.databaseUtils(this.databaseName);
                }

                if(coders.changeHosts.dao){
                	this.dao = coders.changeHosts.dao;
                	this.dao.setContext(this);
                }

                if(coders.changeHosts.hostesseTemplateManager){
	                this.hostesseTemplateManager = coders.changeHosts.hostesseTemplateManager;
	                this.hostesseTemplateManager.setContext(this);
                }

                if(coders.changeHosts.hostsManager){
	                this.hostsManager = coders.changeHosts.hostsManager;
	                this.hostsManager.setContext(this);
                }

                if(coders.changeHosts.uiManager){
	                this.uiManager = coders.changeHosts.uiManager;
	                this.uiManager.setContext(this);
                }

                if(coders.changeHosts.dnsFlusherIntegration){
	                this.dnsFlusher = coders.changeHosts.dnsFlusherIntegration;
	                this.dnsFlusher.setContext(this);
                }

                if(this.logUtils){
                	this.logger.info('Change Hosts ApplicationContext configured');
                }
        },

        destroy: function(){
            this.logger.info('Change Hosts ApplicationContext destroied');
        }
    };
    //Construct as soon as file loads
    coders.changeHosts.applicationContext.init();
})();
