
/**
 * General preference utilities
 *
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.utils) 
    coders.utils = {};

(function(){

    coders.utils.prefs = function(branchName){
    
        this.branchName = branchName;
        this.prefs = null;
        
        //Get preferences branch
        this.getPrefs = function(){
            //Lazy loading
            if (!this.prefs) {
                var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
                this.prefs = prefService.getBranch(this.branchName);
            }
            return this.prefs;
        }
        
        this.getBool = function(name){
            return this.getPrefs().getBoolPref(name);
        }
        
        this.setBool = function(name, value){
            this.getPrefs().setBoolPref(name, value);
        }
        
        this.getString = function(name){
            return this.getPrefs().getCharPref(name);
        }
        
        this.setString = function(name, value){
            this.getPrefs().setCharPref(name, value);
        }
        
        this.getInt = function(name){
        	try {
        		return this.getPrefs().getIntPref(name);
        	}catch(e){
        		return null;
        	}
        }
        
        this.setInt = function(name, value){
            this.getPrefs().setIntPref(name, value);
        }
        
        this.reset = function(){
            var prefBranch = this.getPrefs();
            var c = {
                value: 0
            };
            var chindren = prefBranch.getChildList("", c);
            for (var i = 0; i < c.value; ++i) {
                if (prefBranch.prefHasUserValue(chindren[i])) {
                    //Application.console.log("Cleaning... " + chindren[i]);
                    prefBranch.clearUserPref(chindren[i]);
                }
                //                else {
                //                    Application.console.log("User doesn't set this value: " + chindren[i]);
                //                }
            }
        }
        
        this.getSBundle = function(){
            return document.getElementById("coders.changeHosts.string-bundle");
        }
    }
})();

