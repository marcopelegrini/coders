/**
 * @author marcotulio
 */
function CHDefinitions(utils){
	
	this.utils = utils;
	
    this.add = function(){
        this.uiEditable(true);
        this.uiClean();
        this.utils.getElement("definition-label").label = "#Nova";
        this.utils.getElement("new-definition-button").disabled = true;
        
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
    }
    
    this.save = function(){
        var nameTextBox = this.utils.getElement("definition-name");
        var name = nameTextBox.value;
        name = this.utils.trim(name);
        if (name == "") {
            alert("Preencha o nome da definição");
            return;
        }
        var list = this.utils.getElement("definition-list");
        //TODO - obter ID antes de adicionar na lista
        var itemID = name;
        var itemLabel = name + "ID";
        var item = list.appendItem(itemLabel, itemID);
        
        //Put definition(or not) in the includes list
        var includeList = this.utils.getElement("includes");
        var elements = includeList.getElementsByAttribute("value", itemID);
        var includable = this.utils.getElement("includable").checked;
        if (elements.length == 0 && includable) {
            //Should include
            var includeItem = includeList.appendItem(itemLabel, itemID);
            includeItem.setAttribute("type", "checkbox");
        }
        else 
            if (elements.length == 1 && !includable) {
                //Should remove
                includeList.removeChild(elements.item(0));
            }
        
        this.uiEditable(false);
        this.utils.getElement("new-definition-button").disabled = false;
        
        list.selectItem(item);
        list.ensureElementIsVisible(item);
    }
    
    this.selected = function(item){
        var label = this.utils.trim(item.label);
        var value = this.utils.trim(item.value);
        
        var showInMenu = true;
        var includable = false;
        
        var content = "Content: " + label + " value: " + value;
        
        this.utils.getElement("content").value = content;
        this.utils.getElement("show-in-menu").checked = showInMenu;
        this.utils.getElement("includable").checked = includable;
        this.utils.getElement("definition-label").label = "#Editar";
        
        this.utils.getElement("delete-definition-button").disabled = false;
        this.utils.getElement("edit-definition-button").disabled = false;
    }
    
    this.edit = function(){
        this.uiEditable(true);
    }
    
    this.cancel = function(){
        this.uiEditable(false);
        this.uiClean();
        this.utils.getElement("definition-label").label = "#Selecione a definição na listagem";
        this.utils.getElement("new-definition-button").disabled = false;
    }
    
    this.uiClean = function(){
        this.utils.getElement("definition-name").value = "";
        this.utils.getElement("content").value = "";
        this.utils.getElement("show-in-menu").checked = true;
        this.utils.getElement("includable").checked = true;
        this.utils.getElement("includes").clearSelection();
        var includes = this.utils.getElement("includes");
        includes.clearSelection();
        var nroElements = this.utils.getElement("includes").getRowCount();
        for (var i = 0; i < nroElements; i++) {
            var item = includes.getItemAtIndex(i);
            item.checked = false;
        }
    }
    
    this.uiEditable = function(bool){
        this.utils.getElement("definition-name").disabled = !bool;
        this.utils.getElement("definition-name-label").disabled = !bool;
        this.utils.getElement("content").disabled = !bool;
        this.utils.getElement("show-in-menu").disabled = !bool;
        this.utils.getElement("includable").disabled = !bool;
        this.utils.getElement("includes").disabled = !bool;
        this.utils.getElement("save-definition-button").disabled = !bool;
        this.utils.getElement("edit-definition-button").disabled = !bool;
        this.utils.getElement("cancel-definition-button").disabled = !bool;
        this.utils.getElement("delete-definition-button").disabled = !bool;
    }
}
