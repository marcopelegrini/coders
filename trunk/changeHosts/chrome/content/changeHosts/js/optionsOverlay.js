/**
 * @author marcotulio
 */
function CHOptions(utils, fileUtils, logger, preferences){

    this.utils = utils;
    this.logger = logger;
    this.fileUtils = fileUtils;
    this.preferences = preferences;
    
    this.pickHostFile = function(){
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
    }
    
    this.pickScript = function(){
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
    }
    
    this.checkPermission = function(){
        this.checkFilePermission();
    }
    
    this.checkFilePermission = function(){
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
            if (file.isExecutable()) {
                writeImg.setAttribute("class", imgOK);
            }
            else {
                writeImg.setAttribute("class", imgFail);
            }
        }
        else {
            alert("#Arquivo não encontrado.")
        }
    }
    
    this.executeScript = function(){
    
        var executeScript = document.getElementById("script-flag").checked;
        
        if (executeScript) {
            var filePath = document.getElementById("script-location").value;
            
            if (this.utils.trim(filePath) == "") {
                alert("#Você deve selecionar um script ou programa para ser executado.");
                return;
            }
            var file = this.fileUtils.getFile(filePath);
            if (file.exists()) {
                var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess2);
                process.init(file);
                // Run the process.
                // If first param is true, calling thread will be blocked until
                // called process terminates.
                // Second and third params are used to pass command-line arguments
                // to the process.
                var args = ["argument1", "argument2"];
                process.run(false, args, args.length);
                //process.run(true, null, 0);
            }
        }else{
			alert("#A opção de executar o script precisa estar marcada !");
		}
    }
    
    this.getFilePath = function(){
        return document.getElementById('hosts-location').value;
    }
    
    this.read = function(){
        this.logger.info(this.fileUtils.read(this.getFilePath()));
    }
    
    this.save = function(){
        this.fileUtils.save(this.getFilePath(), prompt("text", "input"));
    }
    
    this.reset = function(){
        //Reset firefox managed preferences
        this.preferences.reset();
        //Set SO's defaults
        var so = this.utils.getOperationSystem();
        this.logger.info("Writing defaults for system: " + so);
        var textbox = document.getElementById('hosts-location');
        switch (so) {
            case "Darwin":
                textbox.value = "/etc/hosts";
                break;
            default:
                textbox.value = "c:\\windows\\system32\\drivers\\etc\\hosts";
        }
        document.getElementById('prefpane_general').userChangedValue(textbox);
    }
}
