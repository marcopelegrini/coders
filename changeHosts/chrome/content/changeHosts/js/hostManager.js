function CHManager(utils, log) {

	this.utils = utils;
	this.log = log;

    this.getDefaultHostPath = function(){
        var so = this.utils.getOperationSystem();
        this.log.debug("Running on system: " + so);
        switch (so) {
            case "Darwin":
                return "/etc/hosts";
                break;
            default:
                return "c:\\windows\\system32\\drivers\\etc\\hosts";
        }
    }
}