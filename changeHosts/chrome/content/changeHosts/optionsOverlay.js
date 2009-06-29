var Options = {
    pickHostFile: function(){
        //var hostsDir = FileUtils.getFile("c:\\windows\\system32\\drivers\\etc\\");
        
        var fp = FileUtils.getFilePicker();
        //fp.displayDirectory = hostsDir;
        const nsIFilePicker = Components.interfaces.nsIFilePicker;
        fp.appendFilters(nsIFilePicker.filterAll);
        
        fp.init(window, "#Teste", nsIFilePicker.modeOpen);
        var value = fp.show();
        if (value == nsIFilePicker.returnOK) {
            var textbox = document.getElementById("hosts-location");
            textbox.value = fp.file.path;
            document.getElementById('prefpane_general').userChangedValue(textbox);
        }
    },
    
    checkPermission: function(){
        this.checkFilePermission();
    },
    
    checkFilePermission: function(){
        var filePath = document.getElementById("hosts-location").value;
        
        if (Utils.trim(filePath) == "") {
            alert("#Você deve selecionar um arquivo hosts.");
            return;
        }
        
        var file = FileUtils.getFile(filePath);
        
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
    },
    
    getFilePath: function(){
        return document.getElementById('hosts-location').value;
    },
    
    read: function(){
        document.getElementById('definitions-dir').value = FileUtils.read(this.getFilePath());
    },
    
    save: function(){
        FileUtils.save(this.getFilePath(), document.getElementById('definitions-dir').value);
    },
    
    reset: function(){
        //Reset firefox managed preferences
        Prefs.reset();
        //Set SO's defaults
        var so = Utils.getOperationSystem();
        Log.info("Writing defaults for system: " + so);
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
