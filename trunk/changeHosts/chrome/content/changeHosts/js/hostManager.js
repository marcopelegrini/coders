/**
 * Definitions selector manager (just to decouple each part of plugin)
 * 
 * @param {Object} utils
 * @param {Object} log
 * @param {Object} dao
 * @param {Object} preferences
 * @param {Object} fileUtils
 */
function CHManager(utils, log, dao, preferences, fileUtils){

    this.utils = utils;
    this.log = log;
	this.dao = dao;
	this.preferences = preferences;
 	this.fileUtils = fileUtils;
    
    this.getDefaultHostPath = function(){
        var so = this.utils.getOperationSystem();
        this.log.debug("Running on system: " + so);
        switch (so) {
            case "Darwin":
                return "/etc/hosts";
                break;
			//Linux missing
            default:
                return "c:\\windows\\system32\\drivers\\etc\\hosts";
        }
    }
    
    this.select = function(id){
        this.log.info("Changing hosts to: " + id);
        if (this.dao.selectHost(id)) {
            //Host mark as selected on database, write file on disk
            var hostLocation = this.preferences.getString(CHConstants.hostLocationPref);
            var hostContent = this.dao.getHostContent(id)
			
            this.log.debug("Writing new hosts to: " + hostLocation);
            this.fileUtils.save(hostLocation, hostContent);
            
            //Execute post-script if its necessary
            var executePostScript = this.preferences.getBool(CHConstants.executePostScriptPref);
            if (executePostScript) {
                this.log.debug("Running post-script file...");
                var postScript = this.preferences.getString(CHConstants.postScriptLocationPref);
                this.fileUtils.execute(postScript);
            }
            this.log.debug("Done changing hosts.")
        }
        else {
            alert("#Impossivel selecionar o hosts.");
        }
    }
}
