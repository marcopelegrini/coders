/**
 * @author marcotulio
 */
const console = Application.console;

var Log = {
    open: function(){
        console.open();
    },
    info: function(string){
        console.log("[INFO] - " + string);
    },
    warn: function(string){
        console.log("[WARN] - " + string);
    },
    error: function(string){
        console.log("[ERROR] - " + string);
    }
}

var Prefs = {
    load: function(){
    },
    
    open: function(){
        var wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
        var topWindow = wm.getMostRecentWindow("changeHosts:settings");
        
        if (topWindow) {
            topWindow.focus();
        }
        else {
            topWindow = wm.getMostRecentWindow(null);
            topWindow.openDialog("chrome://changeHosts/content/options.xul", "changeHosts:settings", "chrome,toolbar,centerscreen");
        }
    },
    reset: function(){
        //var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        var branchName = "extensions.changeHosts.";
        //var prefBranch = prefService.getBranch(branchName);
        var prefBranch = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        
        Log.open();
        
        //alert("doing");
        var c = {
            value: 0
        };
        var prefs = prefBranch.getChildList(branchName, c);
        for (var i = 0; i < c.value; ++i) {
            Log.info(prefs[i]);
            //prefBranch.clearUserPref(prefs[i]);
        }
    }
}
