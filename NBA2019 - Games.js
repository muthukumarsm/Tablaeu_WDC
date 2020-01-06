(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "gameId",
            alias: "Game ID",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "arena",
            alias: "Arena Name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "city",
            alias: "City",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "seasonStage",
            alias: "Season (Regular/Playoffs)",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "visitingTeamId",
            alias: "Visiting Team ID",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "visitingTeamShortName",
            alias: "Visiting Team Short Name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "visitingTeamName",
            alias: "Visiting Team Name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "visitingTeamScore",
            alias: "Visiting Team Score",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "homeTeamId",
            alias: "Home Team ID",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "homeTeamShortName",
            alias: "Home Team Short Name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "homeTeamName",
            alias: "Home Team Name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "homeTeamScore",
            alias: "Home Team Score",
            dataType: tableau.dataTypeEnum.string
        }  
        ];

        var tableSchema = {
            id: "NBA2019GameData",
            alias: "NBA 2019 Game Analysis",
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

        $.getJSON("https://api-nba-v1.p.rapidapi.com/games/league/standard/2019", function(resp) {
            var feat = resp.api.games,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "gameId": feat[i].gameId,
                    "arena": feat[i].arena,
                    "city": feat[i].city,
                    "seasonStage": feat[i].seasonStage,
                    "visitingTeamId":feat[i].vTeam.teamId,
                    "visitingTeamShortName": feat[i].vTeam.shortName,
                    "visitingTeamName": feat[i].vTeam.fullName,
                    "visitingTeamScore":feat[i].vTeam.score.points,
                    "homeTeamId":feat[i].hTeam.teamId,
                    "homeTeamShortName": feat[i].hTeam.shortName,
                    "homeTeamName": feat[i].hTeam.fullName,
                    "homeTeamScore":feat[i].hTeam.score.points
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
            tableau.connectionName = "NBA 2019 Games Analysis"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
