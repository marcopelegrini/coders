
/**
 * General utility for log purpose
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

    com.coders.utils.log = function(preferences){
    
        this.logPreference = "log";
        this.enabled = preferences.getBool(this.logPreference);
        this.console = Application.console;
        
        this.debug = function(string){
            if (this.enabled) {
                this.console.log("[DEBUG] - " + string);
            }
        }
        this.info = function(string){
            if (this.enabled) {
                this.console.log("[INFO] - " + string);
            }
        }
        this.warn = function(string){
            if (this.enabled) {
                this.console.log("[WARN] - " + string);
            }
        }
        this.error = function(string){
            if (this.enabled) {
                this.console.log("[ERROR] - " + string);
            }
        }
    }
    
    com.coders.utils.util = {
    
        /**
         * General utilities
         */
        getOperationSystem: function(){
            var sysInfo = Components.classes['@mozilla.org/system-info;1'].getService(Components.interfaces.nsIPropertyBag2);
            var plataform = sysInfo.getProperty('name');
            return plataform;
        },
        
        isMacOS: function(){
            return this.getOperationSystem() == "Darwin";
        },
        
        trim: function(string){
            if (string != null && string != undefined) {
                return string.replace(/^\s*/, "").replace(/\s*$/, "");
            }
            return string;
        },
        
        getElement: function(id, aDocument){
            if (aDocument) {
                return aDocument.getElementById(id);
            }
            return document.getElementById(id);
        },
        
        getBrowserWindow: function(){
            var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
            return wm.getMostRecentWindow("navigator:browser");
        },
        
        isBlank: function(string){
            if (string && string != null && string != undefined) {
                var newString = this.trim(string);
                if (newString.length > 0) {
                    return false;
                }
            }
            return true;
        }
    }
})();
