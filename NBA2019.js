(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "city",
            alias: "Team City",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "fullName",
            alias: "Team Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "teamId",
            alias: "Team ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "shortName",
            alias: "Team Short name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "nickname",
            alias: "Team Nick Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "allStar",
            alias: "All Star Presence?",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "nbaFranchise",
            alias: "Is NBA Team?",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "confName",
            alias: "Conference",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "divName",
            alias: "Division",
            dataType: tableau.dataTypeEnum.string
        } 
        ];

        var tableSchema = {
            id: "NBA2019Data",
            alias: "NBA 2019 Team Analysis",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {

        $.ajaxSetup({
          headers : {
            'x-rapidapi-host' : 'api-nba-v1.p.rapidapi.com',
            'x-rapidapi-key' : 'd18cdeb3a2mshab6824adf713c9ep130fb2jsncca2d444588d'
          }
        });

        $.getJSON("https://api-nba-v1.p.rapidapi.com/teams/league/standard/", function(resp) {
            var feat = resp.api.teams,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "city": feat[i].city,
                    "fullName": feat[i].fullName,
                    "teamId": feat[i].teamId,
                    "shortName": feat[i].shortName,
                    "nickname":feat[i].nickname,
                    "shortName": feat[i].shortName,
                    "allStar": feat[i].allStar,
                    "nbaFranchise":feat[i].nbaFranchise,
                    "confName": feat[i].leagues.standard.confName,
                    "divName":feat[i].leagues.standard.divName
                    
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "NBA 2019 Analysis"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
