/**
 * Class to manage host definitions
 *
 * @author marcotulio
 */
var CHDefinitions = {

    init: function(){
        this.preferences = new CTechPrefs(CHConstants.branchName, CHConstants.windowType, CHConstants.windowURI, CHConstants.windowOptions);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.dao = new CHDao(this.preferences);
        this.manager = new CHManager(this.utils, this.log, this.dao, this.preferences, new CTechFileUtils(this.utils));
        this.uiManager = new CHUiManager(this.preferences, this.utils, this.dao);
    },
    
    onLoad: function(){
        this.populateList();
    },
    
    populateList: function(){
        var hosts = this.dao.list();
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            this.addItemToList(host.id, host.name);
        }
    },
    
    addItemToList: function(id, name){
        var list = this.utils.getElement("definition-list");
        return list.appendItem(name, id);
    },
    
    add: function(){
        this.uiEditable(true);
        this.uiClean();
		
        this.utils.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.new");
        
        this.utils.getElement("new-definition-button").disabled = true;
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        this.utils.getElement("show-in-menu").checked = true;
        
        this.utils.getElement("definition-list").clearSelection();
        this.utils.getElement("definition-list").disabled = true;
    },
    
    save: function(){
        if (this.saveHost()) {
            this.uiManager.setupUI();
        }
    },
    
    saveAndUse: function(){
        try {
            var id = this.saveHost();
        } 
        catch (ex) {
            alert(this.preferences.getSBundle().getString("cH.unableToSaveDefinition"));
            this.log.error(ex.getCause());
        }
        if (id) {
            try {
                this.manager.select(id);
                this.uiManager.setupUI();
            } 
            catch (ex) {
                alert(this.preferences.getSBundle().getString("cH.unableToSaveDefinition"));
                this.log.error(ex.getCause());
            }
            if (this.preferences.getBool("reload-on-change")) {
                var browser = this.utils.getBrowserWindow();
                browser.gBrowser.reload();
            }
        }
    },
    
    saveHost: function(){
        var nameTextBox = this.utils.getElement("definition-name");
        var name = nameTextBox.value;
        name = this.utils.trim(name);
        if (name == "") {
            alert(this.preferences.getSBundle().getString("cH.fillDefinitionName"));
            return;
        }
        var show = this.utils.getElement("show-in-menu").checked;
        var content = this.utils.getElement("content").value;
        
        var id;
        var saved = false;
        var item = this.utils.getElement("definition-list").selectedItem;
        if (item) {
            this.log.debug("Updating definition: " + item.value);
            id = item.value;
            saved = this.updateExistentHost(id, name, show, content);
            item.label = name;
        }
        else {
            this.log.debug("Saving new definition...");
            id = this.saveNewHost(name, show, content);
            item = this.addItemToList(id, name);
            saved = true;
            this.log.debug("Saved: " + item.value);
        }
        if (saved) {
            this.uiEditable(false);
            this.utils.getElement("new-definition-button").disabled = false;
            
            var list = this.utils.getElement("definition-list");
            list.timedSelect(item, 5);
            list.ensureElementIsVisible(item);
            list.disabled = false;
            
            return id;
        }
        else {
            alert(this.preferences.getSBundle().getString("cH.unableToSaveDefinition"));
            return null;
        }
    },
    
    saveNewHost: function(name, show, content){
        var id = this.dao.saveNewHost(name, false, show, content);
        if (id) {
            return id;
        }
        else {
            alert(this.preferences.getSBundle().getString("cH.errorSavingDefinition"));
        }
    },
    
    updateExistentHost: function(id, name, show, content){
        if (this.dao.updateHost(id, name, show, content)) {
            return true;
        }
        else {
            alert(this.preferences.getSBundle().getString("cH.errorUpdatingDefinition"));
        }
    },
    
    del: function(){
        var list = this.utils.getElement("definition-list");
        var item = list.getItemAtIndex(list.selectedIndex);
        if (this.utils.getElement("definition-in-use").checked) {
            if (!confirm(this.preferences.getSBundle().getString("cH.confirmInUseRemoving"))) {
                return;
            }
        }
        
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        if (item && this.dao.deleteHost(item.value)) {
            list.removeItemAt(list.selectedIndex);
            item = list.getItemAtIndex(0);
            if (item) {
                list.selectItem(item);
            }
            this.uiClean();
            
            //Setup UI
            this.uiManager.setupUI();
        }
        else {
            alert(this.preferences.getSBundle().getString("cH.errorRemovingDefinition"));
        }
    },
    
    selected: function(item){
        if (!item) {
            return;
        }
        var host = this.dao.findHost(this.utils.trim(item.value));
        
        if (host) {
            this.utils.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.edit");
            
            this.utils.getElement("content").value = host.content;
            this.utils.getElement("show-in-menu").checked = host.show;
            this.utils.getElement("definition-name").value = host.name;
            this.utils.getElement("definition-in-use").checked = host.selected;
            this.utils.getElement("delete-definition-button").disabled = false;
            this.utils.getElement("edit-definition-button").disabled = false;
        }
        else {
            alert(this.preferences.getSBundle().getString("cH.registerNotFound"));
        }
    },
    
    edit: function(){
        this.utils.getElement("definition-list").disabled = true;
        
        this.utils.getElement("new-definition-button").disabled = true;
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        this.uiEditable(true);
    },
    
    cancel: function(){
        this.uiEditable(false);
        this.uiClean();
        this.utils.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.selectDefinition");
        this.utils.getElement("new-definition-button").disabled = false;
        
        var list = this.utils.getElement("definition-list");
        list.disabled = false;
        list.timedSelect(list.getSelectedItem(), 5);
    },
    
    uiClean: function(){
        this.utils.getElement("definition-name").value = "";
        this.utils.getElement("definition-in-use").checked = false;
        this.utils.getElement("content").value = "";
        this.utils.getElement("show-in-menu").checked = false;
    },
    
    uiEditable: function(bool){
        this.utils.getElement("definition-name").disabled = !bool;
        this.utils.getElement("definition-name-label").disabled = !bool;
        this.utils.getElement("content").disabled = !bool;
        this.utils.getElement("show-in-menu").disabled = !bool;
        this.utils.getElement("save-definition-button").disabled = !bool;
        this.utils.getElement("save-and-use-definition-button").disabled = !bool;
        this.utils.getElement("cancel-definition-button").disabled = !bool;
    }
};
//Construct
CHDefinitions.init();
