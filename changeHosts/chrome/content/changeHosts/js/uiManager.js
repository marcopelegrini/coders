
/**
 * Class to manage the UI behavior
 *
 * @param {Object} preferences
 * @param {Object} utils
 * @param {Object} dao
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.changeHosts) 
    com.coders.changeHosts = {};

(function(){
    com.coders.changeHosts.uiManager = function(preferences, dao){
    
        this.utils = com.coders.utils.util;
        
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
                    this.utils.getElement("CH_status_definition_name", aDocument).value = host.name;
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
				com.coders.changeHosts.main.selectHost(this.getAttribute('value'));
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
