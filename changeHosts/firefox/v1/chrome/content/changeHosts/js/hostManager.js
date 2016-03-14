/**
 * Definitions selector manager (just to decouple each part of plugin)
 *
 * @param {Object} utils
 * @param {Object} log
 * @param {Object} dao
 * @param {Object} preferences
 * @param {Object} fileUtils
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};
	
(function(){
	
    coders.changeHosts.manager = function(log, dao, preferences){
    
        this.utils = coders.utils.util;
        this.fileUtils = coders.utils.fileUtils;
		this.constants = coders.changeHosts.constants;
		
        this.log = log;
        this.dao = dao;
        this.prefs = preferences;
        
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
                var hostLocation = this.prefs.getString(this.constants.hostLocationPref);
				if(this.utils.isBlank(hostLocation)){
					throw "#Host file destination is not defined.";
				}
				var host = this.dao.findHost(id);
                
                this.log.debug("Writing new hosts to: " + hostLocation);
                // Write definition's content to file
                this.fileUtils.save(hostLocation, host.content);
                
                //Execute post-script if its necessary
                var executePostScript = this.prefs.getBool(this.constants.executePostScriptPref);
                if (executePostScript) {
                    this.log.debug("Running post-script file...");
                    var postScript = this.prefs.getString(this.constants.postScriptLocationPref);
                    this.fileUtils.execute(postScript);
                }
                
                //Update interface
            	var color = this.prefs.getString("definition-color");
                if(host.color != null && host.color != ""){
                	color = host.color;
                }
                var browserWindow = this.utils.getBrowserWindow();
                this.utils.getElement("CH_status_definition_name", browserWindow.document).setAttribute("style", "color:" + color + ";");
                
                this.log.debug("Done changing hosts.")
                return true;
            }
            else {
                throw "Host's ID is null";
            }
        }
    }
})();
