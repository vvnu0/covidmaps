	let selectedState = "CA";
	
	var stateMap;
        function initStateMap() {
		stateMap = new google.maps.Map(document.getElementById('stateMap'), {
		zoom: 5,
		center: {
		    lat: 37.0902,
		    lng: -95.7129
		}
	    });
	    map.data.loadGeoJson('https://raw.githubusercontent.com/nairvishnumail/covidmaps/main/states.json');
        }

        function callMe() {
           selectedState = document.getElementById("stateid").value;
           drawChart();
        }

	function getPastDate(days) {
	    currentDate = new Date();
	    currentDate.setDate(currentDate.getDate() - days);
	    const offset = currentDate.getTimezoneOffset();
	    currentDate = new Date(currentDate.getTime() - (offset*60*1000));
	    return currentDate.toISOString().split('T')[0];
	}
	

	function getChartData() {
	    var xmlhttp = new XMLHttpRequest();
	    var query = "https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=" + getPastDate(1) + "T00:00:00.000"

	    xmlhttp.open("GET", query, false);
	    xmlhttp.send();
	    return JSON.parse(xmlhttp.responseText);
	}
	
	function drawChart() {
	    var stateJsonData= getChartData();
	    var stateCaseData = [];
	    var stateDeathData = [];
	    var stateTotalCaseData = [];
	    var stateTotalDeathData = [];
	    var stateTableData = [];
		
	    var date = getPastDate(1);
	    	
	    if (stateJsonData.length > 0) {
		var stateTableColHead = ['Date', 'State', 'Total Confirmed Cases', 'Total Deaths', 'New Confirmed Cases', 'New Deaths'];
		stateTableData.push(stateTableColHead );
		    
		var stateCaseColHead = ['State', 'New Confirmed'];
		stateCaseData.push(stateCaseColHead); 
		 
		var stateDeathColHead = ['State', 'New Deaths'];
		stateDeathData.push(stateDeathColHead);
		    
		var stateTotalCaseColHead = ['State', 'Total Confirmed'];
   		stateTotalCaseData.push(stateTotalCaseColHead);
		   
		var stateTotalDeathColHead = ['State', 'Total Deaths'];
   		stateTotalDeathData.push(stateTotalDeathColHead);
	    
		stateJsonData.forEach(function(row) {
                    var stateName = getFullStateName(row['state']);
                    var newCase = parseInt(row['new_case']);
		    var deaths = parseInt(row['new_death']);
		    var totalCase = parseInt(row['tot_cases']);
		    var totalNumDeaths = parseInt(row['tot_death']);
			
		    if (stateName !== "") {
	   
			    var caseLine = []; 
			    caseLine.push(stateName);
			    caseLine.push(newCase<0?0:newCase);
			    stateCaseData.push(caseLine);
		    
			    var deathLine = [];
			    deathLine.push(stateName);
			    deathLine.push(deaths<0?0:deaths);
			    stateDeathData.push(deathLine);

			    var totalCaseLine =[];
			    totalCaseLine.push(stateName);
			    totalCaseLine.push(totalCase<0?0:totalCase); 
			    stateTotalCaseData.push(totalCaseLine);

			    var lineDeathRow =[];
			    lineDeathRow.push(stateName);
			    lineDeathRow.push(totalNumDeaths<0?0:totalNumDeaths);
			    stateTotalDeathData.push(lineDeathRow);

			    if (selectedState == row['state']) {
				var tableRow = [];
				tableRow.push(date)
				tableRow.push(stateName)
				tableRow.push(totalCase<0?0:totalCase);
				tableRow.push(totalNumDeaths<0?0:totalNumDeaths);
				tableRow.push(newCase<0?0:newCase);
				tableRow.push(deaths<0?0:deaths);
				stateTableData.push(tableRow);
			    }
                      } 
		});


	    var table = google.visualization.arrayToDataTable(stateTableData);
	    var tableData = new google.visualization.Table(document.getElementById('stateTable'));	
	    tableData.draw(table, {
		    showRowNumber: true,
	    }); 
		
	    var case_data = google.visualization.arrayToDataTable(stateCaseData);
	    var caseChart = new google.visualization.ColumnChart(document.getElementById("stateCase"));
	    caseChart.draw(case_data, {
		width: 1500,
		height: 800,
		title: "State by State Comparison of New Cases",
                hAxis:{
                        title: 'States',
                        gridlines: { count: 50 },
			showTextEvery:1,
			slantedText:true,
			slantedTextAngle:90,
			},
	    });
	
	    var deathData = google.visualization.arrayToDataTable(stateDeathData);
	    var deathChart = new google.visualization.ColumnChart(document.getElementById("stateDeath")); 
	    deathChart.draw(deathData, {
		width: 1500,
		height: 800,
		colors: ['#a52714'],
		title: "State by State Comparison of New Cases",
                hAxis:{
                        title: 'States',
                        gridlines: { count: 50 },
			showTextEvery:1,
			slantedText:true,
			slantedTextAngle:90,
			},
	    });	
		
	    var totalCaseData = google.visualization.arrayToDataTable(stateTotalCaseData);
 	    var totalCaseChart = new google.visualization.ColumnChart(document.getElementById("stateTotalCase"));
    	    totalCaseChart.draw(totalCaseData, {
		width: 1500,
		height: 800,
		title: "State by State Comparison of Total Cases",
                hAxis:{
                        title: 'States',
                        gridlines: { count: 50 },
			showTextEvery:1,
			slantedText:true,
			slantedTextAngle:90,
			},
	    });
	
	    var totalDeathData = google.visualization.arrayToDataTable(stateTotalDeathData);
 	    var totalDeathChart = new google.visualization.ColumnChart(document.getElementById("stateTotalDeath"));
    	    totalDeathChart.draw(totalDeathData, {
		width: 1500,
		height: 800,
		colors: ['#a52714'],
		title: "State by State Comparison of Total Cases",
                hAxis:{
                        title: 'States',
                        gridlines: { count: 50 },
			showTextEvery:1,
			slantedText:true,
			slantedTextAngle:90,
			},
	    });	 
	}
      }
      
