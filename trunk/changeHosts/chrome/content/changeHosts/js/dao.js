
/**
 * DAO for Change Hosts`s tables
 */
if (!com) 
    var com = {};
if (!com.coders) 
    com.coders = {};
if (!com.coders.changeHosts) 
    com.coders.changeHosts = {};

(function(){
    
    com.coders.changeHosts.dao = function(preferences){
    
		this.ch = com.coders.changeHosts;
		this.utils = com.coders.utils;
		this.sqlite = this.utils.db;
		this.log = new this.utils.log(preferences);
	
        //Named queries:
        this.dropDBQuery = 'DROP TABLE IF EXISTS definitions;';
        this.createDBQuery = 'CREATE TABLE IF NOT EXISTS definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, selected INTEGER NOT NULL, show INTEGER NOT NULL, content TEXT);';
        this.insertHostQuery = 'INSERT INTO definitions(name, selected, show, content) VALUES(?1, ?2, ?3, ?4);';
        this.updateHostQuery = 'UPDATE definitions SET name = ?2, show = ?3, content = ?4 WHERE id = ?1';
        this.listHostsQuery = 'SELECT id, name, selected, show, content FROM definitions';
        this.listHostsToShowQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE show = 1';
        this.findHostQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE id = ?1';
        this.deleteHostQuery = 'DELETE FROM definitions WHERE id = ?1';
        this.deleteAllHostsQuery = 'DELETE FROM definitions';
        this.cleanHostSelectionQuery = 'UPDATE definitions SET selected = 0 WHERE id != ?1';
        this.selectHostQuery = 'UPDATE definitions SET selected = 1 WHERE id = ?1';
        this.getHostContentQuery = 'SELECT content FROM definitions WHERE id = ?1';
        
        // creating a DB:
        this.createDB = function(){
            this.sqlite.assync(this.dropDBQuery);
            this.sqlite.assync(this.createDBQuery);
        }
        
        this.saveNewHost = function(name, selected, show, content){
            this.log.debug("Saving new host: " + name + " Selected: " + selected + " Show: " + show + " Content: \n" + content);
            this.sqlite.doSQL(this.insertHostQuery, name, selected, show, content);
            return this.sqlite.getConnection().lastInsertRowID;
        }
        
        this.updateHost = function(id, name, show, content){
            this.log.debug("Updating host: " + id + " Name:" + name + " Show: " + show + " Content: \n" + content);
            this.sqlite.doSQL(this.updateHostQuery, id, name, show, content);
            return true;
        }
        
        this.list = function(){
            var list = this.sqlite.doSQL(this.listHostsQuery);
            var hosts = new Array();
            for (var j = 0; j < list.length; j++) {
                var row = list[j];
                hosts[j] = new this.ch.Definition(row['id'], row['name'], row['show'], row['selected'], row['content'])
            }
            return hosts;
        }
        
        this.listToShow = function(){
            var list = this.sqlite.doSQL(this.listHostsToShowQuery);
            var hosts = new Array();
            for (var j = 0; j < list.length; j++) {
                var row = list[j];
                hosts[j] = new this.ch.Definition(row['id'], row['name'], row['show'], row['selected'], row['content'])
            }
            return hosts;
        }
        
        this.findHost = function(id){
            this.log.debug("Finding host: " + id);
            var hosts = this.sqlite.doSQL(this.findHostQuery, id);
            var host = hosts.length > 0 ? hosts[0] : null;
            if (host) {
                return new this.ch.Definition(host['id'], host['name'], host['show'], host['selected'], host['content']);
            }
            return null;
        }
        
        this.deleteHost = function(id){
            this.log.debug("Deleting host: " + id);
            this.sqlite.doSQL(this.deleteHostQuery, id);
            return true;
        }
        
        this.deleteAllHosts = function(){
            this.log.debug("Deleting all hosts");
            this.sqlite.doSQL(this.deleteAllHostsQuery);
            return true;
        }
        
        this.selectHost = function(id){
            this.log.debug("Selecting host: " + id);
            this.sqlite.doSQL(this.cleanHostSelectionQuery, id);
            this.sqlite.doSQL(this.selectHostQuery, id);
            
            return true;
        }
        
        this.getHostContent = function(id){
            this.log.debug("Getting host content: " + id);
            var contents = this.sqlite.doSQL(this.getHostContentQuery, id);
            var content = contents.length > 0 ? contents[0] : null;
            if (content) {
                return content['content'];
            }
            return null;
        }
    };
})();
