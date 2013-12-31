/**
 * Class to manage host definitions - Definitions Tab
 *
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};
if (!coders.changeHosts.options) 
    coders.changeHosts.options = {};

(function(){

    coders.changeHosts.options.definitions = {
    
        ctx: coders.changeHosts.applicationContext,
        hostMap: [],
        defaultHostFileExtension: null,
        hostFileNamePattern: null,

        // Dir and file name to select on tree/list while building it
        hostDirToSelect: null,
        hostPathToSelect: null,

        treeStyleSheet: null,

        onLoad: function(){
            try{
                this.defaultHostFileExtension = this.ctx.preferenceUtils.getString('default-host-file-extension');
                this.hostFileNamePattern = new RegExp('\\' + this.defaultHostFileExtension + '$','ig');

                var currentHost = this.ctx.preferenceUtils.getString('current-host');
                this.ctx.uiManager.setCurrentHost(currentHost);

                this.setTreeStyleSheet();

                this.setSelections(currentHost);

                var tree = this.ctx.uiManager.getHostDirTree();

                // Load Tree
                this.loadTree(tree);    
                // Pre select
                this.setTreeSelection(tree);
            }catch(ex){
                if (ex instanceof DefinitionRootNotConfiguredException){
                    this.ctx.browserUtils.showAlert("Change Hosts", "Definitions root dir not configured.");
                }else{
                    this.ctx.logUtils.error(ex);    
                }
            }
        },
    
        newHostFile: function(event){
            var tree = this.ctx.uiManager.getHostDirTree();
            var currentIndex = tree.view.selection.currentIndex;
            var treeItem = tree.contentView.getItemAtIndex(currentIndex);

            var displayDirPath = treeItem.getAttribute('value');

            var fp = this.ctx.fileUtils.getFilePicker();
            const nsIFilePicker = Components.interfaces.nsIFilePicker;
            fp.appendFilter('Host file', '*' + this.defaultHostFileExtension);

            if(!displayDirPath){
                displayDirPath = this.ctx.preferenceUtils.getString('definitions-root-dir');
            }
            var displayDir = this.ctx.fileUtils.getFile(displayDirPath);

            fp.displayDirectory = displayDir;
            fp.defaultExtension = this.defaultHostFileExtension;

            var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.createNewHostsFile");
            fp.init(window, msg, nsIFilePicker.modeSave);
            var value = fp.show();
            if (value == nsIFilePicker.returnOK) {
                this.ctx.fileUtils.saveFile(fp.file, "");
                this.setSelections(fp.file.path);
            }
            var tree = this.ctx.uiManager.getHostDirTree();
            this.reloadTree(tree);
            this.setTreeSelection(tree);
        },

        deleteHostFile: function(event){
            var hostList = this.ctx.uiManager.getHostList();
            var hostToRemove = hostList.selectedItem.value;

            var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.removeFileConfirmation");

            var params = {
                inn:{
                    message: msg,
                    pathToRemove: hostToRemove
                }, 
                out:null
            };            
            window.openDialog("chrome://changeHosts/content/deleteDialog.xul", "showmore", "chrome, dialog, modal, centerscreen", params).focus();

            var out = params.out;
            if (out && out.remove) {
                //Delete host file, no recursive
                this.ctx.fileUtils.delete(hostToRemove, false);

                var tree = this.ctx.uiManager.getHostDirTree();
                this.reloadTree(tree);
                this.setTreeSelection(tree);
            }
        },

        deleteHostDir: function(event){
            var tree = this.ctx.uiManager.getHostDirTree();
            var currentIndex = tree.view.selection.currentIndex;
            var treeItem = tree.contentView.getItemAtIndex(currentIndex);
            var dirToRemove = treeItem.getAttribute('value');

			var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.removeFolderConfirmation");

            var params = {
                inn:{
                    message: msg,
                    pathToRemove: dirToRemove
                }, 
                out:null
            };            
            window.openDialog("chrome://changeHosts/content/deleteDialog.xul", "showmore", "chrome, dialog, modal, centerscreen", params).focus();

            var out = params.out;
            if (out && out.remove) {
                //Delete host dir and its files
                this.ctx.fileUtils.delete(dirToRemove, true);

                var tree = this.ctx.uiManager.getHostDirTree();
                this.reloadTree(tree);
                this.setTreeSelection(tree);
            }
        },

        clearColor: function(event){
            var tree = this.ctx.uiManager.getHostDirTree();
            var currentIndex = tree.view.selection.currentIndex;
            var treeItem = tree.contentView.getItemAtIndex(currentIndex);
            if (treeItem){
                var path = treeItem.getAttribute('value');
                this.ctx.dao.clearHostsConfigColor(path);
                tree.treeBoxObject.clearStyleAndImageCaches();
                this.reloadTree(tree);
                
                tree.view.selection.clearSelection();
                tree.view.selection.select(currentIndex);
                setTimeout(function(){tree.treeBoxObject.ensureRowIsVisible(currentIndex)},0);

                this.ctx.uiManager.setCurrentColor();
            }
        },

        setColor: function(event){
            var tree = this.ctx.uiManager.getHostDirTree();
            var currentIndex = tree.view.selection.currentIndex;
            var treeItem = tree.contentView.getItemAtIndex(currentIndex);
            if (treeItem){
                var path = treeItem.getAttribute('value');
                var hostsConfig = this.ctx.dao.findHostsConfig(path);
                if (hostsConfig && hostsConfig.color){
                    var currentColor = hostsConfig.color;
                }else{
                    var currentColor = this.ctx.preferenceUtils.getString("definition-color");
                }

                var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.setFolderColorDisclaimer");

                var params = {
                    inn: { 
                        color: currentColor,
                        description: msg
                    }, 
                    out:null
                };            
                window.openDialog("chrome://changeHosts/content/colorDialog.xul", "showmore", "chrome, dialog, modal, resizable=no, centerscreen", params).focus();

                var out = params.out;
                if (out) {
                    var newColor = out.color;
                    if (newColor){
                        this.ctx.dao.saveOrUpdateConfigColor(path, newColor);
                        tree.treeBoxObject.clearStyleAndImageCaches();
                        this.reloadTree(tree);
                        
                        tree.view.selection.clearSelection();
                		tree.view.selection.select(currentIndex);
                        setTimeout(function(){tree.treeBoxObject.ensureRowIsVisible(currentIndex)},0);

                        this.ctx.uiManager.setCurrentColor();
                    }
                }            
            }
        },

        clearFileColor: function(event){
            var listbox = this.ctx.uiManager.getHostList();
            var selectedIndex = listbox.selectedIndex;
            if (selectedIndex != null){
                var item = listbox.getItemAtIndex(selectedIndex);
                if(item){
                    var path = item.getAttribute('value');
                    this.ctx.dao.clearHostsConfigColor(path);

                    var tree = this.ctx.uiManager.getHostDirTree();
                    this.reloadTree(tree);
                    this.setTreeSelection(tree);
                    this.ctx.uiManager.setCurrentColor();
                }
            }
        },

        setFileColor: function(event){
            var listbox = this.ctx.uiManager.getHostList();
            var selectedIndex = listbox.selectedIndex;
            if (selectedIndex != null){
                var item = listbox.getItemAtIndex(selectedIndex);
                if(item){
                    var path = item.getAttribute('value');
                    var hostsConfig = this.ctx.dao.findHostsConfig(path);
                    if (hostsConfig && hostsConfig.color){
                        var currentColor = hostsConfig.color;
                    }else{
                        var currentColor = this.ctx.preferenceUtils.getString("definition-color");
                    }

                    var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.setFileColorDisclaimer");

                    var params = {
                        inn: { 
                            color: currentColor,
                            description: msg
                        }, 
                        out:null
                    };            
                    window.openDialog("chrome://changeHosts/content/colorDialog.xul", "showmore", "chrome, dialog, modal, resizable=no, centerscreen", params).focus();

                    var out = params.out;
                    if (out) {
                        var newColor = out.color;
                        if (newColor){
                            this.ctx.dao.saveOrUpdateConfigColor(path, newColor);

                            var tree = this.ctx.uiManager.getHostDirTree();
                            this.reloadTree(tree);
                            this.setTreeSelection(tree);
                            this.ctx.uiManager.setCurrentColor();
                        }
                    }         
                }
            }
        },

        contentKeyPressed: function(event){
            var showParsed = this.ctx.preferenceUtils.getBool("view-parsed-hosts");
            if (showParsed){
                event.preventDefault();
                event.stopPropagation();                
                alert(this.ctx.preferenceUtils.getSBundle().getString("cH.viewParsedModeAlert"));
                return;
            }else{
                this.ctx.uiManager.setHostEditionMode(true);
            }
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
            }else{
                if ((event.which == 115 && event.ctrlKey) || (event.which == 19)){
                    this.save();
                } 
            }
        },


        showParsedHostsToggle: function(parse){
            var content;
            var filePath = this.ctx.browserUtils.getElement("definition-path").value;
            if(filePath && filePath != null){
                if(parse){
                    content = this.ctx.hostesseTemplateManager.parse(filePath);
                }else{
                    content = this.ctx.fileUtils.read(filePath);
                }
                this.ctx.browserUtils.getElement("content").value = content;
            }
            this.ctx.preferenceUtils.setBool("view-parsed-hosts", parse);               
        },

        reloadTree: function(tree){
            // Clean Tree
            this.ctx.uiManager.cleanTree(tree);
            // Load Tree
            this.loadTree(tree);
        },

        setSelections: function(filePath){
            if(filePath){
                this.hostPathToSelect = filePath;
                this.hostDirToSelect = this.getHostDirFromFilePath(filePath);
            }else{
                this.hostPathToSelect = null;
                this.hostDirToSelect = null;
            }
        },

        loadTree: function(tree){
            this.ctx.logUtils.info('Loading host directories and files');
            try{
                var definitionsRootDirPath = this.ctx.preferenceUtils.getString('definitions-root-dir');

                if (!definitionsRootDirPath){
                    throw new DefinitionRootNotConfiguredException();
                }
                // this.hostMap = [];
                this.hostMap = new Map();
                this.readDir(definitionsRootDirPath, tree, true);
                this.ctx.logUtils.info("Found " + this.hostMap.size + " hosts.");
                
                if(this.ctx.logUtils.isTrace()){
                    for (var [dir, hosts] of this.hostMap) {
                        this.ctx.logUtils.trace('Host dir found: ' + dir);
                        for (var i = 0; i < hosts.length; i++) {
                            this.ctx.logUtils.trace('Host found: ' + hosts[i].fileName + ' on path ' + hosts[i].path);
                        }
                    }
                }

                tree.removeAttribute("disabled");
                this.ctx.logUtils.info('Done loading host directories and files');
            }catch(ex){
                this.ctx.logUtils.error('Error loading host directories and files ' + ex, ex);
            }
        },

        setTreeSelection: function(tree){
            var view = tree.view;
            if(view){
                tree.view.selection.clearSelection();
                // Show dir selection on the tree
                var column = tree.columns.getNamedColumn("dir");
                for (var i = 0; i < tree.view.rowCount; i++){
                    if (tree.view.getCellValue(i, column) == this.hostDirToSelect){
                        tree.view.selection.select(i);
                        setTimeout(function(){tree.treeBoxObject.ensureRowIsVisible(i)},0);
                        return;
                    }
                }
                this.ctx.logUtils.info('Done defining tree selection');
            }
        },

        readDir: function(path, father, root) {
            var dir = this.ctx.fileUtils.getFile(path);    

            if (!dir.exists()) {
                throw('Folder ' + dir + ' not found.');
            }
            if (!dir.isDirectory()) {
                throw(dir + ' is not a directory.');
            }

            let entries = dir.directoryEntries;
            let entry;
            var treeitem;
            var treechildren;
            var notExpandableDirs = this.ctx.preferenceUtils.getStringList('not-expandable-dir');

            while (entries.hasMoreElements()) {
                entry = entries.getNext();
                entry.QueryInterface(Components.interfaces.nsILocalFile);

                if (entry.isFile()) {
                    if(entry.leafName.match(this.hostFileNamePattern)){
                        this.ctx.logUtils.trace('Adding file: ' + entry.leafName);
                        var value = { fileName: entry.leafName, path: entry.path};
                        if(!this.hostMap.has(dir.path)){
                            this.ctx.logUtils.trace('Adding dir to hostMap ' + dir.path + ' and adding host to it');
                            this.hostMap.set(dir.path, [value]);

                            if(root){
                                this.ctx.logUtils.trace('Files on root found. Creating an item for rootdir.');
                                if (!treechildren){
                                    treechildren = this.createTreeChildren(dir.leafName)
                                }
                                var rootDirName = this.ctx.preferenceUtils.getSBundle().getString("cH.rootDirName");
                                var ti = this.createTreeChildrenItem(rootDirName, dir.path);
                                var firstItem = treechildren.firstChild;
                                treechildren.insertBefore(ti, firstItem);
                            }
                        }else{
                            this.hostMap.get(dir.path).push(value);
                        }
                    }
                }
                else if (entry.isDirectory()) {
                    if(!this.hostMap.has(entry.path)){
                        this.ctx.logUtils.trace('Adding dir to hostMap ' + entry.path + ' with a clear host list');
                        this.hostMap.set(entry.path, []);
                    }
                    this.ctx.logUtils.debug('Reading dir: ' + entry.leafName + '(' + entry.path + ') under: ' + dir.leafName + '(' + dir.path + ')');

                    if (!treechildren){
                        treechildren = this.createTreeChildren(entry.leafName)
                    }else{
                        this.ctx.logUtils.trace('Using existent treechildren ' + treechildren.getAttribute('id'));
                    }

                    // Create an item on the treechildren
                    treeitem = this.createTreeChildrenItem(entry.leafName, entry.path);
                    treechildren.appendChild(treeitem); 
                    // Read recursively the dir
                    var ret = this.readDir(entry.path, treeitem);
                    // If there is children, define this a container
                    if (ret){
                        if ((!this.hostDirToSelect || this.hostDirToSelect.indexOf(entry.path) == -1)
                            && 
                            (notExpandableDirs && notExpandableDirs.indexOf(entry.path) > -1)){
                            treeitem.setAttribute('open', false);
                        }
                        treeitem.setAttribute('container', true);
                    }
                }else{
                    this.ctx.logUtils.warn('Is not a dir, is not also a file: ' + entry.path);
                }
            }

            if(treechildren){
                this.ctx.logUtils.trace('Adding treechildren ' + treechildren.getAttribute('id') + ' on ' + father.getAttribute('id'));
                father.appendChild(treechildren);
                return true;
            }else{
                this.ctx.logUtils.trace('Last leaf');
                return false;
            }
        },

        createTreeChildren: function(id){
            this.ctx.logUtils.trace('Creating treechildren ' + id);
            var treechildren = this.ctx.browserUtils.createElement('treechildren');
            treechildren.setAttribute('id', 'tc-' + id);
            treechildren.setAttribute('contextmenu', 'dirSelectionMenu');
            return treechildren;
        },

        createTreeChildrenItem: function(label, path){
            this.ctx.logUtils.trace('Create treeitem/row/cell ' + label);
            
            var dirCell = this.ctx.browserUtils.createElement('treecell');
            dirCell.setAttribute('label', label);
            dirCell.setAttribute('value', path);

            var color = this.ctx.hostsManager.findHostsColor(path);
            var colorCell = this.ctx.browserUtils.createElement('treecell');
            colorCell.setAttribute('label', '\u25A0');
            colorCell.setAttribute('value', color);

            var normalizedPath = this.normalizePath(path);

            colorCell.setAttribute('properties', normalizedPath);
            this.setTreeCellColor(normalizedPath, color);                
            // var hideCell = this.ctx.browserUtils.createElement('treecell');
            // hideCell.setAttribute('label', 'Hide');
            // hideCell.setAttribute('value', 'Hide');

            var treerow = this.ctx.browserUtils.createElement('treerow');
            treerow.appendChild(dirCell);
            if(colorCell){
                treerow.appendChild(colorCell);
            }
            // treerow.appendChild(hideCell);

            var treeitem = this.ctx.browserUtils.createElement('treeitem');
            treeitem.setAttribute('id', 'ti-' + label);
            treeitem.setAttribute('open', true);
            treeitem.setAttribute('value', path);            
            treeitem.appendChild(treerow);

            return treeitem;                               
        },

        handleTreeClick: function(tree){
            if(tree.currentIndex >= 0){
                var key = tree.view.getCellValue(tree.currentIndex, tree.columns["dir"]);
                this.ctx.logUtils.trace("Selected dir to read: " + key + ". Host path to select: " + this.hostPathToSelect);

                var hostList = this.ctx.uiManager.getHostList();
                this.ctx.uiManager.cleanHostList(hostList);

                var selectedHostItem = null;
                var selectedHostIndex = null;

                for(var i = 0; i < this.hostMap.get(key).length; i++){
                    var host = this.hostMap.get(key)[i];
                    var row = this.ctx.browserUtils.createElement('listitem');
                    row.setAttribute('value', host.path);                    
                    row.setAttribute('context', 'hostSelectionMenu');

                    var hostName = this.getHostNameFromFileName(host.fileName);

                    var hostNameCell = this.ctx.browserUtils.createElement('listcell');
                    hostNameCell.setAttribute('label', hostName);
                    row.appendChild(hostNameCell);

                    var color = this.ctx.hostsManager.findHostsColor(host.path);

                    var colorCell = this.ctx.browserUtils.createElement('listcell');
                    colorCell.setAttribute('label', '\u25A0');
                    colorCell.setAttribute('value', color);
                    colorCell.setAttribute('class', 'color');
                    colorCell.setAttribute('style', 'color: ' + color);
                    row.appendChild(colorCell);

                    //Select the first element or the previous selected
                    if(selectedHostItem == null || this.hostPathToSelect == host.path){
                        selectedHostItem = row;
                        selectedHostIndex = i;
                    }
                    hostList.appendChild(row);
                }

                hostList.selectItem(selectedHostItem);
                hostList.ensureIndexIsVisible(selectedHostIndex);

                this.ctx.uiManager.setSelectable(false);
                this.ctx.uiManager.setHostEditionMode(false);
            }
        },

        handleListboxClick: function(listbox){
            var filePath = '';
            var selectedIndex = listbox.selectedIndex;
            if (selectedIndex != null){
                var item = listbox.getItemAtIndex(selectedIndex);
                if(item){
                    filePath = item.getAttribute('value');
                    this.ctx.logUtils.trace("Selecting item " + selectedIndex + " on listbox  whose value is " + filePath);
                    this.showHosts(filePath);
                    var uiManager = this.ctx.uiManager;
                    setTimeout(function(){uiManager.setSelectable(true)}, 0);
                }else{
                    this.ctx.logUtils.trace("Selecting item " + selectedIndex + " on listbox but it has no value");
                    this.showHosts(null);
                }
            }
        },

        handleHostDirPopup: function(event){
            var tree = event.rangeParent;
            var popup = event.target;
            var menuitem = null;
            // Check if there is a menuitem
            if (popup.hasChildNodes() ) {
              var children = popup.childNodes;
              for (var i = 0; i < children.length; i++) {
                if(children[i].id == 'expansionToggle'){
                    menuitem = children[i];
                    continue;
                }
              }
            }

            // If it's a container, add or ajust menuitem
            if(tree.view && tree.currentIndex > -1 && tree.view.isContainer(tree.currentIndex)){
                // Add a menuitem if there isn't one
                if(!menuitem){
                    menuitem = this.ctx.browserUtils.createElement('menuitem');
                    menuitem.setAttribute('id', 'expansionToggle');
                    menuitem.setAttribute('onclick', 'coders.changeHosts.options.definitions.toggleExpansible(event);');    
                }
                // Check if toggle should be expandable or not expandable
                var key = tree.view.getCellValue(tree.currentIndex, tree.columns["dir"]);
                var notExpandableDirs = this.ctx.preferenceUtils.getStringList('not-expandable-dir');
				var msgExapand = this.ctx.preferenceUtils.getSBundle().getString("cH.expand");
				var msgColapse = this.ctx.preferenceUtils.getSBundle().getString("cH.colapse");                
                if (notExpandableDirs && notExpandableDirs.indexOf(key) > -1){
                    menuitem.setAttribute('label', msgExapand);
                }else{
                    menuitem.setAttribute('label', msgColapse);
                }

                popup.appendChild(menuitem);
            }else if(menuitem){
                popup.removeChild(menuitem);
            }
        },

        toggleExpansible: function(event){
            var tree = this.ctx.uiManager.getHostDirTree();            
            if(tree.currentIndex >= 0){
                var key = tree.view.getCellValue(tree.currentIndex, tree.columns["dir"]);
                var removalResult = this.ctx.preferenceUtils.removeFromStringList('not-expandable-dir', key);
                if (!removalResult){
                    this.ctx.preferenceUtils.addToStringList('not-expandable-dir', key);
                }
                this.reloadTree(tree);
                this.setTreeSelection(tree);
            }
        },

        showHosts: function(filePath){
            var hostContent = '';
            if (filePath && filePath != null){
                var showParsed = this.ctx.preferenceUtils.getBool("view-parsed-hosts");
                if (showParsed){
                    hostContent = this.ctx.hostesseTemplateManager.parse(filePath);
                }else{
                    hostContent = this.ctx.fileUtils.read(filePath);
                }
            }
            this.ctx.browserUtils.getElement("definition-path").value = filePath;            
            this.ctx.browserUtils.getElement("content").value = hostContent;
        },

        changeHosts: function(){
            var filePath = this.ctx.browserUtils.getElement("definition-path").value;
            try {
                this.ctx.logUtils.info("Changing hosts to: " + filePath);
                var parsed = this.ctx.hostesseTemplateManager.parse(filePath);
                if(parsed){
                    this.ctx.logUtils.debug("Parsed file: " + parsed);
                    this.ctx.hostsManager.changeHosts(parsed);

                    this.ctx.preferenceUtils.setString('current-host', filePath);
                    this.ctx.uiManager.setCurrentHost(filePath);

                    if(this.ctx.preferenceUtils.getBool("close-after-choose")){
                        return true;
                    }                    
                }else{
                    alert("Nothing on the file: " + parsed);
                }
            }catch(e){
            	if (e instanceof FileNotFoundException){
            		var msg = this.ctx.preferenceUtils.getSBundle().getString("cH.hostFileNotFound");
            		alert(msg)
            	}
            	this.ctx.logUtils.error("Error changing hosts to: " + filePath + ". " + e);
            }
            return false;
        },

        clearHosts: function(){
            try {
                this.ctx.hostsManager.changeHosts('');   
                this.ctx.uiManager.setCurrentHost('');
                this.ctx.preferenceUtils.setString('current-host', '');
                
                // Set null selections on tree                
                var tree = this.ctx.uiManager.getHostDirTree();
                
                this.setSelections(null);
                this.setTreeSelection(tree);

                //Clean host list
                var hostList = this.ctx.uiManager.getHostList();
                this.ctx.uiManager.cleanHostList(hostList);

                if(this.ctx.preferenceUtils.getBool("close-after-choose")){
                    return true;
                }                     
            }catch(e){
                alert("Error cleaning hosts: " + e);
            }
        },

        getHostNameFromFileName: function(fileName){
            return fileName.replace(this.hostFileNamePattern,'')
        },

        save: function(){
            try {
                var path = this.ctx.browserUtils.getElement("definition-path").value;
                var content = this.ctx.browserUtils.getElement("content").value;
                if(!this.ctx.browserUtils.isBlank(path)){
                    this.ctx.fileUtils.save(path, content);
                    this.ctx.uiManager.setHostEditionMode(false);
                    return true;
                }else{
                    alert("File path is not defined: " + path);
                }
            }catch(e){
                alert("Error saving host definition: " + e);
            }
        },

        saveAndUse: function(){
            if (this.save()){
                return this.changeHosts();
            }
        },

        cancelEdition: function(){
            this.ctx.uiManager.setHostEditionMode(false);
            var filePath = this.ctx.browserUtils.getElement("definition-path").value;    
            this.showHosts(filePath);
        },

        getHostDirFromFilePath: function(filePath){
            if(filePath && filePath != ''){
                var lastDirSeparator = filePath.lastIndexOf(this.ctx.fileUtils.getFileSeparator());
                if (lastDirSeparator && lastDirSeparator > 0){
                    return filePath.substring(0, lastDirSeparator);
                }
            }
            alert("Could not get Host Dir From File Path: " + filePath);
            return '';                    
        },

        getHostNameFromFilePath: function(filePath){
            if(filePath){
                var lastDirSeparator = filePath.lastIndexOf(this.ctx.fileUtils.getFileSeparator());
                if (lastDirSeparator && lastDirSeparator > 0){
                    var hostFileName = filePath.substring(lastDirSeparator + 1, filePath.lenght);
                    return this.getHostNameFromFileName(hostFileName);
                }
            }
            alert("Could not get Host Name From File Path: " + filePath);
            return '';
        },

        setTreeStyleSheet: function(){
            for (var i=0; i<document.styleSheets.length; i++) { 
              var styleSheet=document.styleSheets[i];
              if ( styleSheet.href == this.ctx.treeStyleSheetHREF){
                this.treeStyleSheet = styleSheet;
                return;
              }
            } 
        },

        setTreeCellColor: function(normalizedPath, color){
            var style = "treechildren::-moz-tree-cell-text("+ normalizedPath +") { color: " + color + "; }";
            this.treeStyleSheet.insertRule(style, this.treeStyleSheet.cssRules.length);
        },

        normalizePath: function(path){
            var separator = this.ctx.fileUtils.getFileSeparator();
            var pathNormalized = path.replace(new RegExp(this.escapeRegExp(separator), 'g'), '-');
            return pathNormalized.replace(':', '-');
        },

        escapeRegExp: function(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
    };

    window.addEventListener("load", function(){
        try{
            coders.changeHosts.options.definitions.onLoad();
        }catch(e){
            Application.console.log("Error loading definitions options: " + e);
        }
    }, false);    
})();