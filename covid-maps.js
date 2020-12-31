	var map;
	var xmlhttp = new XMLHttpRequest();
	
	function getCountyCases(county_name) {
	    let case_info = "";
	    xmlhttp.open("GET", "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + getPastDate(1), false);
	    xmlhttp.send();
	    if (xmlhttp.status === 200) {
		var myObj = JSON.parse(xmlhttp.responseText);
		for (var i = 0; i < myObj.result.records.length; i++) {
		    if (myObj.result.records[i].county == county_name) {
			case_info = myObj.result.records[i].totalcountconfirmed;
		    }
		}
	    }
	    return case_info;
	}

	function initMap() {
	    map.data.loadGeoJson('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/california-counties.geojson');
	    map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {
		    lat: 37.58157,
		    lng: -121.4944
		}
	    });


	    map.data.setStyle({
		fillColor: 'blue',
		strokeWeight: 1
	    });

	    var infowindow = new google.maps.InfoWindow();

	    map.data.addListener('click', function(event) {
		let county_name = event.feature.getProperty("name");
		selectedCounty = county_name;
		drawChart();
		let cases = getCountyCases(county_name)
		let html = county_name + " County " + "New Cases: " + cases;
		infowindow.setContent(html); // show the html variable in the infowindow
		infowindow.setPosition(event.latLng); // anchor the infowindow at the marker
		infowindow.setOptions({
		    pixelOffset: new google.maps.Size(0, -30)
		}); 
		infowindow.open(map);
	    });
	}	
