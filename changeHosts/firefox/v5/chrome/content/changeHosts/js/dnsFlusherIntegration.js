/**
 * @author marcotulio
 */
(function(){

	Components.utils.import("chrome://changeHosts/content/js/ctech/logUtils.jsm");

    coders.ns("coders.changeHosts").dnsFlusherIntegration = {

        ctx: coders.changeHosts.applicationContext,
		logger: Log.repository.getLogger("coders.changeHosts.dnsFlusherIntegration"),
		
        dnsFlusherService: null,

        setContext: function(applicationContext){
            this.ctx = applicationContext;
        },

        integrated: function(){
            if (this.dnsFlusherService == null){
                return this.checkIntegration();
            }
            return this.dnsFlusherService != false;
        },

        checkIntegration: function(){
            try {
                var dnsFlusherCc = Components.classes['@coders.com.br/DNSFlusher;1']
                if(dnsFlusherCc){
                    this.dnsFlusherService = dnsFlusherCc.getService().wrappedJSObject;
                    return true;
                }else{
                    this.dnsFlusherService = false;
                }
            } catch (anError) {
                this.logger.error("Error integrating with DNSFlusher: " + anError);
            }
            return false;
        }
    };
})();
