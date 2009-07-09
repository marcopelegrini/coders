/**
 * @author marcotulio
 */
function CTechPrefs2(branchName, windowType, windowURI, windowOptions){

    // Preferences contants
    this.branchName = branchName;
    this.windowType = windowType;
    this.windowURI = windowURI;
    this.windowOptions = windowOptions;
    
    //Singleton instance
    var prefs = null;
    
    //Get preferences branch
    this.getPrefs = function(){
        if (prefs == null) {
            var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
            prefs = prefService.getBranch(this.branchName);
        }
        return prefs;
    }
    
    this.getBool = function(value){
        return this.getPrefs().getBoolPref(value);
    }
    
    this.getString = function(value){
        return this.getPrefs().getCharPref(value);
    }
    
    //Use window mediator to open preferences (needed because add-ons manager window)
    this.open = function(){
        var wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
        var topWindow = wm.getMostRecentWindow(this.windowType);
        
        if (topWindow) {
            topWindow.focus();
        }
        else {
            topWindow = wm.getMostRecentWindow(null);
            topWindow.openDialog(this.windowURI, "", this.windowOptions);
        }
    }
    
    this.reset = function(){
        var prefBranch = this.getPrefs();
        var c = {
            value: 0
        };
        var chindren = prefBranch.getChildList("", c);
        for (var i = 0; i < c.value; ++i) {
            if (prefBranch.prefHasUserValue(chindren[i])) {
                CTechLog.debug("Cleaning... " + chindren[i]);
                prefBranch.clearUserPref(chindren[i]);
            }
            else {
                CTechLog.debug("User doesn't set this value: " + chindren[i]);
            }
        }
    }
}
