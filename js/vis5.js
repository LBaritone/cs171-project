
var formatNum = d3.format(",");
var formatPerc = d3.format(".0%");


function vis5_disp() {
	d3.csv("data/zip_codes_states.csv", function(zips) {
	d3.csv("data/OpioidDeathsByCounty.csv", function(pops) {
	d3.csv("data/2015drugdeathsbycounty.csv", function(pops15) {
	    // console.log(zips);
		console.log(document.getElementById("zip_input").value);

		var find = document.getElementById("zip_input").value;

		var location = zips.filter(function(d) { return d.zip_code == find; })[0];
		location.county = location.county + " County, " + location.state;

		var location_pop = pops.filter(function(d) { return d.County == location.county; })[0];
		var location_pop_15 = pops15.filter(function(d) { return d.County == location.county; })[0];

		console.log(location_pop);

        // append conjoining text to visualization with death rate
        d3.selectAll(".vis5text").remove();
        d3.select("#vis5")
            .append("p")     
            .attr("class", "vis5text1 vis5text")
            .style("opacity", 0)
            .text(function() { 
            	return location_pop.County;
            })
            .transition()
                .style("opacity", 1)
                .delay(600)
                .ease(d3.easeLinear);
        d3.select("#vis5")
            .append("p")     
            .attr("class", "vis5text2 vis5text")
            .style("opacity", 0)
            .text(function() { 
            	return "Population: " + formatNum(location_pop_15.Population);
            })
            .transition()
                .style("opacity", 1)
                .delay(1000)
                .ease(d3.easeLinear);
        d3.select("#vis5")
            .append("p")     
            .attr("class", "vis5text3 vis5text")
            .style("opacity", 0)
            .text(function() { 
            	return location_pop_15.Deaths + " people died in 2015 from " +
            		   "drug overdoses";
            })
            .transition()
                .style("opacity", 1)
                .delay(2000)
                .ease(d3.easeLinear);
        d3.select("#vis5")
            .append("p")     
            .attr("class", "vis5text4 vis5text")
            .style("opacity", 0)
            .text(function() { 
            	return "This is " + formatPerc(location_pop_15.Deaths / location_pop.Deaths) + 
            		   " of the " + location_pop.Deaths + " people died in the last 20 years " + 
					   " from drug overdoses";
            })
            .transition()
                .style("opacity", 1)
                .delay(3000)
                .ease(d3.easeLinear);



	});});});
}