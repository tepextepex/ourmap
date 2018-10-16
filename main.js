function log(status){
	$("#status-bar").html(status);
};
//
var map = L.map("map").setView([59.95, 30.32], 4);
var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var osmAttr = "Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors";
var osm = new L.TileLayer(osmUrl, {attribution: osmAttr});
map.addLayer(osm);

var geometry;
var geojson;
var visited;
//
var nonVisitedStyle = {
	fillColor: "#ccc",
    weight: 2,
    opacity: 0,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.1
};
var visitedStyle = {
	fillColor: "#7aa74d",
    weight: 2,
    opacity: 1,
    color: '#7aa74d',
    dashArray: '3',
    fillOpacity: 0.1	
};
function getStyle(feature) {
	var style = nonVisitedStyle;
	if (visited["state" + feature.properties["id"]] == "1") {
		style = visitedStyle;
	};
	return style;
}

function onEachFeature(feature, layer){
	if (feature.properties && feature.properties["NAME"]) {
		var id = feature.properties["id"];
		if (visited["state" + feature.properties["id"]] == "1") {
			layer.bindPopup(feature.properties["NAME"] + "<br><img src='icon/placeholder-yes.png' width=32 height=32></img><img src='icon/placeholder-no-bw.png' width=32 height=32 onclick='test(" + id + ", 0);'></img>");
		} else {
			layer.bindPopup(feature.properties["NAME"] + "<br><img src='icon/placeholder-yes-bw.png' width=32 height=32 onclick='test(" + id + ", 1);'></img><img src='icon/placeholder-no.png' width=32 height=32></img>");
		}		
	}
}

function onEachFeatureLight(feature, layer){
	if (feature.properties && feature.properties["NAME"]) {
		var id = feature.properties["id"];
		if (visited["state" + feature.properties["id"]] == "1") {
			layer.bindPopup(feature.properties["NAME"]);
		} else {
			layer.bindPopup(feature.properties["NAME"]);
		}		
	}
}

function test(id, mode){
	console.log(id);
	$.ajax({
		url: "click.php",
		data: {"countryId": id, "visited": mode},
		success: function (data) {
			console.log("server replied: " + data);
			//update json with "visits"
			if (mode) {
				visited["state" + id] = 1;
			} else {
				visited["state" + id] = null;
			}
			//set new style for geojson feature
			geojson.setStyle(getStyle);
			//change all popups
			geojson.eachLayer(function(layer){
				var id = layer.feature.properties["id"];
				if (visited["state" + layer.feature.properties["id"]] == "1") {
					layer.bindPopup(layer.feature.properties["NAME"] + "<br><img src='icon/placeholder-yes.png' width=32 height=32></img><img src='icon/placeholder-no-bw.png' width=32 height=32 onclick='test(" + id + ", 0);'></img>");
				} else {
					layer.bindPopup(layer.feature.properties["NAME"] + "<br><img src='icon/placeholder-yes-bw.png' width=32 height=32 onclick='test(" + id + ", 1);'></img><img src='icon/placeholder-no.png' width=32 height=32></img>");
				}
			});
		}
	});
}
function populateUserList(array){
	var list = document.getElementById("userList");
	var item = document.createElement('li');
	item.appendChild(document.createTextNode(username));
	list.appendChild(item);
	item.id = username;
	item.className = 'active-user';
	item.onclick = getUserListOnclick(item, username);
	for(var i = 0; i < array.length; i++) {
		var item = document.createElement('li');
		if (array[i]["user_login"] !== username) {
			item.appendChild(document.createTextNode(array[i]["user_login"]));
			list.appendChild(item);
			item.id = array[i]["user_login"];
			item.onclick = getUserListOnclick(item, array[i]["user_login"]);
		};
	};
}
function getUserListOnclick(item, who){
	var li = item;
	var user = who;
	return function (){
		//переключаем активного юзера в списке на только что кликнутого
		var list = document.getElementById("userList");
		var items = document.getElementsByTagName('li');
		for (var i = 0; i < items.length; i++){
			items[i].className = '';
		};
		li.className = 'active-user';
		//уничтожаем слой геоджисона
		map.removeLayer(geojson);
		//просим новый список посещенных стран для выбранного юзера
		$.ajax({
			url: "getVisitedCountries.php",
			data: {'who': user},
			dataType: "json",
			async: false,
			success: function (data) {
				console.log("Visited countries retrieved for " + user);
				visited = data;
			}
		});
		//на его основе делаем новый geojson-слой
		//проверяем, выбран ли залогиненный юзера
		//создаем новый слой
		if (who === username) {
			geojson = L.geoJSON(geometry, {style: getStyle, onEachFeature: onEachFeature});
		} else {
			geojson = L.geoJSON(geometry, {style: getStyle, onEachFeature: onEachFeatureLight});
		}
		//попробуем посчитать площадь посещенных стран:
		area = 0;
		totalarea = 0;
		geojson.eachLayer(function(layer){
			if (visited["state" + layer.feature.properties["id"]]) {
				area += layer.feature.properties["AREA"]
			};
			totalarea += layer.feature.properties["AREA"]
		});
		console.log("AREA sum is " + area);
		console.log((area / totalarea * 100).toFixed(1) + "% of landmass were visited")
		//
		//и крепим его к карте
		geojson.addTo(map);
	};
};
$.ajax({
	url: "getVisitedCountries.php",
	data: {'who': username},
	dataType: "json",
	async: false,
	success: function (data) {
		console.log("Visited countries retrieved");
		visited = data;
	}
});
$.ajax({
	//url: "world_plus_Russia.geojson",
	url: "geometry_0112.geojson",
	dataType: "json",
	success: function (data) {
		geometry = data;
		geojson = L.geoJSON(data, {style: getStyle, onEachFeature: onEachFeature});
		//попробуем посчитать площадь посещенных стран:
		area = 0;
		totalarea = 0;
		geojson.eachLayer(function(layer){
			if (visited["state" + layer.feature.properties["id"]]) {
				area += layer.feature.properties["AREA"]
			};
			totalarea += layer.feature.properties["AREA"]
		});
		console.log("AREA sum is " + area);
		console.log((area / totalarea * 100).toFixed(1) + "% of landmass were visited")
		//
		geojson.addTo(map);
		console.log("GeoJSON successfully loaded");
		$.ajax({
			url: "getUserList.php",
			dataType: "json",
			success: function (data) {
				populateUserList(data);
			}
		});
	}
});