/**
 * Options overlay functions - General Tab
 *
 * @author marcotulio
 */
if (!coders)
	var coders = {};
if (!coders.changeHosts)
	coders.changeHosts = {};
if (!coders.changeHosts.options)
	coders.changeHosts.options = {};

(function() {
	coders.changeHosts.options.general = {

		ctx: coders.changeHosts.applicationContext,
		optionsDefinitions: coders.changeHosts.options.definitions,
		hostMap: {},
		hostFileNamePattern: null,
		hostCount: 0,
		hostDirToSelect: null,
		hostNameToSelect: null,

		onLoad: function() {
			if (this.ctx.dnsFlusher.integrated()) {
				this.ctx.browserUtils.getElement("dnsFlusherIntegrationDisclaimerMiss").setAttribute("style", "display:none");
				this.ctx.browserUtils.getElement("dnsFlusherIntegrationDisclaimerFound").setAttribute("style", "display:block");
				this.ctx.browserUtils.getElement("flushDNSOnChangeCheckbox").disabled = false;
			}

			var openDialog = this.ctx.preferenceUtils.getBool("open-migration-dialog");
			if (openDialog) {
				this.handleMigration();
			}

			this.buildRegexList();
		},

		onUnload: function() {

		},


		handleMigration: function() {
			var params = {
				inn: null,
				out: null
			};
			window.openDialog("chrome://changeHosts/content/migrationDialog.xul", "showmore", "chrome, dialog, modal, centerscreen", params).focus();

			var out = params.out;
			if (out) {
				if(out.filePath){
					// Set hosts location value on general tab
					var textbox = this.ctx.browserUtils.getElement("definitions-root-dir");
					textbox.value = out.filePath;
					this.ctx.browserUtils.getElement('prefpane_general').userChangedValue(textbox);
					this.rootDirSelected();
				}
				if (out.migrate) {
					if (out.later) {
						// Just return. Window will open later.
						return;
					} else {
						// Run migration process
						this.copyDefinitionsFromDatabaseToFiles();
						this.reloadTree();
						// Sucess message
						var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.migrationComplete");
						alert(msg);
					
						// Activate hosts tab
						var prefWindow = this.ctx.browserUtils.getElement("changeHosts-settings");
						var prefPane = this.ctx.browserUtils.getElement("prefpane_definitions");
						prefWindow.showPane(prefPane);

						this.ctx.preferenceUtils.clear("open-migration-dialog");
					}
				}else{
					this.ctx.preferenceUtils.clear("open-migration-dialog");
				}
			}
		},

		copyDefinitionsFromDatabaseToFiles: function(){
			var definitions = this.ctx.dao.listDefinitions();
			var hostsLocationPath = this.ctx.browserUtils.getElement("definitions-root-dir").value;
			var fileSeparator = this.ctx.fileUtils.getFileSeparator();
			var extension = this.ctx.preferenceUtils.getString('default-host-file-extension');
			if(!this.ctx.browserUtils.endsWith(hostsLocationPath, fileSeparator)){
				hostsLocationPath = hostsLocationPath + fileSeparator;
			}

			for (var i = 0; i < definitions.length; i++){
				var definition = definitions[i];
				var filePath = hostsLocationPath + fileSeparator + definition.name + extension;
				this.ctx.logUtils.info("Migrating file: " + filePath);
				var file = this.ctx.fileUtils.getFile(filePath);
				if (file && file.exists()){
					var msg = this.ctx.preferenceUtils.getSBundle().getFormattedString("cH.replaceContent", [filePath]);
					var replaceContent = confirm(msg);
					this.ctx.fileUtils.saveFile(file, definition.content);
				}else{
					this.ctx.fileUtils.save(filePath, definition.content);
				}
			}
		},

		rootDirSelected: function() {
			this.checkDefinitionsRootDirPermission();
			this.reloadTree();
		},

		pickHostFile: function() {
			var fp = this.ctx.fileUtils.getFilePicker();
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			fp.appendFilters(nsIFilePicker.filterAll);

			fp.init(window, this.ctx.preferenceUtils.getSBundle().getString("cH.pickHostFile"), nsIFilePicker.modeOpen);
			var value = fp.show();
			if (value == nsIFilePicker.returnOK) {
				var textbox = this.ctx.browserUtils.getElement("hosts-location");
				textbox.value = fp.file.path;
				this.ctx.browserUtils.getElement('prefpane_general').userChangedValue(textbox);
				this.checkHostPermission();
			}
		},

		pickDefinitionsRootDir: function() {
			var fp = this.ctx.fileUtils.getFilePicker();
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			fp.appendFilters(nsIFilePicker.filterAll);

			fp.init(window, this.ctx.preferenceUtils.getSBundle().getString("cH.pickRootFolder"), nsIFilePicker.modeGetFolder);
			var value = fp.show();
			if (value == nsIFilePicker.returnOK) {
				var textbox = this.ctx.browserUtils.getElement("definitions-root-dir");
				textbox.value = fp.file.path;
				this.ctx.browserUtils.getElement('prefpane_general').userChangedValue(textbox);
				this.rootDirSelected();
			}
		},

		pickScript: function() {
			var fp = this.ctx.fileUtils.getFilePicker();
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			fp.appendFilters(nsIFilePicker.filterAll);

			fp.init(window, this.ctx.preferenceUtils.getSBundle().getString("cH.pickScriptFile"), nsIFilePicker.modeOpen);
			var value = fp.show();
			if (value == nsIFilePicker.returnOK) {
				var textbox = this.ctx.browserUtils.getElement("script-location");
				textbox.value = fp.file.path;
				this.ctx.browserUtils.getElement('prefpane_general').userChangedValue(textbox);
				this.checkScriptPermission();
			}
		},

		checkPermissions: function() {
			this.checkHostPermission();
			this.checkScriptPermission();
			this.checkDefinitionsRootDirPermission();
		},

		checkScriptPermission: function() {
			var filePath = this.ctx.browserUtils.getElement("script-location").value;
			var file = this.ctx.fileUtils.getFile(filePath);
			if (file && file.exists() && !this.ctx.browserUtils.isMacOS()) {
				if (file.isFile()) {
					this.setPermissionResult("testRunFile", file.isExecutable());
				} else {
					this.setPermissionResult("testRunFile", false);
				}
			} else {
				this.setPermissionResult("testRunFile", null);
			}
		},

		checkHostPermission: function() {
			var filePath = this.getHostsLocationPath();
			var file = this.ctx.fileUtils.getFile(filePath);
			if (file && file.exists() && file.isFile()) {
				this.setPermissionResult("testReadFile", file.isReadable());
				this.setPermissionResult("testWriteFile", file.isWritable());
			} else {
				this.ctx.logUtils.debug("File " + filePath + " is not a file, testing if directoy is writable...")
				var io = filePath.lastIndexOf(this.ctx.fileUtils.getFileSeparator());
				var dirPath = filePath.substring(0, io + 1);
				this.ctx.logUtils.debug("Testing directory: " + dirPath);
				var dir = this.ctx.fileUtils.getFile(dirPath);
				if (dir && dir.exists() && dir.isDirectory) {
					this.setPermissionResult("testReadFile", dir.isReadable());
					this.setPermissionResult("testWriteFile", dir.isWritable());
				} else {
					this.setPermissionResult("testReadFile", false);
					this.setPermissionResult("testWriteFile", false);
				}
			}
		},

		checkDefinitionsRootDirPermission: function() {
			var filePath = this.ctx.browserUtils.getElement("definitions-root-dir").value;
			var file = this.ctx.fileUtils.getFile(filePath);
			if (file && file.exists() && file.isDirectory()) {
				this.setPermissionResult("testRootDir", file.isReadable());
			} else {
				this.setPermissionResult("testRootDir", false);
			}
		},

		setPermissionResult: function(elementId, result) {
			var element = this.ctx.browserUtils.getElement(elementId);
			if (result != null && result != undefined) {
				if (result) {
					element.setAttribute("class", "testImgOK");
				} else {
					element.setAttribute("class", "testImgFail");
				}
			} else {
				element.setAttribute("class", "testImgQuestion");
			}

		},

		executeScript: function() {
			var filePath = this.ctx.browserUtils.getElement("script-location").value;

			if (filePath.trim() == "") {
				alert(this.ctx.preferenceUtils.getSBundle().getString("cH.youShouldSelectAScriptToExecute"));
				return;
			}
			try {
				this.ctx.fileUtils.execute(filePath);
			} catch (ex) {
				this.ctx.logUtils.error("Error running file: " + filePath + " Stack: " + ex);
				alert(this.ctx.preferenceUtils.getSBundle().getString("cH.errorRunningFile") + ex);
			}
		},

		getHostsLocationPath: function() {
			return this.ctx.browserUtils.getElement('hosts-location').value;
		},

		defaultColorChanged: function() {
			this.ctx.uiManager.setCurrentColor();
			this.reloadTree();
		},

		showHideViewElements: function(element, show) {
			var browserWindow = this.ctx.browserUtils.getBrowserWindow();
			this.ctx.browserUtils.getElement(element, browserWindow.document).hidden = !show;
		},

		scriptPermissionToggleCheck: function() {
			this.scriptPermissionToggle(this.ctx.browserUtils.getElement("script-flag").checked);
		},

		scriptPermissionToggle: function(value) {
			this.ctx.browserUtils.getElement("script-location").disabled = !value;
			this.ctx.browserUtils.getElement("execute-script-button").disabled = !value;
			this.ctx.browserUtils.getElement("find-script-button").disabled = !value;
		},

		buildRegexList: function() {
			this.ctx.logUtils.info("Building regex list...");
			var regexList = this.ctx.uiManager.getRegexList();
			this.ctx.uiManager.cleanHostList(regexList);

			var regexConfigs = this.ctx.dao.findAllRegexConfig();

			for (var i = 0; i < regexConfigs.length; i++) {
				var regexConfig = regexConfigs[i];

				var regex = regexConfig.regex;
				var color = regexConfig.color;

				var row = this.ctx.browserUtils.createElement('listitem');
				row.setAttribute('value', regex);
				row.setAttribute('color', color);

				var regexCell = this.ctx.browserUtils.createElement('listcell');
				regexCell.setAttribute('label', regex);
				row.appendChild(regexCell);

				var colorCell = this.ctx.browserUtils.createElement('listcell');
				colorCell.setAttribute('label', '\u25A0');
				colorCell.setAttribute('value', color);
				colorCell.setAttribute('class', 'color');
				colorCell.setAttribute('style', 'color: ' + color);
				row.appendChild(colorCell);

				regexList.appendChild(row);
			}

			this.ctx.browserUtils.getElement("edit-regex-button").setAttribute("disabled", "true");
			this.ctx.browserUtils.getElement("remove-regex-button").setAttribute("disabled", "true");
		},

		addRegex: function() {
			var defaultColor = this.ctx.preferenceUtils.getString("definition-color");
			var regexList = this.ctx.uiManager.getRegexList();
			var existingRegex = new Array();
			var count = regexList.getRowCount();
			for (var i = 0; i < count; i++) {
				existingRegex.push(regexList.getItemAtIndex(i).value);
			}

			var params = {
				inn: {
					color: defaultColor,
					existingRegex: existingRegex
				},
				out: null
			};
			window.openDialog("chrome://changeHosts/content/regexDialog.xul", "showmore", "chrome, dialog, modal, centerscreen", params).focus();

			var out = params.out;
			if (out) {
				var regex = out.regex;
				var color = out.color;

				this.ctx.dao.saveOrUpdateRegexConfig(regex, color);
				this.buildRegexList();

				this.ctx.uiManager.setCurrentColor();
				this.reloadTree();
			}
		},

		editRegex: function() {
			var regexList = this.ctx.uiManager.getRegexList();
			var regexToEdit = regexList.selectedItem.value;
			var regexColor = regexList.selectedItem.getAttribute('color');

			var params = {
				inn: {
					regex: regexToEdit,
					color: regexColor
				},
				out: null
			};
			window.openDialog("chrome://changeHosts/content/regexDialog.xul", "showmore", "chrome, dialog, modal, centerscreen", params).focus();

			var out = params.out;
			if (out) {
				var regex = out.regex;
				var color = out.color;

				this.ctx.dao.saveOrUpdateRegexConfig(regex, color);
				this.buildRegexList();

				this.ctx.uiManager.setCurrentColor();
				this.reloadTree();
			}
		},

		removeRegex: function() {
			var regexList = this.ctx.uiManager.getRegexList();
			var regexToRemove = regexList.selectedItem.value;

			var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.removeRegex");

			var remove = confirm(msg);
			if (remove) {
				this.ctx.dao.removeRegexConfig(regexToRemove);
				this.buildRegexList();

				this.ctx.uiManager.setCurrentColor();
				this.reloadTree();
			}
		},

		reloadTree: function(){
			var tree = this.ctx.uiManager.getHostDirTree();
			this.optionsDefinitions.reloadTree(tree);
			this.optionsDefinitions.setTreeSelection(tree);
		},

		handleRegexListClick: function(listbox) {
			this.ctx.browserUtils.getElement("edit-regex-button").removeAttribute("disabled");
			this.ctx.browserUtils.getElement("remove-regex-button").removeAttribute("disabled");
		}
	};

	window.addEventListener("load", function() {
		try {
			coders.changeHosts.options.general.onLoad();
		} catch (e) {
			Application.console.log("Error loading general options: " + e);
		}
	}, false);
})();