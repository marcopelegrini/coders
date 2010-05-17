function CHDao(preferences){
    this.log = new CTechLog(preferences);
    this.sqlite = new CTechDatabaseUtil(this.log);
    
    //Named queries:
    var dropDBQuery = 'DROP TABLE IF EXISTS definitions;';
    var createDBQuery = 'CREATE TABLE IF NOT EXISTS definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, selected INTEGER NOT NULL, show INTEGER NOT NULL, content TEXT);';
    var insertHostQuery = 'INSERT INTO definitions(name, selected, show, content) VALUES(?1, ?2, ?3, ?4);';
    var updateHostQuery = 'UPDATE definitions SET name = ?2, show = ?3, content = ?4 WHERE id = ?1';
    var listHostsQuery = 'SELECT id, name, selected, show, content FROM definitions';
    var listHostsToShowQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE show = 1';
    var findHostQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE id = ?1';
    var deleteHostQuery = 'DELETE FROM definitions WHERE id = ?1';
    var cleanHostSelectionQuery = 'UPDATE definitions SET selected = 0 WHERE id != ?1';
    var selectHostQuery = 'UPDATE definitions SET selected = 1 WHERE id = ?1';
    var getHostContentQuery = 'SELECT content FROM definitions WHERE id = ?1';
    
    // creating a DB:
    this.createDB = function(){
        this.sqlite.assync(dropDBQuery);
        this.sqlite.assync(createDBQuery);
    }
    
    this.saveNewHost = function(name, selected, show, content){
        this.log.debug("Saving new host: " + name + " Selected: " + selected + " Show: " + show + " Content: \n" + content);
        this.sqlite.doSQL(insertHostQuery, name, selected, show, content);
        return this.sqlite.getConnection().lastInsertRowID;
    }
    
    this.updateHost = function(id, name, show, content){
        this.log.debug("Updating host: " + id + " Name:" + name + " Show: " + show + " Content: \n" + content);
        this.sqlite.doSQL(updateHostQuery, id, name, show, content);
        return true;
    }
    
    this.list = function(){
        var list = this.sqlite.doSQL(listHostsQuery);
        var hosts = new Array();
        for (var j = 0; j < list.length; j++) {
            var row = list[j];
            hosts[j] = new Definition(row['id'], row['name'], row['show'], row['selected'], row['content'])
        }
        return hosts;
    }
    
    this.listToShow = function(){
        var list = this.sqlite.doSQL(listHostsToShowQuery);
        var hosts = new Array();
        for (var j = 0; j < list.length; j++) {
            var row = list[j];
            hosts[j] = new Definition(row['id'], row['name'], row['show'], row['selected'], row['content'])
        }
        return hosts;
    }
    
    this.findHost = function(id){
        this.log.debug("Finding host: " + id);
        var hosts = this.sqlite.doSQL(findHostQuery, id);
        var host = hosts.length > 0 ? hosts[0] : null;
        if (host) {
            return new Definition(host['id'], host['name'], host['show'], host['selected'], host['content']);
        }
        return null;
    }
    
    this.deleteHost = function(id){
        this.log.debug("Deleting host: " + id);
        this.sqlite.doSQL(deleteHostQuery, id);
        return true;
    }
    
    this.selectHost = function(id){
        this.log.debug("Selecting host: " + id);
        this.sqlite.doSQL(cleanHostSelectionQuery, id);
        this.sqlite.doSQL(selectHostQuery, id);
        
        return true;
    }
    
    this.getHostContent = function(id){
        this.log.debug("Getting host content: " + id);
        var contents = this.sqlite.doSQL(getHostContentQuery, id);
        var content = contents.length > 0 ? contents[0] : null;
        if (content) {
            return content['content'];
        }
        return null;
    }
}
