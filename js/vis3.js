// SVG margin convention
var vis3_margin = {top: 40, right: 20, bottom: 60, left: 50},
            vis3_width = 500 - vis3_margin.left - vis3_margin.right,
            vis3_height = 500 - vis3_margin.top - vis3_margin.bottom;

// make a new svg drawing area
var vis3_graph = d3.select("#vis3").append("svg")
    .attr("width", vis3_width + vis3_margin.left + vis3_margin.right)
    .attr("height", vis3_height + vis3_margin.top + vis3_margin.bottom)
	.append("g")
    .attr("transform", "translate(" + vis3_margin.left + "," + vis3_margin.top + ")");

// var vis3_text = d3.select("#vis3text").append("svg")
//     .attr("width", vis3_width + vis3_margin.left + vis3_margin.right)
//     .attr("height", vis3_height + vis3_margin.top + vis3_margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + vis3_margin.left + "," + vis3_margin.top + ")");

// grey background
// vis3_graph.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("fill", "white")
//     .attr("transform", "translate(-100, -30)");

// svg for legend
var vis3_legend = vis3_graph.append("g")
	.attr("class", "legend")
    .attr("transform", "translate(50,10)");

// Date parser
var vis3_formatDate = d3.timeFormat("%Y");
var vis3_parseDate = d3.timeParse("%Y");

// make tooltip function 
// inpired by http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
var format = d3.format(",");
var tip_line = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Deaths: </strong><span class='details'>" + d.Deaths + 
               "<br></span> <strong>Year: </strong><span class='details'>" + 
               vis3_formatDate(d.Year) + "</span>";
    });

// define scales 
var vis3_x = d3.scaleTime()
    .range([0, vis3_width]);

var vis3_y = d3.scaleLinear()
    .range([vis3_height, 0]);

// Define the axes in terms of the above scales
var xAxis = d3.axisBottom()
    .scale(vis3_x)
    .tickFormat(vis3_formatDate);
var yAxis = d3.axisLeft()
    .scale(vis3_y);

// append formatted axes
vis3_graph.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0, " + vis3_height + ")"); 
vis3_graph.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(0,0)");

// define the general case for a line which will map the date to funding
var vis3_line = d3.line()
    .curve(d3.curveCardinal)
    .x(function(d) { return vis3_x(d.Year); })
    .y(function(d) { return vis3_y(d.Deaths); }); 

// global variable for data 
var vis3_data;
var vis3_op_all;
var vis3_dr_all;
var vis3_gun, vis3_motor;
var colors;

queue()
    .defer(d3.csv, "data/red_drug_05.csv").defer(d3.csv, "data/red_op_05.csv")
    .defer(d3.csv, "data/red_drug_06.csv").defer(d3.csv, "data/red_op_06.csv")
    .defer(d3.csv, "data/red_drug_07.csv").defer(d3.csv, "data/red_op_07.csv")
    .defer(d3.csv, "data/red_drug_08.csv").defer(d3.csv, "data/red_op_08.csv")
    .defer(d3.csv, "data/red_drug_09.csv").defer(d3.csv, "data/red_op_09.csv")
    .defer(d3.csv, "data/red_drug_10.csv").defer(d3.csv, "data/red_op_10.csv")
    .defer(d3.csv, "data/red_drug_11.csv").defer(d3.csv, "data/red_op_11.csv")
    .defer(d3.csv, "data/red_drug_12.csv").defer(d3.csv, "data/red_op_12.csv")
    .defer(d3.csv, "data/red_drug_13.csv").defer(d3.csv, "data/red_op_13.csv")
    .defer(d3.csv, "data/red_drug_14.csv").defer(d3.csv, "data/red_op_14.csv")
    .defer(d3.csv, "data/red_drug_15.csv").defer(d3.csv, "data/red_op_15.csv")
    .defer(d3.csv, "data/gun.csv").defer(d3.csv, "data/motor.csv")
    .await(createLine);

function createLine(error, 
					drug_05, op_05, drug_06, op_06, drug_07, op_07,
					drug_08, op_08, drug_09, op_09, drug_10, op_10, 
					drug_11, op_11, drug_12, op_12, drug_13, op_13, 
					drug_14, op_14, drug_15, op_15, gun_dat, mot_dat) {

    vis3_dr_all = [drug_05, drug_06, drug_07, drug_08, drug_09, 
                   drug_10, drug_11, drug_12, drug_13, drug_14, drug_15];

    vis3_op_all = [op_05, op_06, op_07, op_08, op_09, 
                   op_10, op_11, op_12, op_13, op_14, op_15];

    console.log(vis3_op_all);

    vis3_gun = gun_dat;
    vis3_motor = mot_dat;
    vis3_gun.forEach(function(d, i) {
        vis3_gun[i] = parseYearRow(d.Year, +d.Deaths, d.Title);
    })
    vis3_motor.forEach(function(d, i) {
        vis3_motor[i] = parseYearRow(d.Year, +d.Deaths, d.Title);
    })

    // add labels for axes
    vis3_graph.selectAll(".axis-label").remove();
    vis3_graph.append("g")
        .append("text")
        .transition()
        .duration(800)
        .attr("class", "axis-label")
        .attr("transform", "translate("  + (vis3_width / 2.4) + ", " + (vis3_height + vis3_margin.bottom - 15) + ")")
        .text("Time of Recorded Deaths");
    vis3_graph.append("g")
        .append("text")
        .transition()
        .duration(800)
        .attr("class", "axis-label")
        .attr("transform", "translate(18, 120) rotate(270)")
        .text("Number of Deaths");

    updateLine()
}

function updateLine (){
    cat = document.getElementById("y-category").value;
    console.log(cat);

    // change data to map the number of deaths to variable
    if (cat == "default") {

        // define data structure in terms of total number of deaths
        drug_year_data = [parseYearRow("2005", vis3_dr_all[0].length, "All Drugs"), parseYearRow("2006", vis3_dr_all[1].length, "All Drugs"),
                          parseYearRow("2007", vis3_dr_all[2].length, "All Drugs"), parseYearRow("2008", vis3_dr_all[3].length, "All Drugs"), 
                          parseYearRow("2009", vis3_dr_all[4].length, "All Drugs"), parseYearRow("2010", vis3_dr_all[5].length, "All Drugs"), 
                          parseYearRow("2011", vis3_dr_all[6].length, "All Drugs"), parseYearRow("2012", vis3_dr_all[7].length, "All Drugs"),
                          parseYearRow("2013", vis3_dr_all[8].length, "All Drugs"), parseYearRow("2014", vis3_dr_all[9].length, "All Drugs"), 
                          parseYearRow("2015", vis3_dr_all[10].length, "All Drugs")]

        op_year_data = [parseYearRow("2005", vis3_op_all[0].length, "Opioids"), parseYearRow("2006", vis3_op_all[1].length, "Opioids"),
                        parseYearRow("2007", vis3_op_all[2].length, "Opioids"), parseYearRow("2008", vis3_op_all[3].length, "Opioids"), 
                        parseYearRow("2009", vis3_op_all[4].length, "Opioids"), parseYearRow("2010", vis3_op_all[5].length, "Opioids"), 
                        parseYearRow("2011", vis3_op_all[6].length, "Opioids"), parseYearRow("2012", vis3_op_all[7].length, "Opioids"),
                        parseYearRow("2013", vis3_op_all[8].length, "Opioids"), parseYearRow("2014", vis3_op_all[9].length, "Opioids"), 
                        parseYearRow("2015", vis3_op_all[10].length, "Opioids")]

        vis3_data = [drug_year_data, op_year_data];
        raw = drug_year_data.concat(op_year_data);

        // define scales for x and y axes with raw JS elements
        vis3_x.domain(d3.extent(raw, function(d) { return d.Year; }));
        vis3_y.domain(d3.extent(raw, function(d) { return d.Deaths; }));
            
        // console.log(vis3_data);
        // console.log(vis3_op_all);

        vis3_graph.select(".x-axis")
            .transition()
            .duration(800)
            .call(xAxis);
        vis3_graph.select(".y-axis")
            .transition()
            .duration(800)
            .call(yAxis);

        // the various color options for lines
        colors = ["#1f78b4", "#a6cee3", "#b2df8a", "#33a02c", "#fb9a99", 
                      "#e31a1c", "#fdbf6f"];
    
    } else if (cat == "other") {
        // define data structure in terms of total number of deaths
        drug_year_data = [parseYearRow("2005", vis3_dr_all[0].length, "All Drugs"), parseYearRow("2006", vis3_dr_all[1].length, "All Drugs"),
                          parseYearRow("2007", vis3_dr_all[2].length, "All Drugs"), parseYearRow("2008", vis3_dr_all[3].length, "All Drugs"), 
                          parseYearRow("2009", vis3_dr_all[4].length, "All Drugs"), parseYearRow("2010", vis3_dr_all[5].length, "All Drugs"), 
                          parseYearRow("2011", vis3_dr_all[6].length, "All Drugs"), parseYearRow("2012", vis3_dr_all[7].length, "All Drugs"),
                          parseYearRow("2013", vis3_dr_all[8].length, "All Drugs"), parseYearRow("2014", vis3_dr_all[9].length, "All Drugs"), 
                          parseYearRow("2015", vis3_dr_all[10].length, "All Drugs")]

        op_year_data = [parseYearRow("2005", vis3_op_all[0].length, "Opioids"), parseYearRow("2006", vis3_op_all[1].length, "Opioids"),
                        parseYearRow("2007", vis3_op_all[2].length, "Opioids"), parseYearRow("2008", vis3_op_all[3].length, "Opioids"), 
                        parseYearRow("2009", vis3_op_all[4].length, "Opioids"), parseYearRow("2010", vis3_op_all[5].length, "Opioids"), 
                        parseYearRow("2011", vis3_op_all[6].length, "Opioids"), parseYearRow("2012", vis3_op_all[7].length, "Opioids"),
                        parseYearRow("2013", vis3_op_all[8].length, "Opioids"), parseYearRow("2014", vis3_op_all[9].length, "Opioids"), 
                        parseYearRow("2015", vis3_op_all[10].length, "Opioids")]

        vis3_data = [drug_year_data, op_year_data, vis3_gun, vis3_motor];
        raw = drug_year_data.concat(op_year_data).concat(vis3_gun).concat(vis3_motor);
        console.log(vis3_data);


        // define scales for x and y axes with raw JS elements
        vis3_x.domain(d3.extent(raw, function(d) { return d.Year; }));
        vis3_y.domain(d3.extent(raw, function(d) { return d.Deaths; }));

        vis3_graph.select(".x-axis")
            .transition()
            .duration(800)
            .call(xAxis);
        vis3_graph.select(".y-axis")
            .transition()
            .duration(800)
            .call(yAxis);

        // the various color options for lines
        // var colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", 
        //               "#e31a1c", "#fdbf6f"];
        colors = ["#1f78b4", "#a6cee3", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"];



    } else if (cat == "Sex") {

        op_year_data = [parseYearRow("2005", vis3_op_all[0].length, "Opioids"), parseYearRow("2006", vis3_op_all[1].length, "Opioids"),
                        parseYearRow("2007", vis3_op_all[2].length, "Opioids"), parseYearRow("2008", vis3_op_all[3].length, "Opioids"), 
                        parseYearRow("2009", vis3_op_all[4].length, "Opioids"), parseYearRow("2010", vis3_op_all[5].length, "Opioids"), 
                        parseYearRow("2011", vis3_op_all[6].length, "Opioids"), parseYearRow("2012", vis3_op_all[7].length, "Opioids"),
                        parseYearRow("2013", vis3_op_all[8].length, "Opioids"), parseYearRow("2014", vis3_op_all[9].length, "Opioids"), 
                        parseYearRow("2015", vis3_op_all[10].length, "Opioids")]

        var vis3_op_male = [];
        var vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { return f[cat] == "M"; })
            vis3_op_male.push(parseYearRow("" + vis3_year, e.length, "Male"));
            vis3_year++;
        })

        var vis3_op_female = [];
        var vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { return f[cat] == "F"; })
            vis3_op_female.push(parseYearRow("" + vis3_year, e.length, "Female"));
            vis3_year++;
        })

        vis3_data = [op_year_data, vis3_op_male, vis3_op_female];
        raw = op_year_data.concat(vis3_op_male).concat(vis3_op_female);
        console.log(vis3_data);

        // define scales for x and y axes with raw JS elements
        vis3_x.domain(d3.extent(raw, function(d) { return d.Year; }));
        vis3_y.domain(d3.extent(raw, function(d) { return d.Deaths; }));

        vis3_graph.select(".x-axis")
            .transition()
            .duration(800)
            .call(xAxis);
        vis3_graph.select(".y-axis")
            .transition()
            .duration(800)
            .call(yAxis);

        // the various color options for lines
        // var colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", 
        //               "#e31a1c", "#fdbf6f"];
        colors = ["#33a02c", "#1f78b4", "#e31a1c", "#fb9a99", "#a6cee3", "#fdbf6f"];
    
    } else if (cat == "Race") {

        op_year_data = [parseYearRow("2005", vis3_op_all[0].length, "Opioids"), parseYearRow("2006", vis3_op_all[1].length, "Opioids"),
                        parseYearRow("2007", vis3_op_all[2].length, "Opioids"), parseYearRow("2008", vis3_op_all[3].length, "Opioids"), 
                        parseYearRow("2009", vis3_op_all[4].length, "Opioids"), parseYearRow("2010", vis3_op_all[5].length, "Opioids"), 
                        parseYearRow("2011", vis3_op_all[6].length, "Opioids"), parseYearRow("2012", vis3_op_all[7].length, "Opioids"),
                        parseYearRow("2013", vis3_op_all[8].length, "Opioids"), parseYearRow("2014", vis3_op_all[9].length, "Opioids"), 
                        parseYearRow("2015", vis3_op_all[10].length, "Opioids")]

        var vis3_op_hispanic = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Hispanic_Origin_Recode == "1" || f.Hispanic_Origin_Recode == "2" || 
                        f.Hispanic_Origin_Recode == "3" || f.Hispanic_Origin_Recode == "4" ||
                        f.Hispanic_Origin_Recode == "5"); 
            })
            vis3_op_hispanic.push(parseYearRow("" + vis3_year, e.length, "Hispanic"));
            vis3_year++;
        })


        var vis3_op_white = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f[cat] == "01"); 
            })
            vis3_op_white.push(parseYearRow("" + vis3_year, e.length, "White"));
            vis3_year++;
        })

        var vis3_op_black = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f[cat] == "02"); 
            })
            vis3_op_black.push(parseYearRow("" + vis3_year, e.length, "Black"));
            vis3_year++;
        })
    
        vis3_data = [op_year_data, vis3_op_hispanic, vis3_op_white, vis3_op_black];
        raw = op_year_data.concat(vis3_op_hispanic).concat(vis3_op_white).concat(vis3_op_black);
        console.log(vis3_data);

        // define scales for x and y axes with raw JS elements
        vis3_x.domain(d3.extent(raw, function(d) { return d.Year; }));
        vis3_y.domain(d3.extent(raw, function(d) { return d.Deaths; }));

        vis3_graph.select(".x-axis")
            .transition()
            .duration(800)
            .call(xAxis);
        vis3_graph.select(".y-axis")
            .transition()
            .duration(800)
            .call(yAxis);

        colors = ["#1f78b4", "#fb9a99", "#33a02c", "#e31a1c", "#fdbf6f", "#a6cee3"];
    
    } else if (cat == "Age") {

        console.log(vis3_op_all);

        op_year_data = [parseYearRow("2005", vis3_op_all[0].length, "Opioids"), parseYearRow("2006", vis3_op_all[1].length, "Opioids"),
                        parseYearRow("2007", vis3_op_all[2].length, "Opioids"), parseYearRow("2008", vis3_op_all[3].length, "Opioids"), 
                        parseYearRow("2009", vis3_op_all[4].length, "Opioids"), parseYearRow("2010", vis3_op_all[5].length, "Opioids"), 
                        parseYearRow("2011", vis3_op_all[6].length, "Opioids"), parseYearRow("2012", vis3_op_all[7].length, "Opioids"),
                        parseYearRow("2013", vis3_op_all[8].length, "Opioids"), parseYearRow("2014", vis3_op_all[9].length, "Opioids"), 
                        parseYearRow("2015", vis3_op_all[10].length, "Opioids")]

        var vis3_op_01 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { return (f.Age_Recode_12 == "01"); })
            vis3_op_01.push(parseYearRow("" + vis3_year, e.length, "Infants"));
            vis3_year++;
        })
        var vis3_op_02 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Age_Recode_12 == "02" || f.Age_Recode_12 == "03"); 
            })
            vis3_op_02.push(parseYearRow("" + vis3_year, e.length, "1 - 14 years"));
            vis3_year++;
        })
        var vis3_op_03 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Age_Recode_12 == "04" || f.Age_Recode_12 == "05"); 
            })
            vis3_op_03.push(parseYearRow("" + vis3_year, e.length, "15 - 34 years"));
            vis3_year++;
        })
        var vis3_op_04 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Age_Recode_12 == "06" || f.Age_Recode_12 == "07"); 
            })
            vis3_op_04.push(parseYearRow("" + vis3_year, e.length, "35 - 54 years"));
            vis3_year++;
        })
        var vis3_op_05 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Age_Recode_12 == "08" || f.Age_Recode_12 == "09"); 
            })
            vis3_op_05.push(parseYearRow("" + vis3_year, e.length, "55 - 74 years"));
            vis3_year++;
        })
        var vis3_op_06 = [];
        vis3_year = 2005;
        vis3_op_all.forEach(function(d) {
            var e = d.filter(function(f) { 
                return (f.Age_Recode_12 == "10" || f.Age_Recode_12 == "11"); 
            })
            vis3_op_06.push(parseYearRow("" + vis3_year, e.length, "above 75"));
            vis3_year++;
        })
        // var vis3_op_07 = [];
        // vis3_year = 2005;
        // vis3_op_all.forEach(function(d) {
        //     var e = d.filter(function(f) { 
        //         return (f.Age_Recode_12 == "07"); })
        //     vis3_op_07.push(parseYearRow("" + vis3_year, e.length, "45 - 54 years"));
        //     vis3_year++;
        // })
        // var vis3_op_08 = [];
        // vis3_year = 2005;
        // vis3_op_all.forEach(function(d) {
        //     var e = d.filter(function(f) { 
        //         return (f.Age_Recode_12 == "11"); 
        //     })
        //     vis3_op_08.push(parseYearRow("" + vis3_year, e.length, "over 85"));
        //     vis3_year++;
        // })
        // var vis3_op_09 = [];
        // vis3_year = 2005;
        // vis3_op_all.forEach(function(d) {
        //     var e = d.filter(function(f) { return (f.Age_Recode_12 == "09"); })
        //     vis3_op_09.push(parseYearRow("" + vis3_year, e.length, "over 65"));
        //     vis3_year++;
        // })
        // var vis3_op_10 = [];
        // vis3_year = 2005;
        // vis3_op_all.forEach(function(d) {
        //     var e = d.filter(function(f) { return (f[cat] == "10"); })
        //     vis3_op_10.push(parseYearRow("" + vis3_year, e.length, "75 - 84 years"));
        //     vis3_year++;
        // })
        // var vis3_op_11 = [];
        // vis3_year = 2005;
        // vis3_op_all.forEach(function(d) {
        //     var e = d.filter(function(f) { return (f[cat] == "11"); })
        //     vis3_op_11.push(parseYearRow("" + vis3_year, e.length, "over 85"));
        //     vis3_year++;
        // })



        vis3_data = [op_year_data, vis3_op_01, vis3_op_02, vis3_op_03, vis3_op_04,
                     vis3_op_05, vis3_op_06];
        raw = op_year_data.concat(vis3_op_01, vis3_op_02, vis3_op_03, vis3_op_04, 
                                  vis3_op_05, vis3_op_06);
        console.log(vis3_data);

        // define scales for x and y axes with raw JS elements
        vis3_x.domain(d3.extent(raw, function(d) { return d.Year; }));
        vis3_y.domain(d3.extent(raw, function(d) { return d.Deaths; }));

        vis3_graph.select(".x-axis")
            .transition()
            .duration(800)
            .call(xAxis);
        vis3_graph.select(".y-axis")
            .transition()
            .duration(800)
            .call(yAxis);

        colors = ["#cb181d", "#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", 
                  "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"];
    }

        // counter to change the color for each line
        var count = -1;
        // add all lines in at once given the hierarchical structure of data
        // adds one line corresponding to each sub array of data
        vis3_graph.selectAll(".line").remove();
        vis3_graph.selectAll(".line")
            .data(vis3_data)
            .enter().append("path")
            .transition()
            .delay(800)
            .attr("class", "line")
            .style("stroke", function(d) { count++; return colors[count]; })
            // .attr("data-legend",function(d) { return ;})
            .attr("d", vis3_line);

        count = -1;
        // create legend rects
        vis3_graph.selectAll("rect").remove();
        vis3_legend.selectAll("rect")
            .data(vis3_data)
            .enter().append("rect")
            .transition()
            .duration(800)
            .attr("width", 40)
            // .attr("y", function(d, i) { return i * 30 - 20; })
            // .attr("height", 30)
            .attr("y", function(d, i) {
                if (cat == "Age" || cat == "other") { 
                    return i * 20 - 20;
                } else {
                    return i * 30 - 20; 
                }
            })
            .attr("height", function() {
                if (cat == "Age" || cat == "other") {
                    return "20";
                } else {
                    return "30";
                }
            })
            .attr("fill", function(d) { count++; return colors[count]; });

        // Add legend titles
        vis3_graph.selectAll(".legend-label").remove();
        vis3_legend.selectAll("text")
            .data(vis3_data)
            .enter().append("text")
            .transition()
            .duration(800)
            .attr("class", "legend-label")
            .attr("x", 45)
            // .attr("y", function(d, i) { return i * 30 - 5; })
            .attr("y", function(d, i) { 
                if (cat == "Age" || cat == "other") {
                    return i * 20 - 10; 
                } else {
                    return i * 30 - 5; 
                }
                
            })
            .attr("dy", ".35em")
            .text(function(d, i) { return d[i]["Title"]; });

        count = -1;
        var last = "";
        // add circles for each data point on each line
        var circles = vis3_graph.selectAll("circle")
            .data(raw);

        // ensure that circles corresponding to a given line are the same color
        // as the line itself
        circles.enter().append("circle")
            .merge(circles)
            .attr("class", "circle")
            .attr("fill", function(d) { 
                if (last != d.Title) { count++; last = d.Title; }
                return colors[count];
            })
            .attr("r", 7)
            // add tooltip for hover events over circles
            .on('mouseover', tip_line.show)
            .on('mouseout', tip_line.hide)
            .transition()
            .duration(800)
            .attr("cx", function(d) { return vis3_x(d.Year); })
            .attr("cy", function(d) { return vis3_y(d.Deaths); })
            .call(tip_line);

        // remove the previous circles
        circles.exit().remove();


        // append conjoining text to visualization with facts pertaining
        // to the current category
        d3.select(".dynamic_text").remove();
        d3.select(".vis3text")
            .append("p")     
            .attr("class", "dynamic_text")
            .style("opacity", 0)
            .text(function() {
                if (cat == "default") {
                    return "Opioid addictions account for the " + 
                           "65% of drug overdoeses, with 20,000 deaths from" +
                           "legal opioids and 13,000 deaths from heroin in 2015."
                } else if (cat == "other") {
                    return "Lorem ipsum dolor sit amet, consectetur adipiscing " +
                           "elit. Fusce massa est, laoreet vitae varius eget, " +
                           "volutpat vel tortor. Nunc aliquet elementum urna, " +
                           "eu condimentum dui consectetur eget";
                } else if (cat == "Sex") {
                    return "Nullam eros ex, congue feugiat ultrices posuere, " +
                           "dapibus quis neque. Cras ullamcorper commodo purus, " + 
                           "quis hendrerit dui auctor et. Etiam eu mi libero.";
                } else if (cat == "Race") {
                    return "Vivamus tincidunt erat et tincidunt vestibulum. " +
                           "Phasellus aliquam vitae nisl ut suscipit. Donec " +
                           "eget velit ut leo volutpat bibendum. Aenean orci. ";
                } else if (cat == "Age") {
                    return "Etiam laoreet vestibulum rutrum. Mauris sem erat, " +
                           "volutpat ac consequat in, scelerisque ac felis. " +
                           "Curabitur ut tortor commodo, facilisis diam a, " +
                           "facilisis quam.";
                }
            })
            .transition()
                .style("opacity", 1)
                .delay(1000)
                .ease(d3.easeLinear);
                


}


function parseYearRow(year, len, title) {
	return { Year: vis3_parseDate(year), Deaths: len, Title: title }
}


















