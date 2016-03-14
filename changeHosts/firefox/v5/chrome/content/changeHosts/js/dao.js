/**
 * @author marcotulio
 */
(function(){

    coders.ns("coders.changeHosts").dao = {

        ctx: coders.changeHosts.applicationContext,

        selectAllConfigsQuery: "SELECT path, color, hideFromStatus FROM hosts_config;",

        setContext: function(applicationContext){
            this.ctx = applicationContext;
        },

        // Creating DB:
        dropHostsConfigQuery: "DROP TABLE IF EXISTS hosts_config;",
        createHostsConfigQuery: "CREATE TABLE IF NOT EXISTS hosts_config (path TEXT PRIMARY KEY, color TEXT, hideFromStatus INTEGER NOT NULL DEFAULT 0);",
        dropRegexConfigQuery: "DROP TABLE IF EXISTS regex_config;",
        createRegexConfigQuery: "CREATE TABLE IF NOT EXISTS regex_config (regex TEXT PRIMARY KEY, color TEXT);",

        createDB: function(){
            this.ctx.databaseUtils.assync(this.dropHostsConfigQuery);
            this.ctx.databaseUtils.assync(this.createHostsConfigQuery);
            this.ctx.databaseUtils.assync(this.dropRegexConfigQuery);
            this.ctx.databaseUtils.assync(this.createRegexConfigQuery);
        },

        insertConfigQuery: "INSERT INTO hosts_config (path, color, hideFromStatus) values (?1, ?2, ?3);",
        upsertConfigQuery: "INSERT OR REPLACE INTO hosts_config (path, color, hideFromStatus) VALUES (?1, ?2, ?3);",
        saveOrUpdateConfig: function(path, color, hideFromStatus){
            this.ctx.databaseUtils.doSQL(this.upsertConfigQuery, path, color, hideFromStatus);
            return this.ctx.databaseUtils.getLastInsertedRowID();;
        },

        upsertColorConfigQuery: "INSERT OR REPLACE INTO hosts_config (path, color, hideFromStatus) \
            VALUES ( \
                    ?1, \
                    ?2,  \
                    (SELECT hideFromStatus from hosts_config WHERE path = ?1));",
        saveOrUpdateConfigColor: function(path, color){
            this.ctx.databaseUtils.doSQL(this.upsertColorConfigQuery, path, color);
            return this.ctx.databaseUtils.getLastInsertedRowID();;
        },

        clearHostsConfigColorQuery: "INSERT OR REPLACE INTO hosts_config (path, color, hideFromStatus) \
            VALUES ( \
                    ?1, \
                    null,  \
                    (SELECT hideFromStatus from hosts_config WHERE path = ?1));",
        clearHostsConfigColor: function(path){
            this.ctx.databaseUtils.doSQL(this.clearHostsConfigColorQuery, path);
        },

        findHostsConfigQuery: "SELECT path, color, hideFromStatus FROM hosts_config WHERE path = ?1;",
        findHostsConfig: function(path){
            var resultSet = this.ctx.databaseUtils.doSQL(this.findHostsConfigQuery, path);
            if (resultSet && resultSet.length > 0){
                var row = resultSet[0];
                return new coders.changeHosts.HostsConfig(row['path'], row['color'], row['hideFromStatus']);
            }
            return null;
        },

        upsertRegexConfigQuery: "INSERT OR REPLACE INTO regex_config (regex, color) VALUES (?1, ?2);",
        saveOrUpdateRegexConfig: function(regex, color){
            this.ctx.databaseUtils.doSQL(this.upsertRegexConfigQuery, regex, color);
            return this.ctx.databaseUtils.getLastInsertedRowID();
        },

        findRegexConfigQuery: "SELECT regex, color FROM regex_config WHERE regex = ?1",
        findRegexConfig: function(regex){
            var resultSet = this.ctx.databaseUtils.doSQL(this.findRegexConfigQuery, regex);
            if (resultSet && resultSet.length > 0 ){
                var row = resultSet[0];
                return new coders.changeHosts.RegexConfig(row['regex'], row['color'])
            }
            return null;
        },

        findAllRegexConfigQuery: "SELECT regex, color FROM regex_config ORDER BY rowid",
        findAllRegexConfig: function(){
            var resultSet = this.ctx.databaseUtils.doSQL(this.findAllRegexConfigQuery);
            var regexConfigs = new Array();
            for (var j = 0; j < resultSet.length; j++) {
                var row = resultSet[j];
                regexConfigs.push(new coders.changeHosts.RegexConfig(row['regex'], row['color']));
            }
            return regexConfigs;
        },

        removeRegexConfigQuery: "DELETE from regex_config WHERE regex = ?1",
        removeRegexConfig: function(regex){
            this.ctx.databaseUtils.doSQL(this.removeRegexConfigQuery, regex);
            return true;
        },

        //OLD Database
        dropDefinitionsQuery: "DROP TABLE IF EXISTS definitions;",
        dropOldDatabase: function(){
            this.ctx.databaseUtils.assync(this.dropDefinitionsQuery);
        },

        listHostsQuery: "SELECT id, name, selected, show, content, color, ordering FROM definitions ORDER BY ordering",
        listDefinitions: function(){
            var resultSet = this.ctx.databaseUtils.doSQL(this.listHostsQuery);
            var hosts = new Array();
            for (var j = 0; j < resultSet.length; j++) {
                var row = resultSet[j];
                hosts[j] = this.newHostFromRow(row);
            }
            return hosts;
        },

        newHostFromRow: function(row){
            return new coders.changeHosts.Definition(row['id'], row['name'], row['show'], row['selected'], row['content'], row['color'], row['ordering']);
        }
    }
})();
