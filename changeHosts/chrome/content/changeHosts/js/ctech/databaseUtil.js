/**
 * Database utilities
 * 
 * @author marcotulio
 */
function CTechDatabaseUtil(logger) {
    var file = "changeHosts.sqlite";
    var mDBConn = null;
	this.logger = logger;
    
    this.init = function(){
        var db = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
        db.append("changeHosts.sqlite");
        this.mDBConn = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService).openDatabase(db);
    }
    
    this.getConnection = function(){
        if (this.mDBConn == null) {
            this.init();
        }
        return this.mDBConn;
    }
    
    this.assync = function(sql, param){
        var conn = this.getConnection();
        var statement = conn.createStatement(sql);
        if (param) {
            for (var m = 1, arg = null; arg = arguments[m]; m++) {
                this.bind(statement, m - 1, arg);
            }
        }
        try {
            statement.executeAsync({
                handleResult: function(aResultSet){
                    this.logger.info(aResultSet);
                },
                handleError: function(aError){
                    this.logger.error("Error executing select: " + sql + ". Error: " + aError);
                },
                handleCompletion: function(aReason){
                    if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                        this.logger.info("Query stopped unexpectedly: " + aReason);
                    }
                }
            });
        }
        finally {
            statement.reset();
        }
    }
    
    this.doSQL = function(sql, param){
        var conn = this.getConnection();
        var ourTransaction = false;
        if (conn.transactionInProgress) {
            ourTransaction = true;
            conn.beginTransactionAs(conn.TRANSACTION_DEFERRED);
        }
        var statement = conn.createStatement(sql);
        //Check if has more than one parameter (sql)
        if (arguments.length > 1) {
            //Starts at 1 because first param is sql by youself
            for (var m = 1; m < arguments.length; m++) {
                this.bind(statement, m - 1, arguments[m]);
            }
        }
        try {
            var dataset = [];
            //Execute statement, if it is a UPDATE or something without a result, then nothing gonna happen with dataset
            while (statement.executeStep()) {
                var row = [];
                for (var i = 0, k = statement.columnCount; i < k; i++) {
                    row[statement.getColumnName(i)] = statement.getUTF8String(i);
                }
                dataset.push(row);
            }
        }
        finally {
            statement.reset();
        }
        if (ourTransaction) {
            conn.commitTransaction();
        }
        return dataset;
    }
    
    this.bind = function(statement, index, value){
        this.logger.debug("Binding: " + value + " at index: " + index);
        if (value === undefined) {
            throw "Attempted to bind undefined parameter '" + name + "'";
        }
        else {
            if (value === null) {
                statement.bindNullParameter(index);
            }
            else {
                switch (typeof value) {
                    case "string":
                        statement.bindStringParameter(index, value);
                        break;
                    case "number":
                        statement.bindInt32Parameter(index, value);
                        break;
                    case "boolean":
                        statement.bindInt32Parameter(index, value ? 1 : 0);
                        break;
                    default:
                        throw "Unknown value type '" + typeof value + "' for value '" + value + "'";
                }
            }
        }
    }
	
	this.init();
}
