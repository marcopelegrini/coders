
/**
 * Definitions selector manager (just to decouple each part of plugin)
 *
 * @param {Object} utils
 * @param {Object} log
 * @param {Object} dao
 * @param {Object} preferences
 * @param {Object} fileUtils
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.changeHosts) 
    com.coders.changeHosts = {};
	
(function(){
	
    com.coders.changeHosts.manager = function(log, dao, preferences){
    
        this.utils = com.coders.utils.util;
        this.fileUtils = com.coders.utils.fileUtils;
		this.constants = com.coders.changeHosts.constants;
		
        this.log = log;
        this.dao = dao;
        this.preferences = preferences;
        
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
                var hostLocation = this.preferences.getString(this.constants.hostLocationPref);
				if(this.utils.isBlank(hostLocation)){
					throw "#Host file destination is not defined.";
				}
                var hostContent = this.dao.getHostContent(id)
                
                this.log.debug("Writing new hosts to: " + hostLocation);
                // Write definition's content to file
                this.fileUtils.save(hostLocation, hostContent);
                
                //Execute post-script if its necessary
                var executePostScript = this.preferences.getBool(this.constants.executePostScriptPref);
                if (executePostScript) {
                    this.log.debug("Running post-script file...");
                    var postScript = this.preferences.getString(this.constants.postScriptLocationPref);
                    this.fileUtils.execute(postScript);
                }
                this.log.debug("Done changing hosts.")
                return true;
            }
            else {
                throw "Host's ID is null";
            }
        }
    }
})();
