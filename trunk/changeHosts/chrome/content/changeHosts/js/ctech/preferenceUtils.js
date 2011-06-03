/**
 * General preference utilities
 * 
 * @author marcotulio
 */
function CTechPrefs(branchName){

    // Preferences contants
    this.branchName = branchName;
    
    //Singleton instance
    this.prefs = null;
	this.logger;
    
    //Get preferences branch
    this.getPrefs = function(){
		//Lazy loading
        if (!this.prefs) {
            var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
            this.prefs = prefService.getBranch(this.branchName);
        }
        return this.prefs;
    }
    
    this.getBool = function(value){
        return this.getPrefs().getBoolPref(value);
    }
	
	this.setBool = function(name, value){
		this.getPrefs().setBoolPref(name, value);
	}
    
    this.getString = function(value){
        return this.getPrefs().getCharPref(value);
    }
	
    this.setString = function(name, value){
        this.getPrefs().setCharPref(name, value);
    }
    
	this.setLogger = function(logger){
		this.logger = logger;
	}
	
    this.reset = function(){
        var prefBranch = this.getPrefs();
        var c = {
            value: 0
        };
        var chindren = prefBranch.getChildList("", c);
        for (var i = 0; i < c.value; ++i) {
            if (prefBranch.prefHasUserValue(chindren[i])) {
                this.logger.debug("Cleaning... " + chindren[i]);
                prefBranch.clearUserPref(chindren[i]);
            }
            else {
                this.logger.debug("User doesn't set this value: " + chindren[i]);
            }
        }
    }
}