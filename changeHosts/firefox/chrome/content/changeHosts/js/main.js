/**
 * Everything starts here. This class controls the configuration (first execution) and main commands fired by user
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

(function(){

    coders.changeHosts.main = {
    
        utils: coders.utils,
        ch: coders.changeHosts,
        dnsFlusher: coders.changeHosts.dnsFlusher,
		
        init: function(){
            this.preferences = new this.utils.prefs(this.ch.constants.branchName);
            this.log = new this.utils.log(this.preferences);
            this.dao = new this.ch.dao(this.preferences);
            
            this.manager = new this.ch.manager(this.log, this.dao, this.preferences);
            this.uiManager = new this.ch.uiManager(this.preferences, this.dao);
            
            this.appVersion = this.preferences.getInt("version");
            Application.console.log("[INFO] - Starting Change Hosts version: " + this.appVersion);
        },
        
        configure: function(){
            this.log.info("Configured?: " + this.preferences.getBool("configured"));
            if (!this.preferences.getBool("configured")) {
                this.log.info("Change hosts first execution. Configuring...");
                try {
                    this.dao.createDB(this.appVersion);
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
            }else{
				var dbVersion;
				try {
					dbVersion = this.dao.getVersion();
				} catch (e) {
					//Nothing to do, version structure probably not created
				}
				if(this.dao.migrateVersion(dbVersion, this.appVersion)){
					this.log.info("Change hosts updated from version: " + dbVersion + " to " + this.appVersion);
				}
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
            var showIcon = this.preferences.getBool("show-icon-status");
            var showDefinitionName = this.preferences.getBool("show-definition-name");
            var showIP = this.preferences.getBool("show-ip-status");
            
            this.utils.util.getElement("CH_status_img").hidden = !showIcon;
            this.utils.util.getElement("CH_status_definition_name").hidden = !showDefinitionName;
            this.utils.util.getElement("CH_status_ip").hidden = !showIP;
        }
    };
    
    window.addEventListener("load", function(){
        //Contruct
        coders.changeHosts.main.init();
        
        //Configure if its necessary
        coders.changeHosts.main.configure();
        //setupUI
        coders.changeHosts.main.uiManager.setupUI();
        coders.changeHosts.main.loadPrefs();
    }, false);
})();
