(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "firstName",
            alias: "First Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lastName",
            alias: "Last Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "teamId",
            alias: "Team ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "playerId",
            alias: "Player ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "dateOfBirth",
            alias: "DOB",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "startNBA",
            alias: "NBA Start Year",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "active",
            alias: "Active in roster?",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "pos",
            alias: "Position",
            dataType: tableau.dataTypeEnum.string
        } 
        ];

        var tableSchema = {
            id: "NBA2019Players",
            alias: "NBA 2019 Players",
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

        $.getJSON("https://api-nba-v1.p.rapidapi.com/players/league/standard/", function(resp) {
            var feat = resp.api.players,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "firstName": feat[i].firstName,
                    "lastName": feat[i].lastName,
                    "teamId": feat[i].teamId,
                    "playerId": feat[i].playerId,
                    "dateOfBirth":feat[i].dateOfBirth,
                    "startNBA": feat[i].startNba,
                    "active": feat[i].leagues.standard.active,
                    "pos":feat[i].leagues.standard.pos
                    
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
