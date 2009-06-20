/*

//Make sure we load settings
window.addEventListener('load', creditCardGeneratorOnLoad, false);

function creditCardGeneratorOnLoad() {
    var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    // Get the "creditCardGenerator." branch
    var prefs = prefsService.getBranch("creditCardGenerator.");

    try {
        //document.getElementById("creditCardGenerator-check").checked = prefs.getBoolPref('pontuacao');
        //Set default card
        var ndx = prefs.getIntPref("defaultCard");
        document.getElementById("creditCardGeneratorDefault").selectedIndex = ndx;

        document.getElementById("creditCardGenerator-check_icone").checked = prefs.getBoolPref('mostraIconeBarraStatus');
    } catch(e) {
        //document.getElementById("creditCardGenerator-check").checked = false;
        document.getElementById("creditCardGenerator-check_icone").checked = false;
    }
}

function creditCardGeneratorAccept() {
    var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    // Get the "creditCardGenerator." branch
    var prefs = prefsService.getBranch("creditCardGenerator.");

    try {
        //prefs.setBoolPref('pontuacao', document.getElementById("creditCardGenerator-check").checked);
        //Write default card
        prefs.setIntPref("defaultCard", document.getElementById("creditCardGeneratorDefault").selectedIndex);
        //Write icon status
        prefs.setBoolPref('mostraIconeBarraStatus', document.getElementById("creditCardGenerator-check_icone").checked);

        //Update icon browser
        opener.document.getElementById('creditCardGenerator_statusbar_panel').style.visibility = document.getElementById("creditCardGenerator-check_icone").checked ? "visible": "collapse";
        opener.document.getElementById('creditCardGenerator_statusbar_panel').setAttribute("status", document.getElementById("creditCardGenerator-check_icone").checked ? "1": "0");
    } catch(e) {
        var alertText = "Erro ao gravar opções.";
        alert(alertText + e);
    }
}

*/

function addDefinition() {
    var tabName = document.getElementById("definition-name").value;
    tabName = trim(tabName);
    if (tabName == "") {
        alert("Preencha o nome da definição");
        return;
    }
    var tabs = document.getElementById("changeHosts-preferences-tabs");
    var tab = document.createElement("tab");
    tab.setAttribute("label", tabName);
    tab.setAttribute("id", "changeHosts-tab-geral" + tabName);
    tab.setAttribute("tabIndex", "2");
    tabs.appendChild(tab);

    var tabpanels = document.getElementById("tabpanels");
    var tabpanelTemplate = document.getElementById("definition-tab-template");
    var tabpanel = tabpanelTemplate.cloneNode(true);
    tabpanel.setAttribute("hidden", "false");

    tabpanels.appendChild(tabpanel);

    window.sizeToContent();
}

function trim(string) {
    return string.replace(/^\s*/, "").replace(/\s*$/, "");
}

function pickHostFile() {
    var hostsDir = getFile("c:\\windows\\system32\\drivers\\etc\\");

    var fp = getFilePicker();
    fp.displayDirectory = hostsDir;
    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    fp.appendFilters(nsIFilePicker.filterAll);

    fp.init(window, "#Teste", nsIFilePicker.modeOpen);
    var value = fp.show();
    if (value == nsIFilePicker.returnOK) {
        var textbox = document.getElementById("hosts-location");
		textbox.value = fp.file.path;
		document.getElementById('prefpane_general').userChangedValue(textbox);
    }
}

function pickDefinitionsDir() {

    var fp = getFilePicker();
    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    fp.init(window, "#Teste", nsIFilePicker.modeGetFolder);

    var value = fp.show();
    if (value == nsIFilePicker.returnOK) {
        var textbox = document.getElementById("definitions-dir");
		textbox.value = fp.file.path;
		document.getElementById('prefpane_general').userChangedValue(textbox);
    }
}

function getFilePicker() {
    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    return fp;
}

function checkPermission() {
	checkFilePermission();
	checkDirPermission();
}

function checkFilePermission() {
    var filePath = document.getElementById("hosts-location").value;

    if (trim(filePath) == "") {
        alert("#Você deve selecionar um arquivo hosts.");
        return;
    }

    var file = getFile(filePath);

    // Class names
    const imgOK = "testImgOK";
    const imgFail = "testImgFail";
    // Check read
    var readImg = document.getElementById("testReadFile");
    if (file.isReadable()) {
        readImg.setAttribute("class", imgOK);
    } else {
        readImg.setAttribute("class", imgFail);
    }
    // Check write
    var writeImg = document.getElementById("testWriteFile");
    if (file.isWritable()) {
        writeImg.setAttribute("class", imgOK);
    } else {
        writeImg.setAttribute("class", imgFail);
    }
}

function checkDirPermission() {
    var dirPath = document.getElementById("definitions-dir").value;

    if (trim(dirPath) == "") {
        alert("#Você deve selecionar um diretorio para salvar as definições.");
        return;
    }

    var file = getFile(dirPath);

    // Class names
    const imgOK = "testImgOK";
    const imgFail = "testImgFail";
    // Check read
    var readImg = document.getElementById("testReadDir");
    if (file.isReadable()) {
        readImg.setAttribute("class", imgOK);
    } else {
        readImg.setAttribute("class", imgFail);
    }
    // Check write
    var writeImg = document.getElementById("testWriteDir");
    if (file.isWritable()) {
        writeImg.setAttribute("class", imgOK);
    } else {
        writeImg.setAttribute("class", imgFail);
    }
}

function getFile(filePath) {
    const nsILocalFile = Components.interfaces.nsILocalFile;
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(nsILocalFile);
    file.initWithPath(filePath);
    return file;
}

function getFilePath() {
    var savefile = "mozdat_captainbar.txt";

	enablePermission();
    // get the path to the user's home (profile) directory
    const DIR_SERVICE = new Components.Constructor("@mozilla.org/file/directory_service;1", "nsIProperties");
    try {
        path = (new DIR_SERVICE()).get("ProfD", Components.interfaces.nsIFile).path;
    } catch(e) {
        alert("error");
    }
    // determine the file-separator
    if (path.search(/\\/) != -1) {
        path = path + "\\";
    } else {
        path = path + "/";
    }
    savefile = path + savefile;

    //return savefile;
    //alert(savefile);
	return "C:\\Documents and Settings\\tqi_mpelegrini\\Desktop\\ecAccounts\\teste\\file.txt"
}

function save() {
	enablePermission();
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    var savefile = getFilePath();
    file.initWithPath(savefile);
    if (file.exists() == false) {
        alert("Creating file... ");
        file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
    }
    var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
    /* Open flags 
	#define PR_RDONLY       0x01
	#define PR_WRONLY       0x02
	#define PR_RDWR         0x04
	#define PR_CREATE_FILE  0x08
	#define PR_APPEND       0x10
	#define PR_TRUNCATE     0x20
	#define PR_SYNC         0x40
	#define PR_EXCL         0x80
	*/
    /*
	** File modes ....
	**
	** CAVEAT: 'mode' is currently only applicable on UNIX platforms.
	** The 'mode' argument may be ignored by PR_Open on other platforms.
	**
	**   00400   Read by owner.
	**   00200   Write by owner.
	**   00100   Execute (search if a directory) by owner.
	**   00040   Read by group.
	**   00020   Write by group.
	**   00010   Execute by group.
	**   00004   Read by others.
	**   00002   Write by others
	**   00001   Execute by others.
	**
	*/
    outputStream.init(file, 0x04 | 0x08 | 0x20, 420, 0);
    var output = document.getElementById('hosts-location').value;
    var result = outputStream.write(output, output.length);
    outputStream.close();

}
function read() {
	enablePermission();
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    var savefile = getFilePath();
    file.initWithPath(savefile);
    if (file.exists() == false) {
        alert("File does not exist");
    }
    var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
    is.init(file, 0x01, 00004, null);
    var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
    sis.init(is);
    var output = sis.read(sis.available());
    document.getElementById('hosts-location').value = output;
}

function enablePermission() {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch(e) {
        alert("Permission to read file was denied.");
    }
}