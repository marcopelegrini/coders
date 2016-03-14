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

        setupUI: function(document){
            var definitionStatus = this.ctx.browserUtils.getElement("change_hosts_status_definition_name");
            var current = this.ctx.preferenceUtils.getString('current-host');
            if (current){
                var root = this.ctx.preferenceUtils.getString('definitions-root-dir');
                current = current.replace(root, '');
                definitionStatus.value = current;
            }
            this.setCurrentColor();
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
            var fileSeparator = this.ctx.fileUtils.getFileSeparator();
            var ext = this.ctx.preferenceUtils.getString('default-host-file-extension');

            var internalLabel;
            var statusLabel;
            if (!path || path == ''){
                statusLabel = 'No host selected';
                internalLabel = statusLabel + ' (Blank or manually defined)';
            }else{
                var root = this.ctx.preferenceUtils.getString('definitions-root-dir');
                if(!this.ctx.browserUtils.endsWith(root, fileSeparator)){
                    root = root + fileSeparator;
                }
                internalLabel = path.replace(root, '');
                internalLabel = internalLabel.replace(ext,'');
                statusLabel = internalLabel;
            }
            this.ctx.browserUtils.getElement('current-host').value = internalLabel;
            this.ctx.browserUtils.getElement("change_hosts_status_definition_name", this.ctx.browserUtils.getBrowserWindow().document)
            .value = statusLabel;
            this.setCurrentColor();
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
