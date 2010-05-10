function CHDao(preferences){
    this.log = new CTechLog(preferences);
    this.sqlite = new CTechDatabaseUtil(this.log);
    
    //Named queries:
    var dropDBQuery = 'DROP TABLE IF EXISTS definitions;';
    var createDBQuery = 'CREATE TABLE IF NOT EXISTS definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, selected INTEGER NOT NULL, show INTEGER NOT NULL, content TEXT);';
    var insertHostQuery = 'INSERT INTO definitions(name, selected, show, content) VALUES(?1, ?2, ?3, ?4);';
    var listHostsQuery = 'SELECT id, name, selected, show, content FROM definitions';
    var listHostsToShowQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE show = 1';
    var findHostQuery = 'SELECT id, name, selected, show, content FROM definitions WHERE id = ?1';
    var deleteHostQuery = 'DELETE FROM definitions WHERE id = ?1';
	var cleanHostSelectionQuery = 'UPDATE definitions SET selected = 0 WHERE id != ?1';
    var selectHostQuery = 'UPDATE definitions SET selected = 1 WHERE id = ?1';
    
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
		this.sqlite.assync(cleanHostSelectionQuery, id);
		this.sqlite.assync(selectHostQuery, id);
		
        return true;
    }
    
    // simple add record:
    function test_addRecord(){
        this.sqlite.doSQL(myInsertQuery);
    }
    
    // parameterized add record, add parameters as much as you want:	
    function test_addRecordParameterized(){
        // for example, adding 3 records:
        for (var i = 1; i < 4; i++) {
            this.sqlite.assync(myInsertQueryParameterized, 'book title' + i + '');
        }
    }
    
    // for SELECT, use this.sqlite.select() :
    
    // simple select:
    function test_Select(){
        var myArray1 = this.sqlite.doSQL(mySelectQuery);
        // Now you can loop through the array:
        for (var j = 0; j < myArray1.length; j++) {
            // change this as you wish:
            Log.info(myArray1[j]['title']);
        }
    }
    
    // select with bound parameters, add parameters as much as you want:
    function test_SelectParameterized(){
        var myArray1 = this.sqlite.doSQL(mySelectQueryParameterized, '1', 'book title1');
        // Now you can loop through the array:
        for (var j = 0; j < myArray1.length; j++) {
            // change this as you wish:
            Log.info(myArray1[j]['title']);
        }
    }
}
