	let selectedCounty = "Alameda";
	
	function getPastDate(days) {
	    currentDate = new Date();
	    currentDate.setDate(currentDate.getDate() - days);
	    const offset = currentDate.getTimezoneOffset();
	    currentDate = new Date(currentDate.getTime() - (offset*60*1000));
	    return currentDate.toISOString().split('T')[0];
	}
	
	
	function getChartData() {
	    var xmlhttp = new XMLHttpRequest();
	    var query = "https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT * from \"926fd08f-cc91-4828-af38-bd45de97f8c3\" WHERE \"county\" LIKE '" + selectedCounty + "' AND \"date\" >='" + getPastDate(25) + "'"

	    xmlhttp.open("GET", query, false);
	    xmlhttp.send();
	    return JSON.parse(xmlhttp.responseText);
	}
	
	function drawChart() {
	    var myObj = getChartData();
	    var jsonData = myObj.result.records;
	    var caseChartData = [];
	    var deathChartData = [];
	    var lineCaseData = [];
	    var lineDeathData = [];
	    var tableData = [];
	
	    var tableDay = getPastDate(1);
	    	
	    if (jsonData.length > 0) {
		var tableColHead = ['Total Confirmed Cases', 'Total Deaths', 'New Confirmed Cases', 'New Deaths'];
		tableData.push(tableColHead);
		    
		var caseColHead = ['Date', 'New Confirmed'];
		caseChartData.push(caseColHead); 
		 
		var deathColHead = ['Date', 'New Deaths'];
		deathChartData.push(deathColHead);
		    
		var lineCaseColHead = ['Date', 'Total Confirmed'];
   		lineCaseData.push(lineCaseColHead);
		   
		var lineDeathColHead = ['Date', 'Total Deaths'];
   		lineDeathData.push(lineDeathColHead);
		    		    
		jsonData.forEach(function(row) {
		    var rowDate = row['date'].split('T')[0];
		    var newConfirmed = parseInt(row['newcountconfirmed']);
		    var newDeaths = parseInt(row['newcountdeaths']);
		    var totalConfirmed = parseInt(row['totalcountconfirmed']);
		    var totalDeaths = parseInt(row['totalcountdeaths']);
		   
		    var caseChartRow = []; 
		    caseChartRow.push(rowDate);
		    caseChartRow.push(newConfirmed<0?0:newConfirmed);
		    caseChartData.push(caseChartRow);
		    
		    var deathChartRow = [];
		    deathChartRow.push(rowDate);
		    deathChartRow.push(newDeaths<0?0:newDeaths);
		    deathChartData.push(deathChartRow);
			
		    var lineCaseRow =[];
       		    lineCaseRow.push(rowDate);
       		    lineCaseRow.push(totalConfirmed<0?0:totalConfirmed); 
      		    lineCaseData.push(lineCaseRow);
			
		    var lineDeathRow =[];
       		    lineDeathRow.push(rowDate);
      		    lineDeathRow.push(totalDeaths<0?0:totalDeaths);
      		    lineDeathData.push(lineDeathRow);
		    
		    if (tableDay == rowDate) {   //table
			var tableRow = [];
			tableRow.push(totalConfirmed<0?0:totalConfirmed);
			tableRow.push(totalDeaths<0?0:totalDeaths);
			tableRow.push(newConfirmed<0?0:newConfirmed);
			tableRow.push(newDeaths<0?0:newDeaths);
			tableData.push(tableRow);
		    }
		});
	    }

	    var dataTable = google.visualization.arrayToDataTable(tableData);
		
	    var tableChart = new google.visualization.Table(document.getElementById('tableContainer'));	//table
	    tableChart.draw(dataTable, {
		    showRowNumber: true, 
		    title: "Covid case status in " + selectedCounty + " County as of yesterday"});

		//Newly confirmed cases ColumnChart
	     var new_cases_title_text = "Confirmed Cases in " +  selectedCounty + " County";
	    var caseData = google.visualization.arrayToDataTable(caseChartData);
	    var chart = new google.visualization.ColumnChart(document.getElementById("caseContainer"));
	    chart.draw(caseData, {
		height: 600
	    });
	    document.getElementById('new_cases_title').innerText = new_cases_title_text;
		
	     var new_deaths_title_text = "Confirmed Deaths in " +  selectedCounty + " County";
	    var deathData = google.visualization.arrayToDataTable(deathChartData);
	    var chart1 = new google.visualization.ColumnChart(document.getElementById("deathContainer")); 
	    chart1.draw(deathData, {
		height: 600,
		colors: ['#a52714'],
	    });	
	    document.getElementById('new_deaths_title').innerText = new_deaths_title_text;
		
	     var total_cases_title_text = "Total Cases in " +  selectedCounty + " County";
	    var lineCaseData1 = google.visualization.arrayToDataTable(lineCaseData);
 	    var lineCaseChart = new google.visualization.LineChart(document.getElementById("lineChartTotalCase"));
    	    lineCaseChart.draw(lineCaseData1, {height: 600});
	    document.getElementById('total_cases_title').innerText = total_cases_title_text;
	
	    var lineDeathData1 = google.visualization.arrayToDataTable(lineDeathData);
 	    var lineDeathChart = new google.visualization.LineChart(document.getElementById("lineChartTotalDeath"));
    	    lineDeathChart.draw(lineDeathData1, {width: 1600, height: 800, colors: ['#a52714'], title: "Cumulative Covid-19 Caused Deaths in " +  selectedCounty + " County"}); 
	}
