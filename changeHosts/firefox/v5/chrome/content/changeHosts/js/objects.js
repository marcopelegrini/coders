/**
 * Definition declaration
 *
 * @param {Object} id
 * @param {Object} name
 * @param {Object} show
 * @param {Object} selected
 * @param {Object} content
 */
coders.ns("coders.changeHosts").Definition =  function(id, name, show, selected, content, color, order){
    this.id = id;
    this.name = name;
    this.show = new Boolean(parseInt(show)).valueOf();
    this.selected = new Boolean(parseInt(selected)).valueOf();
    this.content = content;
    this.order = order;
    this.color = color;
};

coders.ns("coders.changeHosts").HostsConfig = function(path, color, hideFromStatus){
  this.path = path;
  this.color = color;
  this.hideFromStatus = hideFromStatus;
};

coders.ns("coders.changeHosts").RegexConfig = function(regex, color){
  this.regex = regex;
  this.color = color;
};

coders.ns("coders.changeHosts").FileNotFoundException = function(message) {
  this.name = "coders.changeHosts.FileNotFoundException";
  this.message = (message || "");
};
coders.ns("coders.changeHosts").FileNotFoundException.prototype = new Error();
coders.ns("coders.changeHosts").FileNotFoundException.prototype.constructor = coders.changeHosts.FileNotFoundException;


coders.ns("coders.changeHosts").DefinitionRootNotConfiguredException = function(message){
  this.name = "coders.changeHosts.DefinitionRootNotConfiguredException";
  this.message = (message || "");
};

coders.ns("coders.changeHosts").DefinitionRootNotConfiguredException.prototype = new Error();
coders.ns("coders.changeHosts").DefinitionRootNotConfiguredException.constructor = coders.changeHosts.DefinitionRootNotConfiguredException;


coders.ns("coders.changeHosts").FileCountExceededException = function(message){
  this.name = "coders.changeHosts.FileCountExceededException";
  this.message = (message || "");
};

coders.ns("coders.changeHosts").FileCountExceededException.prototype = new Error();
coders.ns("coders.changeHosts").FileCountExceededException.constructor = coders.changeHosts.FileCountExceededException;
