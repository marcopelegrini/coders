
/**
 * Everything starts here. This class controls the configuration (first execution) and main commands fired by user
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.changeHosts) 
    com.coders.changeHosts = {};

(function(){

    com.coders.changeHosts.main = {
    
        utils: com.coders.utils,
        ch: com.coders.changeHosts,
        dnsFlusher: com.coders.changeHosts.dnsFlusher,
		
        init: function(){
            Application.console.log("[INFO] - Starting Change Hosts");
            
            this.preferences = new this.utils.prefs(this.ch.constants.branchName);
            this.log = new this.utils.log(this.preferences);
            this.dao = new this.ch.dao(this.preferences);
            
            this.manager = new this.ch.manager(this.log, this.dao, this.preferences);
            this.uiManager = new this.ch.uiManager(this.preferences, this.dao);
        },
        
        configure: function(){
            this.log.info("Configured?: " + this.preferences.getBool("configured"));
            if (!this.preferences.getBool("configured")) {
                this.log.info("Change hosts first execution. Configuring...");
                try {
                    this.dao.createDB();
                } 
                catch (e) {
                    this.log.error("Error creating database" + e);
                    return;
                }
                try {
                    var defaultHostPath = this.manager.getDefaultHostPath();
                    this.log.info("Loading default host file from: " + defaultHostPath);
                    var defaultHost = this.utils.fileUtils.read(defaultHostPath);
                    if (defaultHost) {
                        var show = true;
                        var seleceted = true;
                        this.dao.saveNewHost("Default Host", seleceted, show, defaultHost);
                    }
                    this.preferences.setString(this.ch.constants.hostLocationPref, defaultHostPath);
                } 
                catch (e) {
                    this.log.error("Error creating default hosts: " + e);
                    return;
                }
                this.preferences.setBool("configured", true);
                this.log.info("Change hosts configured.");
            }
        },
        
        selectHost: function(id, event){
            var selected = false;
            try {
                selected = this.manager.select(id);
            } 
            catch (ex) {
                alert(this.preferences.getSBundle().getString("cH.errorSelectingDefinition") + " " + ex);
                this.log.error(ex);
            }
            this.uiManager.setupUI();
            if (selected && this.preferences.getBool("reload-on-change")) {
                this.dnsFlusher.refreshdns();
            }
        },
        
        dispatchStatusClick: function(anchor, event){
            if (event.button == 0) {
                this.dnsFlusher.refreshdns();
            }
        },
        
        openPreferences: function(){
            //Use window mediator to open preferences (needed because add-ons manager window)
            var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
            var topWindow = wm.getMostRecentWindow(this.ch.constants.windowType);
            if (topWindow) {
                topWindow.focus();
            }
            else {
                topWindow = wm.getMostRecentWindow(null);
                topWindow.openDialog(this.ch.constants.windowURI, "", this.ch.constants.windowOptions);
            }
        },
        
        loadPrefs: function(){
            var color = this.preferences.getString("definition-color");
            this.utils.util.getElement("CH_status_definition_name").setAttribute("style", "color:" + color + ";");
            
            var showIcon = this.preferences.getBool("show-icon-status");
            var showDefinitionName = this.preferences.getBool("show-definition-name");
            var showIP = this.preferences.getBool("show-ip-status");
            
            this.utils.util.getElement("CH_status_img").hidden = !showIcon;
            this.utils.util.getElement("CH_status_definition_name").hidden = !showDefinitionName;
            this.utils.util.getElement("CH_status_ip").hidden = !showIP;
        }
    };
    //Contruct
    com.coders.changeHosts.main.init();
    
    window.addEventListener("load", function(){
        //Configure if its necessary
        com.coders.changeHosts.main.configure();
        //setupUI
        com.coders.changeHosts.main.uiManager.setupUI();
        com.coders.changeHosts.main.loadPrefs();
    }, false);
})();
