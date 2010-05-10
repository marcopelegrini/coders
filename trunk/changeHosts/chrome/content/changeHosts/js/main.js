var CHMain = {

    init: function(){
        Application.console.log("[INFO] - Starting Change Hosts");
        this.preferences = new CTechPrefs(CHConstants.branchName, CHConstants.windowType, CHConstants.windowURI, CHConstants.windowOptions);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.fileUtils = new CTechFileUtils();
        this.dao = new CHDao(this.preferences);
		this.manager = new CHManager(this.utils, this.log);
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
            } 
            catch (e) {
                this.log.error("Error creating default hosts: " + e);
            }
            this.preferences.setBool("configured", true);
            this.log.info("Change hosts configured.");
        }
    },
    
    setupUI: function(){
        var menu = this.utils.getElement("changeHosts-statepopup");
        this.cleanHostsItens(menu);
        
        var firstMenuItem = menu.firstChild;
        var host, item;
        
        var hosts = this.dao.listToShow();
        for (var i = 0; i < hosts.length; i++) {
            host = hosts[i];
            item = this.genRow(host)
            menu.insertBefore(item, firstMenuItem);
            if (host.selected) {
    			this.utils.getElement("definition-name").value = host.name;        
            }
        }
		
		this.loadPrefs();
    },
	
    loadPrefs: function(){
        var color = this.preferences.getString("definition-color");
        this.utils.getElement("definition-name").setAttribute("style", "color:" + color + ";");
    },
    
    cleanHostsItens: function(menu){
        var itens = menu.getElementsByClassName('host-item');
        while (itens.length > 0) {
            menu.removeChild(itens[0]);
        }
    },
    
    genRow: function(host){
        var menuitem = document.createElement('menuitem');
        
        menuitem.setAttribute('class', 'host-item');
        menuitem.setAttribute('type', 'checkbox');
        menuitem.setAttribute('label', host.name);
        menuitem.setAttribute('value', host.id);
        menuitem.setAttribute('checked', host.selected);
        menuitem.setAttribute('oncommand', "CHMain.selectHost(this.getAttribute('value'));");
        
        return menuitem;
    },
    
    selectHost: function(id, event){
        this.log.info("Changing hosts to: " + id);
        if (!this.dao.selectHost(id)) {
            alert("#Impossivel selecionar o hosts.");
        }
        this.setupUI();
    },
    
    dispatchStatusClick: function(anchor, event){
        if (event.button == 0) {
            var menu = this.utils.getElement("changeHosts-statepopup");
            menu.openPopup(anchor, 'before_end', -1, -1, false, false);
        }
        else 
            if (event.button == 2) {
                event.preventDefault();
            }
    },
    
    //Use window mediator to open preferences (needed because add-ons manager window)
    openPreferences: function(){
        var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
        var topWindow = wm.getMostRecentWindow(CHConstants.windowType);
        if (topWindow) {
            topWindow.focus();
        }
        else {
            topWindow = wm.getMostRecentWindow(null);
            topWindow.openDialog(CHConstants.windowURI, "", CHConstants.windowOptions);
        }
    }
};
//Contruct
CHMain.init();

window.addEventListener("load", function(){
    //Configure if its necessary
    CHMain.configure();
    //setupUI
    CHMain.setupUI();
}, false);
//window.addEventListener("unload", function(){
//    dnsFlusher.destroy();
//}, false);
