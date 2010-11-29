/**
 * Definition declaration
 *
 * @param {Object} id
 * @param {Object} name
 * @param {Object} show
 * @param {Object} selected
 * @param {Object} content
 */
function Definition(id, name, show, selected, content){
    this.id = id;
    this.name = name;
    this.show = new Boolean(parseInt(show)).valueOf();
    this.selected = new Boolean(parseInt(selected)).valueOf();
    this.content = content;
};

/**
 *  Change Hosts constants
 */
const CHConstants = {
    branchName: "extensions.changeHosts.",
    windowType: "changeHosts:settings",
    windowURI: "chrome://changeHosts/content/options.xul",
    windowOptions: "chrome,toolbar,dialog=no,resizable,all,dependent,centerscreen",
    hostLocationPref: "hosts-location",
    executePostScriptPref: "script-flag",
    postScriptLocationPref: "script-location"
}
