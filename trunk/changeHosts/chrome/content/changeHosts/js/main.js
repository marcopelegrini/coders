/**
 * Everything starts here. This class controls the configuration (first execution) and main commands fired by user
 */
var CHMain = {

    init: function(){
        Application.console.log("[INFO] - Starting Change Hosts");
        this.preferences = new CTechPrefs(CHConstants.branchName);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.fileUtils = new CTechFileUtils(this.utils);
        this.dao = new CHDao(this.preferences);
        this.manager = new CHManager(this.utils, this.log, this.dao, this.preferences, this.fileUtils);
        this.uiManager = new CHUiManager(this.preferences, this.utils, this.dao);
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
            }
            try {
                var defaultHostPath = this.manager.getDefaultHostPath();
                this.log.info("Loading default host file from: " + defaultHostPath);
                var defaultHost = this.fileUtils.read(defaultHostPath);
                if (defaultHost) {
                    var show = true;
                    var seleceted = true;
                    this.dao.saveNewHost("Default Host", seleceted, show, defaultHost);
                }
                this.preferences.setString(CHConstants.hostLocationPref, defaultHostPath);
            } 
            catch (e) {
                this.log.error("Error creating default hosts: " + e);
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
   			alert(this.preferences.getSBundle().getString("cH.errorSelectingDefinition"));
			this.log.error(ex.getCause());     
        }
        this.uiManager.setupUI();
        if (selected && this.preferences.getBool("reload-on-change")) {
            CHDnsFlusher.refreshdns();
        }
    },
    
    dispatchStatusClick: function(anchor, event){
        if (event.button == 0) {
            CHDnsFlusher.refreshdns();
        }
    },
    
    openPreferences: function(){
        //Use window mediator to open preferences (needed because add-ons manager window)
        var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
        var topWindow = wm.getMostRecentWindow(CHConstants.windowType);
        if (topWindow) {
            topWindow.focus();
        }
        else {
            topWindow = wm.getMostRecentWindow(null);
            topWindow.openDialog(CHConstants.windowURI, "", CHConstants.windowOptions);
        }
    },
    
    loadPrefs: function(){
        var color = this.preferences.getString("definition-color");
        this.utils.getElement("CH_status_definition_name").setAttribute("style", "color:" + color + ";");
        
        var showIcon = this.preferences.getBool("show-icon-status");
        var showDefinitionName = this.preferences.getBool("show-definition-name");
        var showIP = this.preferences.getBool("show-ip-status");
        
        this.utils.getElement("CH_status_img").hidden = !showIcon;
        this.utils.getElement("CH_status_definition_name").hidden = !showDefinitionName;
        this.utils.getElement("CH_status_ip").hidden = !showIP;
    }
};
//Contruct
CHMain.init();

window.addEventListener("load", function(){
    //Configure if its necessary
    CHMain.configure();
    //setupUI
    CHMain.uiManager.setupUI();
    CHMain.loadPrefs();
}, false);
