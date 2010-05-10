/**
 * @author marcotulio
 */
var CHDefinitions = {

    init: function(){
        this.preferences = new CTechPrefs(CHConstants.branchName, CHConstants.windowType, CHConstants.windowURI, CHConstants.windowOptions);
        this.log = new CTechLog(this.preferences);
        this.preferences.setLogger(this.log);
        this.utils = new CTechUtils();
        this.dao = new CHDao(this.preferences);
    },
    
    onLoad: function(){
        this.populateList();
    },
    
    populateList: function(){
        var hosts = this.dao.list();
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            this.addItemToList(host.id, host.name);
        }
    },
    
    addItemToList: function(id, name){
        var list = this.utils.getElement("definition-list");
        return list.appendItem(name, id);
    },
    
    add: function(){
        this.uiEditable(true);
        this.uiClean();
        this.utils.getElement("definition-label").label = "#Nova";
        
        this.utils.getElement("new-definition-button").disabled = true;
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        this.utils.getElement("show-in-menu").checked = true;
        
        this.utils.getElement("definition-list").disabled = true;
    },
    
    save: function(){
        var nameTextBox = this.utils.getElement("definition-name");
        var name = nameTextBox.value;
        name = this.utils.trim(name);
        if (name == "") {
            alert("Preencha o nome da definição");
            return;
        }
        var show = this.utils.getElement("show-in-menu").checked;
        var content = this.utils.getElement("content").value;
        var id = this.dao.saveNewHost(name, false, show, content);
        if (id) {
            var item = this.addItemToList(id, name);
            
            this.uiEditable(false);
            this.utils.getElement("new-definition-button").disabled = false;
            
            var list = this.utils.getElement("definition-list");
            list.selectItem(item);
            list.ensureElementIsVisible(item);
            list.disabled = false;
        }
        else {
            alert("#Erro ao salvar definição.");
        }
    },
    
    del: function(){
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        var list = this.utils.getElement("definition-list");
        var item = list.getItemAtIndex(list.selectedIndex);
        
        if (item && this.dao.deleteHost(item.value)) {
            list.removeItemAt(list.selectedIndex);
            item = list.getItemAtIndex(0);
            if (item) {
                list.selectItem(item);
            }
            this.uiClean();
        }
        else {
            alert("#Erro ao excluir definição");
        }
        
    },
    
    selected: function(item){
        if (!item) {
            return;
        }
        var host = this.dao.findHost(this.utils.trim(item.value));
        
        if (host) {
            this.utils.getElement("definition-label").label = "#Editar";
            
            this.utils.getElement("content").value = host.content;
            this.utils.getElement("show-in-menu").checked = host.show;
            this.utils.getElement("definition-name").value = host.name;
            this.utils.getElement("definition-in-use").checked = host.selected;
            this.utils.getElement("delete-definition-button").disabled = false;
            this.utils.getElement("edit-definition-button").disabled = false;
        }
        else {
            alert("#Registro não encontrado.")
        }
    },
    
    edit: function(){
        this.utils.getElement("definition-list").disabled = true;
        
        this.utils.getElement("new-definition-button").disabled = true;
        this.utils.getElement("delete-definition-button").disabled = true;
        this.utils.getElement("edit-definition-button").disabled = true;
        
        this.uiEditable(true);
    },
    
    cancel: function(){
        this.uiEditable(false);
        this.uiClean();
        this.utils.getElement("definition-label").label = "#Selecione a definição na listagem";
        this.utils.getElement("new-definition-button").disabled = false;
        
        var list = this.utils.getElement("definition-list");
        list.disabled = false;
        list.selectItem(list.getSelectedItem());
    },
    
    uiClean: function(){
        this.utils.getElement("definition-name").value = "";
        this.utils.getElement("definition-in-use").checked = false;
        this.utils.getElement("content").value = "";
        this.utils.getElement("show-in-menu").checked = false;
    },
    
    uiEditable: function(bool){
        this.utils.getElement("definition-name").disabled = !bool;
        this.utils.getElement("definition-name-label").disabled = !bool;
        this.utils.getElement("content").disabled = !bool;
        this.utils.getElement("show-in-menu").disabled = !bool;
        this.utils.getElement("save-definition-button").disabled = !bool;
        this.utils.getElement("cancel-definition-button").disabled = !bool;
    }
};
//Construct
CHDefinitions.init();
