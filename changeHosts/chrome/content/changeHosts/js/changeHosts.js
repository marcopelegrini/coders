var CHosts = {
    // Preferences contants
    branchName: "extensions.changeHosts.",
    windowType: "changeHosts:settings",
    windowURI: "chrome://changeHosts/content/options.xul",
    //windowOptions: "chrome,toolbar,centerscreen",
    windowOptions: "chrome,toolbar,dialog=no,resizable,all,dependent,centerscreen",
    
    preferences: null,
	logger: null,
	definitions: null,
	options: null,
	utils: null,
    
    init: function(){
		this.preferences = new CTechPrefs(this.branchName, this.windowType, this.windowURI, this.windowOptions);
		this.logger = new CTechLog(this.preferences);
		this.preferences.setLogger(this.logger);
		this.utils = new CTechUtils();
		this.fileUtils = new CTechFileUtils();
		this.definitions = new CHDefinitions(this.utils);
		this.options = new CHOptions(this.utils, this.fileUtils, this.logger, this.preferences);
    }
}
//Initializes
CHosts.init();
