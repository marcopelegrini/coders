/**
 * @author marcotulio
 */
var CHDefinitions = {
    add: function(){
        this.uiEditable(true);
        this.uiClean();
        Utils.getElement("definition-label").label = "#Nova";
        Utils.getElement("new-definition-button").disabled = true;
        
        Utils.getElement("delete-definition-button").disabled = true;
        Utils.getElement("edit-definition-button").disabled = true;
    },
    
    save: function(){
        var nameTextBox = Utils.getElement("definition-name");
        var name = nameTextBox.value;
        name = Utils.trim(name);
        if (name == "") {
            alert("Preencha o nome da definição");
            return;
        }
        var list = Utils.getElement("definition-list");
        //TODO - obter ID antes de adicionar na lista
        var itemID = name;
        var itemLabel = name + "ID";
        var item = list.appendItem(itemLabel, itemID);
        
        //Put definition(or not) in the includes list
        var includeList = Utils.getElement("includes");
        var elements = includeList.getElementsByAttribute("value", itemID);
        var includable = Utils.getElement("includable").checked;
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
        Utils.getElement("new-definition-button").disabled = false;
        
        list.selectItem(item);
        list.ensureElementIsVisible(item);
    },
    
    selected: function(item){
        var label = Utils.trim(item.label);
        var value = Utils.trim(item.value);
        
        var showInMenu = true;
        var includable = false;
        
        var content = "Content: " + label + " value: " + value;
        
        Utils.getElement("content").value = content;
        Utils.getElement("show-in-menu").checked = showInMenu;
        Utils.getElement("includable").checked = includable;
        Utils.getElement("definition-label").label = "#Editar";
        
        Utils.getElement("delete-definition-button").disabled = false;
        Utils.getElement("edit-definition-button").disabled = false;
    },
    
    edit: function(){
        this.uiEditable(true);
    },
    
    cancel: function(){
        this.uiEditable(false);
        this.uiClean();
        Utils.getElement("definition-label").label = "#Selecione a definição na listagem";
        Utils.getElement("new-definition-button").disabled = false;
    },
    
    uiClean: function(){
        Utils.getElement("definition-name").value = "";
        Utils.getElement("content").value = "";
        Utils.getElement("show-in-menu").checked = true;
        Utils.getElement("includable").checked = true;
        Utils.getElement("includes").clearSelection();
        var includes = Utils.getElement("includes");
        includes.clearSelection();
        var nroElements = Utils.getElement("includes").getRowCount();
        for (var i = 0; i < nroElements; i++) {
			var item = includes.getItemAtIndex(i);
        	item.checked = false;
        }
    },
    
    uiEditable: function(bool){
        Utils.getElement("definition-name").disabled = !bool;
        Utils.getElement("definition-name-label").disabled = !bool;
        Utils.getElement("content").disabled = !bool;
        Utils.getElement("show-in-menu").disabled = !bool;
        Utils.getElement("includable").disabled = !bool;
        Utils.getElement("includes").disabled = !bool;
        Utils.getElement("save-definition-button").disabled = !bool;
        Utils.getElement("edit-definition-button").disabled = !bool;
        Utils.getElement("cancel-definition-button").disabled = !bool;
        Utils.getElement("delete-definition-button").disabled = !bool;
    }
}
