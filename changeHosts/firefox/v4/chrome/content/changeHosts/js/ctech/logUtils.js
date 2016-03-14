
/**
 * General utility for log purpose
 *
 * @author marcotulio
 */
if (!coders) 
    var coders = {};

(function(){

    coders.logUtils = function(logLevel){
    
        this.console = (Components.utils.import("resource://gre/modules/devtools/Console.jsm", {})).console;
        this.level = 0;
        
        switch (logLevel)
        {
        case 'ERROR':
        case 'error':
          this.level = 0;
          break;
        case 'WARN':
        case 'warn':
          this.level = 1;
          break;
        case 'INFO':
        case 'info':
          this.level = 2;
          break;
        case 'DEBUG':
        case 'debug':
          this.level = 3;
          break;
        case 'TRACE':
        case 'trace':
          this.level = 4;
          break;
        }

        this.trace = function(string){
            if (this.isTrace()) {
                this.console.log("[TRACE] - " + string);
            }
        }
        this.isTrace = function(){
            return this.level >= 4;
        }
        this.debug = function(string){
            if (this.level >= 3) {
                this.console.log("[DEBUG] - " + string);
            }
        }
        this.info = function(string){
            if (this.level >= 2) {
                this.console.info("[INFO] - " + string);
            }
        }
        this.warn = function(string){
            if (this.level >= 1) {
                this.console.warn("[WARN] - " + string);
            }
        }
        this.error = function(string){
            if (this.level >= 0) {
                this.console.error("[ERROR] - " + string);
            }
        }
        this.logObject = function(obj){
            this.console.log(obj);
        }
    }
})();