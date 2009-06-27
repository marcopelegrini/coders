/**
 * @author marcotulio
 */
var Util = {
    getOperationSystem: function(){
        const Cc = Components.classes;
        const Ci = Components.interfaces;
        var sysInfo = Cc['@mozilla.org/system-info;1'].getService(Ci.nsIPropertyBag2);
        var pratform = sysInfo.getProperty('name');
        alert(pratform);
    }
}
