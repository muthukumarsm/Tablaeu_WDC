(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "gameId",
            alias: "Game ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "teamId",
            alias: "Team ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "fastBreakPoints",
            alias: "Fast Break Points",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "pointsInPaint",
            alias: "Points In Paint",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "pointsOffTurnovers",
            alias: "Points Off Turnovers",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "points",
            alias: "Points",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "fgm",
            alias: "Field Goals Made",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "fga",
            alias: "Field Goals Against",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "fgp",
            alias: "Field Goals %",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "ftm",
            alias: "Free Throws Made",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "fta",
            alias: "Free Throws Against",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "ftp",
            alias: "Free Throws %",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "tpm",
            alias: "Three Points Made",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "tpa",
            alias: "Three Points Against",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "tpp",
            alias: "Three Points %",
            dataType: tableau.dataTypeEnum.float
        } , {
            id: "offReb",
            alias: "Offensive Rebounds",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "defReb",
            alias: "Defensive Rebounds",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "assists",
            alias: "Total Assists",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "pFouls",
            alias: "Personal Fouls",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "steals",
            alias: "Steals",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "turnovers",
            alias: "Turnovers",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "blocks",
            alias: "Blocks",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "plusMinus",
            alias: "+/-",
            dataType: tableau.dataTypeEnum.int
        }
        ];

        var tableSchema = {
            id: "NBA2019GameStatistics",
            alias: "NBA 2019 Game Statistics",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    
    $.ajaxSetup({
          headers : {
            'x-rapidapi-host' : 'api-nba-v1.p.rapidapi.com',
            'x-rapidapi-key' : 'd18cdeb3a2mshab6824adf713c9ep130fb2jsncca2d444588d'
          }          
        });
    
    myConnector.getData = function(table, doneCallback) {
 

					var tableData = [];
					var gameIDArray = [];
					
					var runReq = function() {
					
						$.ajax({ 
							
								url:"https://api-nba-v1.p.rapidapi.com/games/league/standard/2019",
								success:function (resp1) {
									var feat_games = resp1.api.games;
										for (var i1 = 0, len1 = 20; i1 < len1; i1++) {	
									
												   var gameIdValue = feat_games[i1].gameId; 
												   var seasonStage = feat_games[i1].seasonStage;
												   var gameStatus  = feat_games[i1].statusGame;
												   doneCallback(); 
												   // console.log(gameIdValue + "  " + seasonStage +  "  " + gameStatus);
												   if ((seasonStage == 1) && (gameStatus == "Finished")) {
												   		gameIDArray.push(gameIdValue);
													 }
										}			  
								},
								complete:function(resp) {
										for (var gameIDIndex = 0,gameIDLength = gameIDArray.length; gameIDIndex < gameIDLength; gameIDIndex++) {
											  var gameIdValueInURL = gameIDArray[gameIDIndex];
												var urlGameStats = "https://api-nba-v1.p.rapidapi.com/statistics/games/gameId/" + gameIdValueInURL;
											//	console.log("Game Statistics URL " + urlGameStats);	
											
												
												var feat_temp = [];
											
												$.ajax({
													url:urlGameStats,
													success:function(resp) {
														feat_temp = [];
														
														feat_temp.push(resp.api.statistics);
													},
													complete:function() {
														// var feat = resp.api.statistics;
									           
					        			    for (var i = 0, len = feat_temp.length; i < len; i++) {
					        			    		var feat = feat_temp[i];
					        			    		for (var j = 0,len_j = feat.length;j < len_j;j++) {
												    			// console.log("Table push" + feat[j].gameId);
												    			tableData = [];			
												    			tableData.push({
											                    "gameId": feat[j].gameId,
											                    "teamId": feat[j].teamId,
											                    "fastBreakPoints": feat[j].fastBreakPoints,
											                    "pointsInPaint": feat[j].pointsInPaint,
											                    "pointsOffTurnovers":feat[j].pointsOffTurnovers,
											                    "points": feat[j].points,
											                    "fgm": feat[j].fgm,
											                    "fga":feat[j].fga,
											                    "fgp": feat[j].fgp,
											                    "ftm":feat[j].ftm,							                    
											                    "fta":feat[j].fta,
											                    "ftp":feat[j].ftp,
											                    "tpm":feat[j].tpm,
											                    "tpa":feat[j].tpa,
											                    "tpp":feat[j].tpp,
											                    "offReb":feat[j].offReb,
											                    "defReb":feat[j].defReb,
											                    "assists":feat[j].assists,
											                    "pFouls":feat[j].pFouls,
											                    "steals":feat[j].steals,
											                    
											                    "turnovers":feat[j].turnovers,
											                    "blocks":feat[j].blocks,
											                    "plusMinus":feat[j].plusMinus
											            });													      
												    	  }						   						 
														}
														table.appendRows(tableData);
													}
													  
												});										   
	   								}	
										
								}	
					 	});
					 	doneCallback();  // newly introduced!
				 	};		
				runReq();
				// doneCallback(); 		 // New commented code!	
 		};
 		  
	  
    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "NBA 2019 Game Statistics"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
