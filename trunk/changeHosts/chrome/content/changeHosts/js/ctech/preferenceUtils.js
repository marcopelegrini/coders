
/**
 * General preference utilities
 *
 * @author marcotulio
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.utils) 
    com.coders.utils = {};

(function(){

    com.coders.utils.prefs = function(branchName){
    
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
            return document.getElementById("com.coders.changeHosts.string-bundle");
        }
    }
})();

