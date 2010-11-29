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
            this.checkPermission();
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
        }
    },
    
    checkPermission: function(){
        this.checkFilePermission();
    },
    
    checkFilePermission: function(){
        var filePath = document.getElementById("hosts-location").value;
        
        if (this.utils.trim(filePath) == "") {
            alert("#Você deve selecionar um arquivo hosts.");
            return;
        }
        
        var file = this.fileUtils.getFile(filePath);
        if (file.exists()) {
            // Class names
            const imgOK = "testImgOK";
            const imgFail = "testImgFail";
            // Check read
            var readImg = document.getElementById("testReadFile");
            if (file.isReadable()) {
                readImg.setAttribute("class", imgOK);
            }
            else {
                readImg.setAttribute("class", imgFail);
            }
            // Check write
            var writeImg = document.getElementById("testWriteFile");
            if (file.isWritable()) {
                writeImg.setAttribute("class", imgOK);
            }
            else {
                writeImg.setAttribute("class", imgFail);
            }
            // Check execution
            if (document.getElementById("script-flag").checked) {
                filePath = document.getElementById("script-location").value;
                if (this.utils.trim(filePath) == "") {
                    alert("#Você deve selecionar um script para ser executado.");
                    return;
                }
                file = this.fileUtils.getFile(filePath);
                
                var execImg = document.getElementById("testRunFile");
                if (file.exists()) {
                    if (!this.utils.isMacOS()) {
                        if (file.isExecutable()) {
                            execImg.setAttribute("class", imgOK);
                        }
                        else {
                            execImg.setAttribute("class", imgFail);
                        }
                    }
                }
                else {
                    alert("#Você deve selecionar um script para ser executado.");
                }
            }
        }
        else {
            alert("#Arquivo não encontrado.")
        }
    },
    
    executeScript: function(){
        var executeScript = document.getElementById("script-flag").checked;
        
        if (executeScript) {
            var filePath = document.getElementById("script-location").value;
            
            if (this.utils.trim(filePath) == "") {
                alert("#Você deve selecionar um script ou programa para ser executado.");
                return;
            }
            this.fileUtils.execute(filePath);
        }
        else {
            alert("#A opção de executar o script precisa estar marcada !");
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
    }
};
// Construct
CHOptions.init();
