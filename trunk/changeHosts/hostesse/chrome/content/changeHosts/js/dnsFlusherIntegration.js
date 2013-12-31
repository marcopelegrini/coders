/**
 * @author marcotulio
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};
    
(function(){
    
    coders.changeHosts.dnsFlusherIntegration = {

        ctx: coders.changeHosts.applicationContext,
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
                this.ctx.logUtils.error("Error integrating with DNSFlusher: " + anError);
            }
            return false;
        }
    };
})();