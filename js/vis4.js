//code partially copied for https://gist.github.com/mbostock/4060606

//Create an SVG area (width: 1000px, height: 600px)
var vis4width = 960,
    vis4height = 600;

var vis4svg = d3.select("#vis4").append("svg")
    .attr("width", vis4width)
    .attr("height", vis4height);

// // D3 Projection
// var vis4projection = d3.geoAlbersUsa()
//     .scale(1000)
//     .translate([vis4width/2, vis4height/2]);    // translate to center of screen

var  vis4path = d3.geoPath();
    //.projection(vis4projection);

var vis4color;

var vis4selectedData;

var vis4displayData = [];
var vis4us = [];

// Set tooltips
var vis4tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {

        //if county is not within the CSV dataset, the tooltip will display "Data Not Available"
        var valueToDisplay = "Data Not Available"
        var countyName = "Unavailable";

        //iterate through the nested data structure (for each county)
        vis4displayData.forEach(function (element){

            var dKey = d.id;

            if (dKey<10000){

                dKey = +("0" + dKey);
            }

            //if the "key" in the nested structure is equal to the county code
            if (element.Code == dKey){

                //check that the data for this county is not equal to N/A (supressed or unavaible), print if true
                if (isNaN(element[vis4selectedData])){
                    if (element[vis4selectedData] == "Suppressed") {
                        valueToDisplay = "Data is " + element[vis4selectedData];
                    }
                    else {
                        valueToDisplay = "Data is " + element[vis4selectedData];
                    }
                    countyName = element.County;
                }
                else {
                    //if county found in dataset and value is numerical, display value in tooltip
                    valueToDisplay = element[vis4selectedData];
                    countyName = element.County;
                }
            }
        });

        //return an HTML structure with the information organized into a nice tooltip
        return "<strong>County: </strong><span class='details'>" + countyName + "<br></span>" +
            "<strong> " + vis4selectedData+ ": </strong><span class='details'>" + valueToDisplay +"</span>";
    });

//LOAD IN DATA
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data/OpioidDeathsByCounty.csv")
    .await(ready);

function ready(vis4error, vis4usaMapData, vis4deathsData) {
    if (vis4error) throw vis4error;

    vis4displayData = vis4deathsData;

    vis4displayData.forEach(function(d){
        if (d["Crude Rate"] != "Suppressed" && d["Crude Rate"] != "Unreliable") {
            d["Crude Rate"] = +d["Crude Rate"];
        }
        if (d["Deaths"] != "Suppressed" && d["Deaths"] != "Unreliable") {
            d["Deaths"] = +d["Deaths"];
        }

    });

    vis4us = vis4usaMapData;

    createScalesAndLegend();

}

function createScalesAndLegend(){

    vis4svg.selectAll("*").remove();

    //get value of selected data type from select box
    vis4selectedData = document.getElementById("dataSelect").value;

    var arrayforScale;

    if (vis4selectedData == "Deaths"){
        arrayforScale = [0,50,125,250,500,1000,2000,4000,8000];
    }
    else {

        arrayforScale = [0,1,2,4,6,8,16,24,32];
    }

    var vis4x = d3.scaleLinear()
        .domain(arrayforScale)
        .rangeRound([630, 660, 690, 720, 750, 780, 810, 840, 870]);

    vis4color = d3.scaleThreshold()
        .domain(arrayforScale)
        .range(vis4colors);

    var vis4g = vis4svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");

    vis4g.selectAll("rect")
        .data(vis4color.range().map(function(d) {
            d = vis4color.invertExtent(d);
            if (d[0] == null) d[0] = vis4x.domain()[0];
            if (d[1] == null) d[1] = vis4x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return vis4x(d[0]); })
        .attr("width", function(d) { return vis4x(d[1]) - vis4x(d[0]); })
        .attr("fill", function(d) { return vis4color(d[0]); });

    vis4g.append("text")
        .attr("class", "caption")
        .attr("x", vis4x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(function(){
            if (vis4selectedData == "Deaths"){
                return "Total Deaths";
            }
            else {
                return "Death Rate";
            }
        });

    vis4g.call(d3.axisBottom(vis4x)
        .tickSize(13)
        .tickFormat(function(x, i) { return i ? x : x ; })
        .tickValues(vis4color.domain()))
        .select(".domain")
        .remove();

    updateVisualization();

}

function updateVisualization() {

    vis4svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(vis4us, vis4us.objects.counties).features)
        .enter().append("path")
        .attr("fill", function(d) {

            //if african country is not found in the data set, will be automatically set to light grey
            var colorToSet = "#fff";

            var dKey = d.id;

            if (dKey<10000){
                dKey = +("0" + dKey);
            }

            //iterate through the nested data structure (for each county)
            vis4displayData.forEach(function (element){

                if (element.Code == dKey){

                    //if data is 'Supressed'
                    if (isNaN(element[vis4selectedData])){

                        colorToSet = vis4color(0);

                    }
                    else {
                        //run the data value through the color scale to determine the color of that specific county based on the death data
                        colorToSet = vis4color(element[vis4selectedData]);
                    }
                }
            });
            return colorToSet;
        })
        .on('mouseover', vis4tooltip.show)
        .on('mouseout', vis4tooltip.hide)
        .attr("d", vis4path)
        .append("title")
        .text(function(d) { return d[vis4selectedData]; })
        .call(vis4tooltip);

    vis4svg.append("path")
        .datum(topojson.mesh(vis4us, vis4us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", vis4path);
}


