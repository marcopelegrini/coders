/**
 * Class to manage the UI behavior
 *
 * @author marcotulio
 */
(function(){

	Components.utils.import("chrome://changeHosts/content/js/ctech/logUtils.jsm");
	Components.utils.import("resource://gre/modules/Log.jsm");

    coders.ns("coders.changeHosts").uiManager = {

        ctx: coders.changeHosts.applicationContext,
		logger: Log.repository.getLogger("coders.changeHosts.uiManager"),

        setContext: function(applicationContext){
            this.ctx = applicationContext;
        },

        getHostDirTree: function(){
            return this.ctx.browserUtils.getElement("definitions-tree");
        },

        getHostList: function(){
            return this.ctx.browserUtils.getElement("hosts-list");
        },

        getRegexList: function(){
            return this.ctx.browserUtils.getElement("regex-color-list");
        },

        cleanTree: function(tree){
            while(tree.hasChildNodes() && tree.childNodes[1] != null) {
                tree.removeChild(tree.childNodes[1]);
            }
        },

        cleanHostList: function(hostList){
            var count = hostList.getRowCount();
            for( var i = 0; i < count; i++){
                hostList.removeItemAt(0);
            }
        },

        setHostEditionMode: function(enabled){
            var content = this.ctx.browserUtils.getElement("content");
            content.setAttribute("editMode", enabled);
            this.ctx.browserUtils.getElement("cancel-definition-button").disabled = !enabled;
            this.ctx.browserUtils.getElement("save-definition-button").disabled = !enabled;
            this.ctx.browserUtils.getElement("save-and-use-definition-button").disabled = !enabled;
            this.ctx.browserUtils.getElement("choose-definition-button").disabled = enabled;
            this.ctx.browserUtils.getElement("view-parsed-hosts").disabled = enabled;
        },

        setSelectable: function(enabled){
            this.ctx.browserUtils.getElement("content").disabled = !enabled;
            this.ctx.browserUtils.getElement("choose-definition-button").disabled = !enabled;
        },

        setCurrentHost: function(path){
			var statusLabel = this.getHostNameLabelFromPath(path);
			this.setStatusDefinitionName(statusLabel);
            this.setCurrentColor();
			this.ctx.browserUtils.getElement('current-host').value = statusLabel;
        },

        setupUI: function(document){
            var current = this.ctx.preferenceUtils.getString('current-host');
			var statusLabel = this.getHostNameLabelFromPath(current);
			this.setStatusDefinitionName(statusLabel);
            this.setCurrentColor();
        },

		setStatusDefinitionName: function(label){
			var browserWindow = this.ctx.browserUtils.getBrowserWindow().document;
			this.ctx.browserUtils.getElement("change_hosts_status_definition_name", browserWindow).value = label;
		},

		getHostNameLabelFromPath: function(path){
			if (path && path != ''){
				var fileSeparator = this.ctx.fileUtils.getFileSeparator();
				var ext = this.ctx.preferenceUtils.getString('default-host-file-extension');
				var root = this.ctx.preferenceUtils.getString('definitions-root-dir');
				if(!this.ctx.browserUtils.endsWith(root, fileSeparator)){
					root = root + fileSeparator;
				}
				return path.replace(root, '').replace(ext,'')
			}else{
				return 'No host selected';
			}
		},

		setCurrentColor: function(){
			this.logger.debug("Setting hosts color...");
			var browserWindow = this.ctx.browserUtils.getBrowserWindow();
			var color = this.ctx.hostsManager.findHostsColor();
			this.ctx.browserUtils.getElement("change_hosts_status_definition_name", browserWindow.document).setAttribute("style", "color:" + color + ";");
		},

        cleanHostsItens: function(menu){
            var itens = menu.getElementsByClassName('host-item');
            while (itens.length > 0) {
                menu.removeChild(itens[0]);
            }
        }
    }
})();
