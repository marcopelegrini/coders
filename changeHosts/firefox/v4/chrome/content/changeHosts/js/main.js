/**
 * Everything starts here. This class controls the configuration (first execution) and main commands fired by user
 */
if (!coders)
	var coders = {};
if (!coders.changeHosts)
	coders.changeHosts = {};

(function() {

	coders.changeHosts.main = {

		ctx: coders.changeHosts.applicationContext,
		currentVersion: 5,

		init: function() {
			this.ctx.logUtils.info("Starting Change Hosts...");
		},

		configure: function() {
			this.ctx.logUtils.info("Configured?: " + this.ctx.preferenceUtils.getBool("configured"));
			if (!this.ctx.preferenceUtils.getBool("configured")) {
				this.ctx.logUtils.info("Change hosts first execution. Configuring...");
				// Set default host
				var defaultHostPath = this.ctx.hostsManager.getDefaultHostPath();
				this.ctx.preferenceUtils.setString(this.ctx.hostLocationPref, defaultHostPath);
				// Create database
				this.ctx.dao.createDB();
				// Configured
				this.ctx.preferenceUtils.setBool("configured", true);
				this.ctx.preferenceUtils.setInt("version", this.currentVersion);

				this.installButton();

				this.ctx.logUtils.info("Change hosts configured.");
			} else {
				this.handleUpgrade();
			}
		},

		handleUpgrade: function() {
			var oldVersion = this.ctx.preferenceUtils.getInt("version");
			if (oldVersion == null) {
				this.ctx.logUtils.info("Upgrading from version 3 to version " + this.currentVersion);

				// Create the new database
				this.ctx.dao.createDB();

				// Set a preference to open a dialog about the migration
				this.ctx.preferenceUtils.setBool("open-migration-dialog", true);
				this.ctx.preferenceUtils.setInt("version", this.currentVersion);
			}else{
				if (oldVersion == 4) {
					this.ctx.logUtils.info("Upgrading from version 4 to version " + this.currentVersion);
					this.ctx.preferenceUtils.setInt(this.ctx.readFilesLimit, 5000);
				}
			}
		},

		dispatchStatusClick: function(anchor, event) {
			if (event.button == undefined || event.button < 2) {
				this.openPreferences();
			}
		},

		openPreferences: function() {
			//Use window mediator to open preferences (needed because add-ons manager window)
			var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
			var topWindow = wm.getMostRecentWindow(this.ctx.optionsWindowName);
			if (topWindow) {
				topWindow.focus();
			} else {
				topWindow = wm.getMostRecentWindow(null);
				topWindow.openDialog(this.ctx.optionsWindowURI, "", this.ctx.optionsWindowConfig);
			}
		},

		setup: function() {
			var showIcon = this.ctx.preferenceUtils.getBool("show-icon-status");
			var showDefinitionName = this.ctx.preferenceUtils.getBool("show-definition-name");

			this.ctx.browserUtils.getElement("change_hosts_status_img").hidden = !showIcon;
			this.ctx.browserUtils.getElement("change_hosts_status_definition_name").hidden = !showDefinitionName;

			if(!this.ctx.dnsFlusher.checkIntegration()){
				var popup = this.ctx.browserUtils.getElement("change_hosts_statepopup");

				var menuitem = document.createElement("menuitem");
				var label = this.ctx.preferenceUtils.getSBundle().getString("cH.missingIP");
				menuitem.setAttribute("label", label);
				menuitem.setAttribute("oncommand", "event.preventDefault(); event.stopPropagation(); coders.changeHosts.main.missingIP();");
				popup.insertBefore(menuitem, popup.firstChild);				
			}
		},

		installButton: function() {
			var toolbar = this.ctx.browserUtils.getElement("nav-bar");
			toolbar.insertItem("change_hosts_toolbar_button");
			toolbar.setAttribute("currentset", toolbar.currentSet);
			document.persist(toolbar.id, "currentset");
		},

		missingIP: function() {
			gBrowser.selectedTab = gBrowser.addTab("http://www.coders.com.br/change-hosts/migrating#where-is-the-ip-address");
		},

		openChangeHosts: function() {
			this.openPreferences();
		}
	};

	window.addEventListener("load", function() {
		//Contruct
		coders.changeHosts.main.init();

		//Configure if its necessary
		coders.changeHosts.main.configure();
		coders.changeHosts.main.setup();

		//SetupUI
		coders.changeHosts.main.ctx.uiManager.setupUI();
	}, false);
})();