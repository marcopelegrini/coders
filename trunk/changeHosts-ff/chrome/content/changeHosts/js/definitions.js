/**
 * Class to manage host definitions
 *
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

(function(){

    coders.changeHosts.definitions = {
    
        ch: coders.changeHosts,
        utils: coders.utils,
        
        init: function(){
            this.preferences = new this.utils.prefs(this.ch.constants.branchName, this.ch.constants.windowType, this.ch.constants.windowURI, this.ch.constants.windowOptions);
            this.log = new this.utils.log(this.preferences);
            this.dao = new this.ch.dao(this.preferences);
            this.manager = new this.ch.manager(this.log, this.dao, this.preferences);
            this.uiManager = new this.ch.uiManager(this.preferences, this.dao);
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
            var list = this.utils.util.getElement("definition-list");
            return list.appendItem(name, id);
        },
        
        add: function(){
            this.uiEditable(true);
            this.uiClean();
            
            this.utils.util.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.new");
            
            this.utils.util.getElement("new-definition-button").disabled = true;
            this.utils.util.getElement("delete-definition-button").disabled = true;
            this.utils.util.getElement("edit-definition-button").disabled = true;
            this.utils.util.getElement("up-button").disabled = true;
            this.utils.util.getElement("down-button").disabled = true;               
            
            this.utils.util.getElement("show-in-menu").checked = true;
            
            this.utils.util.getElement("definition-list").clearSelection();
            this.utils.util.getElement("definition-list").disabled = true;
        },
        
        save: function(){
            if (this.saveHost()) {
                this.uiManager.setupUI();
            }
        },
        
        use: function(id){
        	if (!id){
        		var item = this.utils.util.getElement("definition-list").selectedItem;
                if (item) {
                    var id = item.value;
                }
        	}
        	if (id) {
                try {
                    this.manager.select(id);
                    this.uiManager.setupUI();
                } 
                catch (ex) {
                    alert(this.preferences.getSBundle().getString("cH.unableToSaveDefinition") + " " + ex);
                }
                if (this.preferences.getBool("reload-on-change")) {
                    var browser = this.utils.util.getBrowserWindow();
                    browser.gBrowser.reload();
                }
                if(this.preferences.getBool("close-after-choose")){
                	return true;
                }
            }
        	return false;
        },
        
        saveAndUse: function(){
            try {
                var id = this.saveHost();
            } 
            catch (ex) {
                alert(this.preferences.getSBundle().getString("cH.unableToSaveDefinition") + " " + ex);
            }
            this.use(id);
        },
        
        saveHost: function(){
            var nameTextBox = this.utils.util.getElement("definition-name");
            var name = nameTextBox.value;
            name = this.utils.util.trim(name);
            if (name == "") {
                alert(this.preferences.getSBundle().getString("cH.fillDefinitionName"));
                return;
            }
            var show = this.utils.util.getElement("show-in-menu").checked;
            var content = this.utils.util.getElement("content").value;
            
            var specificColor = this.utils.util.getElement("color-by-definition").checked;
            var color = null;
            if (specificColor){
            	color = this.utils.util.getElement("by-definition-color-picker").color;
            }
            
            var id;
            var saved = false;
            var item = this.utils.util.getElement("definition-list").selectedItem;
            if (item) {
                this.log.debug("Updating definition: " + item.value);
                id = item.value;
                saved = this.updateExistentHost(id, name, show, content, color);
                item.label = name;
            }
            else {
                this.log.debug("Saving new definition...");
                id = this.saveNewHost(name, show, content, color);
                item = this.addItemToList(id, name);
                saved = true;
                this.log.debug("Saved: " + item.value);
            }
            if (saved) {
                this.uiEditable(false);
                this.utils.util.getElement("new-definition-button").disabled = false;
                
                var list = this.utils.util.getElement("definition-list");
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
        
        saveNewHost: function(name, show, content, color){
            var id = this.dao.saveNewHost(name, false, show, content, color);
            if (id) {
                return id;
            }
            else {
                alert(this.preferences.getSBundle().getString("cH.errorSavingDefinition"));
            }
        },
        
        updateExistentHost: function(id, name, show, content, color){
            if (this.dao.updateHost(id, name, show, content, color)) {
                return true;
            }
            else {
                alert(this.preferences.getSBundle().getString("cH.errorUpdatingDefinition"));
            }
        },
        
        del: function(){
            var list = this.utils.util.getElement("definition-list");
            var item = list.getItemAtIndex(list.selectedIndex);
            if (this.utils.util.getElement("definition-in-use").checked) {
                if (!confirm(this.preferences.getSBundle().getString("cH.confirmInUseRemoving"))) {
                    return;
                }
            }
            
            this.utils.util.getElement("delete-definition-button").disabled = true;
            this.utils.util.getElement("edit-definition-button").disabled = true;
            this.utils.util.getElement("up-button").disabled = true;
            this.utils.util.getElement("down-button").disabled = true;               
            
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
        
        eraseAll: function(){
            this.dao.deleteAllHosts();
            //Setup UI
            this.uiManager.setupUI();
        },
        
        selected: function(item){
            if (!item) {
                return;
            }
            var host = this.dao.findHost(this.utils.util.trim(item.value));
            
            if (host) {
                this.utils.util.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.edit");
                
                this.utils.util.getElement("content").value = host.content;
                this.utils.util.getElement("show-in-menu").checked = host.show;
                this.utils.util.getElement("definition-name").value = host.name;
                this.utils.util.getElement("definition-in-use").checked = host.selected;
                this.utils.util.getElement("delete-definition-button").disabled = false;
                this.utils.util.getElement("edit-definition-button").disabled = false;
                this.utils.util.getElement("up-button").disabled = false;
                this.utils.util.getElement("down-button").disabled = false;
                this.utils.util.getElement("choose-definition-button").disabled = false;

                var color = null;
                if (host.color != null && host.color != "" ){
                	color = host.color;
                	this.utils.util.getElement("color-by-definition").checked = true;
                }else{
                	this.utils.util.getElement("color-by-definition").checked = false;
                }
                this.utils.util.getElement("by-definition-color-picker").color = color;            
            }
            else {
                alert(this.preferences.getSBundle().getString("cH.registerNotFound"));
            }
        },
        
        edit: function(){
            this.utils.util.getElement("definition-list").disabled = true;
            
            this.utils.util.getElement("new-definition-button").disabled = true;
            this.utils.util.getElement("delete-definition-button").disabled = true;
            this.utils.util.getElement("edit-definition-button").disabled = true;
            this.utils.util.getElement("up-button").disabled = true;
            this.utils.util.getElement("down-button").disabled = true;               
            
            if(this.utils.util.getElement("color-by-definition").checked){
            	this.utils.util.getElement("by-definition-color-picker").disabled = false;
            }
            
            this.uiEditable(true);
        },
        
        up: function(){
            var list = this.utils.util.getElement("definition-list");
            var index = list.selectedIndex;
            if(index>0){
            	try {
		            // Item data
            		var item = list.getItemAtIndex(index);
		            var value = item.value;
		            var label = item.label;
		            // Move Up on database
		            this.dao.orderUp(value);
		            // Move Up on interface
		            list.removeItemAt(index);
		            var newItem = list.insertItemAt(index-1, label, value);
		            list.selectItem(newItem);
		            // Setup UI
		            this.uiManager.setupUI();
            	}catch (e) {
            		this.log.error("Unable to reorder definition" + e);
				}
            }
        },
        
        down : function() {
			var list = this.utils.util.getElement("definition-list");
			var index = list.selectedIndex;
			if (index < list.getRowCount() - 1) {
				try {
					// Item data
					var item = list.getItemAtIndex(index);
					var value = item.value;
					var label = item.label;
		            // Move Down on database
					this.dao.orderDown(value);
		            // Move Down on interface					
					list.removeItemAt(index);
					var newItem = list.insertItemAt(index + 1, label, value);
					list.selectItem(newItem);
		            // Setup UI
		            this.uiManager.setupUI();					
				} catch (e) {
					this.log.error("Unable to reorder definition" + e);
				}
			}
		},
        
        cancel: function(){
            this.uiEditable(false);
            this.uiClean();
            this.utils.util.getElement("definition-label").label = this.preferences.getSBundle().getString("cH.selectDefinition");
            this.utils.util.getElement("new-definition-button").disabled = false;
            
            var list = this.utils.util.getElement("definition-list");
            list.disabled = false;
            list.timedSelect(list.getSelectedItem(), 5);
        },
        
        
        
        toggleSpecificColorPicker: function(bool){
        	this.utils.util.getElement("by-definition-color-picker").disabled = !bool;
        },
        
        uiClean: function(){
            this.utils.util.getElement("definition-name").value = "";
            this.utils.util.getElement("definition-in-use").checked = false;
            this.utils.util.getElement("content").value = "";
            this.utils.util.getElement("show-in-menu").checked = false;
            this.utils.util.getElement("by-definition-color-picker").color = null;
            this.utils.util.getElement("color-by-definition").checked = false;
        },
        
        uiEditable: function(bool){
            this.utils.util.getElement("definition-name").disabled = !bool;
            this.utils.util.getElement("definition-name-label").disabled = !bool;
            this.utils.util.getElement("content").disabled = !bool;
            this.utils.util.getElement("show-in-menu").disabled = !bool;
            this.utils.util.getElement("save-definition-button").disabled = !bool;
            this.utils.util.getElement("save-and-use-definition-button").disabled = !bool;
            this.utils.util.getElement("cancel-definition-button").disabled = !bool;
            this.utils.util.getElement("color-by-definition").disabled = !bool;
        }
    };
    //Construct
    coders.changeHosts.definitions.init();
})();
