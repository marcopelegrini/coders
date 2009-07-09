var CHosts = {
    // Preferences contants
    branchName: "extensions.changeHosts.",
    windowType: "changeHosts:settings",
    windowURI: "chrome://changeHosts/content/options.xul",
    windowOptions: "chrome,toolbar,centerscreen",
    
    preferences: null,
    
    loadPreferences: function(){
		CTechLog.info("Loading preferences...");
        this.preferences = new CTechPrefs2(this.branchName, this.windowType, this.windowURI, this.windowOptions);
    },
    
    openPreferences: function(){
        if (!this.preferences) {
            this.loadPreferences();
        }
        this.preferences.open();
    }
}
