
/**
 * Options overlay functions
 *
 * @author marcotulio
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.changeHosts) 
    com.coders.changeHosts = {};

(function(){
    com.coders.changeHosts.options = {
		
		ch: com.coders.changeHosts,
		utils: com.coders.utils,
		fileUtils: com.coders.utils.fileUtils,
    
        init: function(){
			this.preferences = new this.utils.prefs(this.ch.constants.branchName, this.ch.constants.windowType, this.ch.constants.windowURI, this.ch.constants.windowOptions);
            this.log = new this.utils.log(this.preferences);
			this.dao = new this.ch.dao(this.preferences);
			this.manager = new this.ch.manager(this.log, this.dao, this.preferences);
        },
        
        pickHostFile: function(){
            var fp = this.fileUtils.getFilePicker();
            const nsIFilePicker = Components.interfaces.nsIFilePicker;
            fp.appendFilters(nsIFilePicker.filterAll);
            
            fp.init(window, this.preferences.getSBundle().getString("cH.pickHostFile"), nsIFilePicker.modeOpen);
            var value = fp.show();
            if (value == nsIFilePicker.returnOK) {
                var textbox = document.getElementById("hosts-location");
                textbox.value = fp.file.path;
                document.getElementById('prefpane_general').userChangedValue(textbox);
                this.checkHostPermission();
            }
        },
        
        pickScript: function(){
            var fp = this.fileUtils.getFilePicker();
            const nsIFilePicker = Components.interfaces.nsIFilePicker;
            fp.appendFilters(nsIFilePicker.filterAll);
            
            fp.init(window, this.preferences.getSBundle().getString("cH.pickScriptFile"), nsIFilePicker.modeOpen);
            var value = fp.show();
            if (value == nsIFilePicker.returnOK) {
                var textbox = document.getElementById("script-location");
                textbox.value = fp.file.path;
                document.getElementById('prefpane_general').userChangedValue(textbox);
                this.checkScriptPermission();
            }
        },
        
        checkPermissions: function(){
            this.checkHostPermission();
            this.checkScriptPermission(true);
        },
        
        checkHostPermission: function(){
            var filePath = document.getElementById("hosts-location").value;
            this.checkFilePermission("read", filePath, "testReadFile", "testImgOK", "testImgFail", "testImgQuestion");
            this.checkFilePermission("write", filePath, "testWriteFile", "testImgOK", "testImgFail", "testImgQuestion");
        },
        
        checkScriptPermission: function(checkValue){
            var filePath = document.getElementById("script-location").value;
            if (this.utils.util.trim(filePath) == "" && checkValue) {
                return;
            }
            this.checkFilePermission("run", filePath, "testRunFile", "testImgOK", "testImgFail", "testImgQuestion");
        },
        
        checkFilePermission: function(permission, filePath, elementId, classOk, classFail, classQuestion){
        
            var element = document.getElementById(elementId);
            
            if (this.utils.util.trim(filePath) == "") {
                element.setAttribute("class", classQuestion);
                return;
            }
            
            var file = this.fileUtils.getFile(filePath);
            if (file && file.exists()) {
                if (file.isFile()) {
                    var check = false;
                    switch (permission) {
                        case "read":
                            check = file.isReadable();
                            break;
                        case "write":
                            check = file.isWritable();
                            break;
                        case "run":
                            if (!this.utils.util.isMacOS()) {
                                check = file.isExecutable();
                            }
                            break;
                    }
                    if (check) {
                        element.setAttribute("class", classOk);
                    }
                    else {
                        element.setAttribute("class", classFail);
                    }
                }
                else {
                    element.setAttribute("class", classFail);
                }
            }
            else {
                this.log.debug("File " + filePath + " is not a file, testing if directoy is writable...")
                var io = filePath.lastIndexOf(this.fileUtils.getFileSeparator());
                var dirPath = filePath.substring(0, io + 1);
                this.log.debug("Testing directory: " + dirPath);
                file = this.fileUtils.getFile(dirPath);
                if (file && file.exists()) {
                    var check = false;
                    switch (permission) {
                        case "read":
                            check = file.isReadable();
                            break;
                        case "write":
                            check = file.isWritable();
                            break;
                    }
                    if (check) {
                        element.setAttribute("class", classOk);
                    }
                    else {
                        element.setAttribute("class", classFail);
                    }
                    return;
                }
                element.setAttribute("class", classFail);
            }
        },
        
        executeScript: function(){
            var filePath = document.getElementById("script-location").value;
            
            if (this.utils.util.trim(filePath) == "") {
                alert(this.preferences.getSBundle().getString("cH.youShouldSelectAScriptToExecute"));
                return;
            }
            try {
                this.fileUtils.execute(filePath);
            } 
            catch (ex) {
                this.log.error("Error running file: " + filePath + " Stack: " + ex);
                alert(this.preferences.getSBundle().getString("cH.errorRunningFile") + ex);
            }
        },
        
        getFilePath: function(){
            return document.getElementById('hosts-location').value;
        },
        
        reset: function(){
            //Reset firefox managed preferences
            this.preferences.reset();
            var textbox = document.getElementById('hosts-location');
            textbox.value = this.manager.getDefaultHostPath();
            document.getElementById('prefpane_general').userChangedValue(textbox);
        },
        
        colorChanged: function(){
            var browserWindow = this.utils.util.getBrowserWindow();
            
            var color = this.utils.util.getElement("ip-color-picker").color;
            this.utils.util.getElement("CH_status_ip", browserWindow.document).setAttribute("style", "color:" + color + ";");
            
            color = this.utils.util.getElement("definition-color-picker").color;
            this.utils.util.getElement("CH_status_definition_name", browserWindow.document).setAttribute("style", "color:" + color + ";");
        },
        
        showHideViewElements: function(element, show){
            var browserWindow = this.utils.util.getBrowserWindow();
            this.utils.util.getElement(element, browserWindow.document).hidden = !show;
        },
        
        simulateTab: function(event){
            // Insert real tab (9) on textbox
            if (event.keyCode == 9) {
                event.preventDefault();
                event.stopPropagation();
                var aText = text = "\t";
                var element = event.originalTarget;
                
                var command = "cmd_insertText";
                var controller = element.controllers.getControllerForCommand(command);
                if (controller && controller.isCommandEnabled(command)) {
                    controller = controller.QueryInterface(Components.interfaces.nsICommandController);
                    var params = Components.classes["@mozilla.org/embedcomp/command-params;1"];
                    params = params.createInstance(Components.interfaces.nsICommandParams);
                    params.setStringValue("state_data", aText);
                    controller.doCommandWithParams(command, params);
                }
            }
        },
        
        scriptPermissionToggleCheck: function(){
            this.scriptPermissionToggle(this.utils.util.getElement("script-flag").checked);
        },
        
        scriptPermissionToggle: function(value){
            document.getElementById("script-location").disabled = !value;
            document.getElementById("execute-script-button").disabled = !value;
            document.getElementById("find-script-button").disabled = !value;
        }
    };
    // Construct
    com.coders.changeHosts.options.init();
})();
