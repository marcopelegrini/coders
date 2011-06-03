/**
 * Options overlay functions
 * 
 * @author marcotulio
 */
var CHOptions = {

    init: function(){
        this.preferences = new CTechPrefs(CHConstants.branchName, CHConstants.windowType, CHConstants.windowURI, CHConstants.windowOptions);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.fileUtils = new CTechFileUtils();
        this.manager = new CHManager(this.utils, this.log, this.dao, this.preferences, this.fileUtils);
    },
    
    pickHostFile: function(){
        var fp = this.fileUtils.getFilePicker();
        const nsIFilePicker = Components.interfaces.nsIFilePicker;
        fp.appendFilters(nsIFilePicker.filterAll);
        
        fp.init(window, "#Teste", nsIFilePicker.modeOpen);
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
        
        fp.init(window, "#Teste", nsIFilePicker.modeOpen);
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
		if (this.utils.trim(filePath) == "" && checkValue) {
			return;
		}
		this.checkFilePermission("run", filePath, "testRunFile", "testImgOK", "testImgFail", "testImgQuestion");
    },
	    
    checkFilePermission: function(permission, filePath, elementId, classOk, classFail, classQuestion){
        
        var element = document.getElementById(elementId);
		
        if (this.utils.trim(filePath) == "") {
			element.setAttribute("class", classQuestion);			
            return;
        }
        
        var file = this.fileUtils.getFile(filePath);
        if (file.exists()) {
			var check = false; 
			switch(permission)
			{
				case "read":
				check = file.isReadable();
				break;
				case "write":
				check = file.isWritable();
				break;
				case "run":
				if (!this.utils.isMacOS()) {
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
    },
	
    executeScript: function(){
        var filePath = document.getElementById("script-location").value;
        
        if (this.utils.trim(filePath) == "") {
            alert("#Você deve selecionar um script ou programa para ser executado.");
            return;
        }
        this.fileUtils.execute(filePath);
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
        var browserWindow = this.utils.getBrowserWindow();
        
        var color = this.utils.getElement("ip-color-picker").color;
        this.utils.getElement("CH_status_ip", browserWindow.document).setAttribute("style", "color:" + color + ";");
        
        color = this.utils.getElement("definition-color-picker").color;
        this.utils.getElement("CH_status_definition_name", browserWindow.document).setAttribute("style", "color:" + color + ";");
    },
    
    showHideViewElements: function(element, show){
        var browserWindow = this.utils.getBrowserWindow();
        this.utils.getElement(element, browserWindow.document).hidden = !show;
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
		this.scriptPermissionToggle(this.utils.getElement("script-flag").checked);
	},
	
	scriptPermissionToggle: function(value){
		document.getElementById("script-location").disabled = !value;
		document.getElementById("execute-script-button").disabled = !value;
		document.getElementById("find-script-button").disabled = !value;
	}
};
// Construct
CHOptions.init();
