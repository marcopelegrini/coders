(function(){

    coders.changeHosts.migration = {

        ctx: coders.changeHosts.applicationContext,
		
		onLoad: function(){
			document.documentElement.getButton("accept").disabled = true;
			window.sizeToContent();
		},

	    migrate: function() {
			window.arguments[0].out = {
				migrate: true,
				later: false,
				filePath: this.getFilePath()
			};
			return true;
	    },

	    doNotMigrate: function(){
			window.arguments[0].out = {
				migrate: false,
				later: false,
				filePath: this.getFilePath()
			};
			window.close();
			return true;
	    },

	    migrateLater: function(){
			window.arguments[0].out = {
				migrate: true,
				later: true,
				filePath: this.getFilePath()
			};
			return true;
	    },

	    getFilePath: function(){
	    	return this.ctx.browserUtils.getElement("definitions-root-dir").value;
	    },

		pickDefinitionsRootDir: function() {
			var fp = this.ctx.fileUtils.getFilePicker();
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			fp.appendFilters(nsIFilePicker.filterAll);

			fp.init(window, this.ctx.preferenceUtils.getSBundle().getString("cH.pickHostFile"), nsIFilePicker.modeGetFolder);
			var value = fp.show();
			if (value == nsIFilePicker.returnOK) {
				var textbox = this.ctx.browserUtils.getElement("definitions-root-dir");
				textbox.value = fp.file.path;

				if (this.validRootDirSelected(fp.file.path)){
					coders.browserUtils.getElement("definitions-root-dir-label-invalid").setAttribute("style", "display:none;");
					coders.browserUtils.getElement("definitions-root-dir-invalid").setAttribute("style", "display:none;");
					document.documentElement.getButton("accept").disabled = false;
					window.sizeToContent();
				}else{
					coders.browserUtils.getElement("definitions-root-dir-label-invalid").setAttribute("style", "display:block;");
					coders.browserUtils.getElement("definitions-root-dir-invalid").setAttribute("style", "display:block;");
					document.documentElement.getButton("accept").disabled = true;
					window.sizeToContent();
				}					
			}
		},

		validRootDirSelected: function(filePath){
			var file = this.ctx.fileUtils.getFile(filePath);
			if (file && file.exists() && file.isDirectory() && file.isReadable()) {
				return true;
			}else{
				return false;
			}
		}
    };
    
    window.addEventListener("load", function(){
        coders.changeHosts.migration.onLoad();
    }, false);
})();

	    