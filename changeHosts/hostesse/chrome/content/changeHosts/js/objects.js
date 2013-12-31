/**
 * Definition declaration
 *
 * @param {Object} id
 * @param {Object} name
 * @param {Object} show
 * @param {Object} selected
 * @param {Object} content
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

coders.changeHosts.Definition =  function(id, name, show, selected, content, color, order){
    this.id = id;
    this.name = name;
    this.show = new Boolean(parseInt(show)).valueOf();
    this.selected = new Boolean(parseInt(selected)).valueOf();
    this.content = content;
    this.order = order;
    this.color = color;
};

coders.changeHosts.HostsConfig = function(path, color, hideFromStatus){
  this.path = path;
  this.color = color;
  this.hideFromStatus = hideFromStatus;
}

coders.changeHosts.RegexConfig = function(regex, color){
  this.regex = regex;
  this.color = color;
}

function DefinitionRootNotConfiguredException(message){
  this.name = "DefinitionRootNotConfiguredException";
  this.message = (message || "");
}
DefinitionRootNotConfiguredException.prototype = new Error();
DefinitionRootNotConfiguredException.constructor = DefinitionRootNotConfiguredException;

function FileNotFoundException(message) {
  this.name = "FileNotFoundException";
  this.message = (message || "");
}
FileNotFoundException.prototype = new Error();
FileNotFoundException.prototype.constructor = FileNotFoundException;