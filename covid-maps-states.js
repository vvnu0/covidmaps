	let selectedState = "CA";
	
	var stateMap;
        function initStateMap() {
		stateMap = new google.maps.Map(document.getElementById('stateMap'), {
		zoom: 4,
		center: {
		    lat: 37.0902,
		    lng: -95.7129
		}
	    });
	    stateMap.data.loadGeoJson('https://raw.githubusercontent.com/nairvishnumail/covidmaps/main/states.json');
		
            stateMap.data.setStyle({
              fillColor: 'green',
              strokeWeight: 1
            });
		
	    var stateInfoWindow = new google.maps.InfoWindow();

	    stateMap.data.addListener('click', function(event) {
		let states_code = event.feature.getProperty("STUSPS");
		let state_name = event.feature.getProperty("NAME");
		selectedState = states_code;
		drawChart();
		    
		var forDays = 0;
		var mycases;
		do {
		    forDays = forDays+1;
		    mycases = getStateChartData(states_code, forDays);
		} while (mycases.length == 0);
		    
		let html = "State: " + state_name + " Total Cases: " + mycases[0].tot_cases;
		stateInfoWindow.setContent(html); // show the html variable in the infowindow
		stateInfoWindow.setPosition(event.latLng); // anchor the infowindow at the marker
		stateInfoWindow.setOptions({
		    pixelOffset: new google.maps.Size(0, -30)
		}); 
		stateInfoWindow.open(stateMap);
	    })
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

	function getStateChartData(stateCode, forDays) {
            var baseQuery = "https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=" + getPastDate(forDays) + "T00:00:00.000";
	    var xmlhttp = new XMLHttpRequest();
	    if (stateCode && stateCode !== "") {
		xmlhttp.open("GET", baseQuery+"&state="+stateCode, false);     
	    } else {
		xmlhttp.open("GET", baseQuery, false);
	    }
	    xmlhttp.send();
	    return JSON.parse(xmlhttp.responseText);
	}
	
	function drawChart() {
	    var stateJsonData;
	    var stateCaseData = [];
	    var stateDeathData = [];
	    var stateTotalCaseData = [];
	    var stateTotalDeathData = [];
	    var stateTableData = [];
	    
	    var forDays = 0;
		
	    // There is a chance that last day data is empty, if yes look for previous day's data until we find some
	    do {
		forDays = forDays + 1;
		stateJsonData = getStateChartData('',forDays)
		if (forDays > 30 ) {
		    console.log("No data available from source");
		    return; //There should be some data in the last 30 days, else just dont do anything
		}
	    } while (stateJsonData.length == 0);
		
	    var date = getPastDate(forDays);
	    
	    	
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
      
