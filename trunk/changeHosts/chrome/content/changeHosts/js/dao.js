/**
 * DAO for Change Hosts`s tables
 */
if (!coders) 
    var coders = {};
if (!coders.changeHosts) 
    coders.changeHosts = {};

(function(){
    
    coders.changeHosts.dao = function(preferences){
    
		this.ch = coders.changeHosts;
		this.utils = coders.utils;
		this.sqlite = this.utils.db;
		this.log = new this.utils.log(preferences);
	
        //Named queries:
        this.dropDBQuery = 				"DROP TABLE IF EXISTS definitions;";
        this.createDBQuery = 			"CREATE TABLE IF NOT EXISTS definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, selected INTEGER NOT NULL, show INTEGER NOT NULL, content TEXT, color TEXT, ordering INTEGER NOT NULL);";
        this.insertHostQuery = 			"INSERT INTO definitions(name, selected, show, content, color, ordering) VALUES(?1, ?2, ?3, ?4, ?5);";
        this.updateHostQuery = 			"UPDATE definitions SET name = ?2, show = ?3, content = ?4, color = ?5 WHERE id = ?1";
        this.listHostsQuery = 			"SELECT id, name, selected, show, content, color, ordering FROM definitions ORDER BY ordering";
        this.listHostsToShowQuery = 	"SELECT id, name, selected, show, content, color, ordering FROM definitions WHERE show = 1 ORDER BY ordering";
        this.findHostQuery = 			"SELECT id, name, selected, show, content, color, ordering FROM definitions WHERE id = ?1";
        this.deleteHostQuery = 			"DELETE FROM definitions WHERE id = ?1";
        this.deleteAllHostsQuery = 		"DELETE FROM definitions";
        this.cleanHostSelectionQuery = 	"UPDATE definitions SET selected = 0 WHERE id != ?1";
        this.selectHostQuery = 			"UPDATE definitions SET selected = 1 WHERE id = ?1";
        this.getHostContentQuery = 		"SELECT content FROM definitions WHERE id = ?1";

        //Version
        this.createVersionStructureQuery = 	"CREATE TABLE IF NOT EXISTS version (version INTEGER NOT NULL);";
        this.inserDefaultVersion = 			"INSERT INTO version(version) VALUES (?1);";
        this.getVersionQuery = 				"SELECT version FROM version LIMIT 1";
        this.updateVersionQuery = 			"UPDATE version SET version = ?1";
        
        //Order
        this.addOrderStructureQuery = 		"ALTER TABLE definitions ADD COLUMN ordering INTEGER;";
        this.updateHostOrderQuery = 		"UPDATE definitions SET ordering = ?2 WHERE id = ?1";
        this.findHostByOrderQuery =			"SELECT id, name, selected, show, content, ordering FROM definitions WHERE ordering = ?1";
        this.getDefinitionLastOrderQuery = 	"SELECT ordering FROM definitions ORDER BY ordering DESC LIMIT 1";
        
        //Host color
        this.addHostColorStructureQuery = 		"ALTER TABLE definitions ADD COLUMN color TEXT;";
        this.updateHostColorQuery = 			"UPDATE definitions SET color = ?2 WHERE id = ?1";
        
        // creating a DB:
        this.createDB = function(appVersion){
            this.sqlite.assync(this.dropDBQuery);
            this.sqlite.assync(this.createDBQuery);
            this.createVersionStructure(appVersion);
        }
        
        this.saveNewHost = function(name, selected, show, content, color, order){
            this.log.debug("Saving new host: " + name + " Selected: " + selected + " Show: " + show  + " Color:" + color + " Order: " + order + " Content: \n" + content );
            if (!order){
            	order = this.getDefinitionLastOrder()+1;
            }
            this.sqlite.doSQL(this.insertHostQuery, name, selected, show, content, color, order);
            return this.sqlite.getConnection().lastInsertRowID;
        }
        
        this.updateHost = function(id, name, show, content, color){
            this.log.debug("Updating host: " + id + " Name:" + name + " Show: " + show + " Color:" + color + " Content: \n" + content);
            this.sqlite.doSQL(this.updateHostQuery, id, name, show, content, color);
            return true;
        }
        
        this.updateHostOrder = function(id, order){
        	this.log.debug("Updating host: " + id + " with Order: " + order);
        	this.sqlite.assync(this.updateHostOrderQuery, id, order);
        } 
        	
        this.list = function(){
            var resultSet = this.sqlite.doSQL(this.listHostsQuery);
            return this.listResult(resultSet);
        }
        
        this.listToShow = function(){
            var resultSet = this.sqlite.doSQL(this.listHostsToShowQuery);
            return this.listResult(resultSet);
        }
        
        this.findHost = function(id){
            var resultSet = this.sqlite.doSQL(this.findHostQuery, id);
            return this.uniqueResult(resultSet);
        }
        
        this.findHostByOrder = function(order){
            var resultSet = this.sqlite.doSQL(this.findHostByOrderQuery, order);
            return this.uniqueResult(resultSet);
        }
        
        this.uniqueResult = function(resultSet){
            var row = resultSet.length > 0 ? resultSet[0] : null;
            if (row) {
                return this.newHostFromRow(row);
            }
            return null;        	
        }
        
        this.listResult = function(resultSet){
            var hosts = new Array();
            for (var j = 0; j < resultSet.length; j++) {
                var row = resultSet[j];
                hosts[j] = this.newHostFromRow(row);
            }
            return hosts;
        }
        
        this.newHostFromRow = function(row){
        	return new this.ch.Definition(row['id'], row['name'], row['show'], row['selected'], row['content'], row['color'], row['ordering']);
        }
        
        this.getDefinitionLastOrder = function(){
            var resultSet = this.sqlite.doSQL(this.getDefinitionLastOrderQuery);
            var row = resultSet.length > 0 ? resultSet[0] : null;
            if (row) {
                return parseInt(row['ordering']);
            }
            return null;  
        }
        
        this.deleteHost = function(id){
            this.log.debug("Deleting host: " + id);
            this.sqlite.doSQL(this.deleteHostQuery, id);
            this.reorderHosts();
            return true;
        }
        
        this.reorderHosts = function(){
        	var hosts = this.list();
        	var order = 1;
            for (var i = 0; i < hosts.length; i++) {
                var host = hosts[i];
                this.updateHostOrder(host.id, order);
                order++;
            }
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
        
        this.getVersion = function(){
            var resultSet = this.sqlite.doSQL(this.getVersionQuery);
            var row = resultSet.length > 0 ? resultSet[0] : null;
            if (row) {
                return parseInt(row['version']);
            }
            return null;          	
        }
        
        this.migrateVersion = function(dbVersion, appVersion){
        	if(!dbVersion){
        		this.log.info("Creating Version Structure on ChangeHosts. dbVersion: " + dbVersion + " appVersion: " + appVersion);
        		this.createVersionStructure(appVersion);
        		//Structure
        		this.addOrderStructure();
        		this.addHostColorStructure();
        		//Data
        		this.updateVersion(appVersion);
        		this.reorderHosts();
        	}else{
        		if(dbVersion < appVersion){
        			this.log.info("Updating ChangeHosts from " + dbVersion + " to " + appVersion);
        			switch(dbVersion){
        				case 2:
        					this.addHostColorStructure();
        					this.updateVersion(appVersion);
        					break;
	        			default:	
	        				throw "There updated version yet. Please reinstall ChangeHost.";
        			}
        			return true;
        		}
        	}
        }
        
        // Version
        this.createVersionStructure = function(appVersion){
        	this.sqlite.assync(this.createVersionStructureQuery);
        	this.sqlite.assync(this.inserDefaultVersion, appVersion);
        }
        
        this.updateVersion = function(version){
        	this.sqlite.assync(this.updateVersionQuery, version);
        }
        
        // Order
        this.addOrderStructure = function(){
        	this.sqlite.doSQL(this.addOrderStructureQuery);
        }
        
        this.orderUp = function(id){
        	var current = this.findHost(id);
        	var above = this.findHostByOrder(parseInt(current.order)-1);
        	this.updateHostOrder(current.id, above.order);
        	this.updateHostOrder(above.id, current.order);
        }
        
        this.orderDown = function(id){
        	var current = this.findHost(id);
        	var under = this.findHostByOrder(parseInt(current.order)+1);
        	this.updateHostOrder(current.id, under.order);
        	this.updateHostOrder(under.id, current.order);        	
        }
        
        // Host color
        this.addHostColorStructure = function(){
        	this.sqlite.doSQL(this.addHostColorStructureQuery);
        }
    };
})();
