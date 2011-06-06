/**
 * File utilities
 *
 * @author marcotulio
 */
function CTechFileUtils(utils){

	this.utils = utils;
	
    /**
     * Get a file instance from filePath
     *
     * @param {Object} filePath
     */
    this.getFile = function(filePath){
		if (!filePath || filePath.trim() == "" ){
			return;
		}
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(filePath);
		return file;
    }
    
    /**
     * Get FilePicker Interface
     */
    this.getFilePicker = function(){
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        return fp;
    }
    
    /**
     * Save a content to a file. If the file does not exists, create one
     *
     * @param {Object} filePath
     */
    this.save = function(filePath, output){
        try {
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(filePath);
            if (!file.exists()) {
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
            //outputStream.init(file, 0x04 | 0x08 | 0x20, 420, 0);
            outputStream.init(file, -1, -1, 0);
            var result = outputStream.write(output, output.length);
            outputStream.close();
        } 
        catch (ex) {
            throw (new FileManipulationException(ex));
        }
    }
    
    /**
     * Read a file from filePath
     *
     * @param {Object} filePath
     */
    this.read = function(filePath){
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(filePath);
        if (!file.exists()) {
            throw (new FileManipulationException(null, "File '" + filePath + "' does not exists."));
        }
		if(!file.isFile()){
            throw (new FileManipulationException(null, "Is not a file"));
		}
        var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        is.init(file, 0x01, 00004, null);
        var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
        sis.init(is);
        var output = sis.read(sis.available());
        return output;
    }
    
    /**
     * Execute a file from filePath
     *
     * @param {Object} filePath
     */
    this.execute = function(filePath){
        var file = this.getFile(filePath);
        if (file.exists()) {
			if(!file.isFile()){
        	    throw (new FileManipulationException(null, "Is not a file"));
			}
            var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
            process.init(file);
            // Run the process.
            // If first param is true, calling thread will be blocked until called process terminates.
            // Second and third params are used to pass command-line arguments to the process.
            process.run(true, null, 0);
        }
        else {
            throw (new FileManipulationException(null, "File '" + filePath + "' does not exists."));
        }
    }
	
	this.getFileSeparator = function(){
		var so = this.utils.getOperationSystem();
		if (so.indexOf("Windows") != -1) {
			return "\\";
		}
		return "/";
	}
}

function FileManipulationException(cause, message){
    this.cause = cause;
    
    this.message = message;
    
    this.getCause = function(){
        return this.cause;
    }
    
    this.getMessage = function(){
        return this.message;
    }
}
