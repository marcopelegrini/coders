/**
 * Class to manage the UI behavior
 *
 * @param {Object} preferences
 * @param {Object} utils
 * @param {Object} dao
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

(function(){
    coders.changeHosts.uiManager = function(preferences, dao){
    
        this.utils = coders.utils.util;
        
        this.preferences = preferences;
        this.dao = dao;
        
        this.setupUI = function(document){
            var browserWindow = this.utils.getBrowserWindow();
            var aDocument = browserWindow.document;
            var menu = this.utils.getElement("CH_statepopup", aDocument);
            this.cleanHostsItens(menu);
            
            var firstMenuItem = menu.firstChild;
            var host, item;
            
            var hosts = this.dao.listToShow();
            for (var i = 0; i < hosts.length; i++) {
                host = hosts[i];
                item = this.genRow(host, aDocument);
                menu.insertBefore(item, firstMenuItem);
                if (host.selected) {
                	// IP color
                	var color = this.preferences.getString("label-color");
                	this.utils.getElement("CH_status_ip", aDocument).setAttribute("style", "color:" + color + ";");
                	
                	// Definition
                	var definitionStatus = this.utils.getElement("CH_status_definition_name", aDocument);
                	definitionStatus.value = host.name;
                	// color
                	color = this.preferences.getString("definition-color");
                    if(host.color != null && host.color != ""){
                    	color = host.color;
                    }
                    definitionStatus.setAttribute("style", "color:" + color + ";");
                }
            }
        }
        
        this.genRow = function(host, aDocument){
            var menuitem = aDocument.createElement('menuitem');
            
            menuitem.setAttribute('class', 'host-item');
            menuitem.setAttribute('type', 'checkbox');
            menuitem.setAttribute('label', host.name);
            menuitem.setAttribute('value', host.id);
            menuitem.setAttribute('checked', host.selected);
            menuitem.addEventListener('command', function(){
				coders.changeHosts.main.selectHost(this.getAttribute('value'));
            }, false);
            
            return menuitem;
        }
        
        this.cleanHostsItens = function(menu){
            var itens = menu.getElementsByClassName('host-item');
            while (itens.length > 0) {
                menu.removeChild(itens[0]);
            }
        }
    }
})();
