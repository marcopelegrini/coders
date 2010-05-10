/**
 * @author marcotulio
 */
var CHOptions = {

    init: function(){
        this.preferences = new CTechPrefs(CHConstants.branchName, CHConstants.windowType, CHConstants.windowURI, CHConstants.windowOptions);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.fileUtils = new CTechFileUtils();
    },
    
    pickHostFile: function(){
        //var hostsDir = this.fileUtils.getFile("c:\\windows\\system32\\drivers\\etc\\");
        
        var fp = this.fileUtils.getFilePicker();
        //fp.displayDirectory = hostsDir;
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
        //var hostsDir = this.fileUtils.getFile("c:\\windows\\system32\\drivers\\etc\\");
        
        var fp = this.fileUtils.getFilePicker();
        //fp.displayDirectory = hostsDir;
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
            var file = this.fileUtils.getFile(filePath);
            if (file.exists()) {
                var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
                process.init(file);
                // Run the process.
                // If first param is true, calling thread will be blocked until called process terminates.
                // Second and third params are used to pass command-line arguments to the process.
                process.run(true, null, 0);
            }
            else {
                alert("#O arquivo não existe !");
            }
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
        textbox.value = this.getDefaultHostPath();
        document.getElementById('prefpane_general').userChangedValue(textbox);
    },
    
    getDefaultHostPath: function(){
        var so = this.utils.getOperationSystem();
        this.log.debug("Running on system: " + so);
        switch (so) {
            case "Darwin":
                return "/etc/hosts";
                break;
            default:
                return "c:\\windows\\system32\\drivers\\etc\\hosts";
        }
    },
    
    colorChanged: function(){
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
        var browserWindow = wm.getMostRecentWindow("navigator:browser");
        
        var color = this.utils.getElement("ip-color-picker").color;
        this.utils.getElement("dnsflusher-label", browserWindow.document).setAttribute("style", "color:" + color + ";");
		
        color = this.utils.getElement("definition-color-picker").color;
        this.utils.getElement("definition-name", browserWindow.document).setAttribute("style", "color:" + color + ";");
    }
};
// Construct
CHOptions.init();
