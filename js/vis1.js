
//------------------------------------------------------
//            CREATE SVG DRAWING AREA
//------------------------------------------------------
// Create svg
var vis1_width = 1200,
    vis1_height = 450;
// Change vis1_height to 500 to get built-in legend

var vis1_svg = d3.select("#vis1").append("svg")
    .attr("id", "pill_vis")
    .attr("width", vis1_width)
    .attr("height", vis1_height)
    .style("background-color", "#627671");

//------------------------------------------------------
//         VARIABLES TO ALLOW FOR COLORING
//------------------------------------------------------
var vis1_methadone_color = 'white',
    vis1_morphine_color = '#46b8da',
    vis1_pethidine_color = '#FEFE33',
    vis1_oxycodone_color = '#ff33ff',
    vis1_fentanyl_color = '#FE2712',
    vis1_hydromorphone_color = '#66B032';

//------------------------------------------------------
//          DRAW INITIAL STATIC IMAGES
//------------------------------------------------------
var vis1_placeholder = [0,1,2,3,4,5,6,7,8,9];

var vis1_placeholder_pill_bottles = vis1_svg.selectAll(".vis1_bottle")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_bottle")
    .attr("x", function(d){
        return 120*d + 22;
    })
    .attr("y", 0)
    .attr("width", 76)
    .attr("height", 100)
    .style("fill", "orange");

var vis1_placeholder_bottle_white_labels = vis1_svg.selectAll(".vis1_bottle_white_label")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_bottle_white_label")
    .attr("x", function(d){
        return 120*d + 22;
    })
    .attr("y", 30)
    .attr("width", 76)
    .attr("height", 40)
    .style("fill", "white");


var vis1_ground_border = vis1_svg.append("line")
    .attr("x1",0)
    .attr("x2",1200)
    .attr("y1",435)
    .attr("y2",435)
    .style("stroke-width", 2)
    .style("stroke", "grey");

var vis1_ground = vis1_svg.append("rect")
    .attr("x", 0)
    .attr("y", 436)
    .attr("width", 1200)
    .attr("height",64)
    .style("fill", "#627671");

var vis1_leg_pills = vis1_svg.selectAll(".vis1_leg_pill")
    .data([vis1_methadone_color,vis1_morphine_color,vis1_pethidine_color,vis1_oxycodone_color, vis1_fentanyl_color, vis1_hydromorphone_color])
    .enter()
    .append("circle")
    .attr("class", "vis1_leg_pill")
    .attr("cx", function(d, index){
        return (40 + 150*index);
    })
    .attr("cy", 460)
    .attr("r", 3)
    .attr("fill", function(d){
        return d;
    });

var vis1_leg_captions = vis1_svg.selectAll(".vis1_leg_caption")
    .data(["Methadone", "Morphine", "Pethidine", "Oxycodone", "Fentanyl", "Hydromorphone"])
    .enter()
    .append("text")
    .attr("class", "vis1_leg_caption")
    .attr("x", function(d, index){
        return (50 + 150*index);
    })
    .attr("y", 465)
    .style("fill", "white")
    .text(function(d){return (d);});

vis1_svg.append("text")
    .attr("x",980)
    .attr("y", 465)
    .style("fill", "white")
    .text("Each pill represents 500kg");
/*
var vis1_placeholder_countries = vis1_svg.selectAll(".vis1_country")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_country")
    .attr("x", function(d){
        return 120*d + 22;
    })
    .attr("y", 525)
    .attr("width", 76)
    .attr("height", 76)
    .style("fill", "grey");*/

//------------------------------------------------------
//    DRAW THE INITIAL LIDS FOR THE PILL BOTTLES
//------------------------------------------------------
var vis1_placeholder_lids = vis1_svg.selectAll(".vis1_lid")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_lid")
    .attr("x", function(d){
        return 120*d + 17;
    })
    .attr("y", 100)
    .attr("width", 86)
    .attr("height", 20)
    .style("fill", "white");

//------------------------------------------------------
//        FUNCTION TO OPEN THE PILL BOTTLES
//------------------------------------------------------
function vis1_open_pill_bottle_lids(){
    vis1_svg.selectAll(".vis1_lid").remove();
    vis1_svg.selectAll(".vis1_lid")
        .data(vis1_placeholder)
        .enter()
        .append("rect")
        .attr("class", "vis1_lid")
        .attr("x", function(d){
            return 120*d + 17 + 86;
        })
        .attr("y", 90)
        .attr("width", 20)
        .attr("height", 86)
        .style("fill", "white");
}

//------------------------------------------------------
//     FUNCTION TO CLOSE A SPECIFIC PILL BOTTLE
//------------------------------------------------------
function vis1_close_lid(vis1_lid_specifications){
    vis1_svg.append("rect")
        .attr("class", "vis1_lid")
        .attr("x", vis1_lid_specifications[0] - 7)
        .attr("y", 100)
        .attr("width", 0)
        .attr("height", 20)
        .style("fill", "white")
        .transition()
        .duration(1000)
        .attr("width", 0)
        .transition()
        .duration(1)
        .attr("width", 86);
    vis1_svg.append("rect")
        .attr("class", "vis1_lid vis1_lid_eraser")
        .attr("x", vis1_lid_specifications[0] - 7 + 85)
        .attr("y", 85)
        .attr("width", 22)
        .attr("height", 0)
        .style("fill", "#627671")
        .transition()
        .duration(1000)
        .attr("height", 0)
        .transition()
        .duration(1)
        .attr("height", 95);

}


//------------------------------------------------------
//  NON-DATA DEPENDENT VARIABLES FOR THE PILL STREAMS
//------------------------------------------------------
var vis1_usa_interval = 0,
    vis1_germany_interval = 0,
    vis1_canada_interval = 0,
    vis1_uk_interval = 0,
    vis1_spain_interval = 0,
    vis1_france_interval = 0,
    vis1_australia_interval = 0,
    vis1_china_interval = 0,
    vis1_belgium_interval = 0,
    vis1_austria_interval = 0;

var vis1_usa_tally = 0,
    vis1_germany_tally = 0,
    vis1_canada_tally = 0,
    vis1_uk_tally = 0,
    vis1_spain_tally = 0,
    vis1_france_tally = 0,
    vis1_australia_tally = 0,
    vis1_china_tally = 0,
    vis1_belgium_tally = 0,
    vis1_austria_tally = 0;

var vis1_usa_finished = true,
    vis1_germany_finished = true,
    vis1_canada_finished = true,
    vis1_uk_finished = true,
    vis1_spain_finished = true,
    vis1_france_finished = true,
    vis1_australia_finished = true,
    vis1_china_finished = true,
    vis1_belgium_finished = true,
    vis1_austria_finished = true;

var vis1_usa_bounds = [24, 96],
    vis1_germany_bounds = [24+120, 96+120],
    vis1_canada_bounds = [24+2*120, 96+2*120],
    vis1_uk_bounds = [24+3*120, 96+3*120],
    vis1_spain_bounds = [24+4*120, 96+4*120],
    vis1_france_bounds = [24+5*120, 96+5*120],
    vis1_australia_bounds = [24+6*120, 96+6*120],
    vis1_china_bounds = [24+7*120, 96+7*120],
    vis1_belgium_bounds = [24+8*120, 96+8*120],
    vis1_austria_bounds = [24+9*120, 96+9*120];

var vis1_usa_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_germany_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_canada_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_uk_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_spain_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_france_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_australia_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_china_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_belgium_slots = [0,1,2,3,4,5,6,7,8,9,10,11],
    vis1_austria_slots = [0,1,2,3,4,5,6,7,8,9,10,11];

var vis1_usa_color = vis1_methadone_color,
    vis1_germany_color = vis1_methadone_color,
    vis1_canada_color = vis1_methadone_color,
    vis1_uk_color = vis1_methadone_color,
    vis1_spain_color = vis1_methadone_color,
    vis1_france_color = vis1_methadone_color,
    vis1_australia_color = vis1_methadone_color,
    vis1_china_color = vis1_methadone_color,
    vis1_belgium_color = vis1_methadone_color,
    vis1_austria_color = vis1_methadone_color;


var vis1_currently_animating = false;
var vis1_global_speed = 15;

//------------------------------------------------------
//              DRAW TEST TUBE SIDES
//------------------------------------------------------

/*var vis1_test_tube_left = vis1_svg.selectAll(".vis1_test_tubeL")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_test_tube")
    .attr("x", function(d){
        return 120*d + 22;
    })
    .attr("y", 200)
    .attr("width", 2)
    .attr("height", 325)
    .style("fill", "grey");
var vis1_test_tube_right = vis1_svg.selectAll(".vis1_test_tubeR")
    .data(vis1_placeholder)
    .enter()
    .append("rect")
    .attr("class", "vis1_test_tube")
    .attr("x", function(d){
        return 120*d + 96;
    })
    .attr("y", 200)
    .attr("width", 2)
    .attr("height", 325)
    .style("fill", "grey");*/

//------------------------------------------------------
//  FUNCTION TO GENERATE A PILL AT "xloc" X-COORDINATE
//------------------------------------------------------
function vis1_dispense_pill(vis1_xloc, vis1_TALLY, vis1_color){
    var vis1_pill = vis1_svg.append("circle")
        .attr("class", "vis1_pill")
        .attr("cx", vis1_xloc+3)
        .attr("cy", 104)
        .attr("r", 3)
        .style("fill", vis1_color)
        .transition()
        .ease(d3.easeCubicIn)
        .duration(1000)
        .attr("cy", 430-6*(Math.floor((vis1_TALLY)/12)));

}

function vis1_generate_pill(vis1_bounds, vis1_tally, vis1_color)
{
    vis1_dispense_pill(vis1_bounds[0] +6*vis1_usa_slots[(vis1_tally%12)], vis1_tally, vis1_color);
}


function vis1_USA(vis1_usa_SCORE) {
    vis1_usa_finished = false;
    vis1_usa_interval = setInterval( function(){vis1_run_USA(vis1_allocation_to_benchmarks(vis1_usa_SCORE))}, vis1_global_speed);
}
function vis1_run_USA(vis1_usa_SCORE)
{
    if (vis1_usa_tally===vis1_usa_SCORE[5]){
        vis1_usa_finished = true;
        vis1_close_lid(vis1_usa_bounds);
        clearInterval(vis1_usa_interval);
    }

    if (vis1_usa_tally%12 === 0){
        vis1_usa_slots = vis1_random_slots();
    }
    if (vis1_usa_finished === false){
        if (vis1_usa_tally === vis1_usa_SCORE[0]){
            vis1_usa_color = vis1_morphine_color;
        }
        if (vis1_usa_tally === vis1_usa_SCORE[1]){
            vis1_usa_color = vis1_pethidine_color;
        }
        if (vis1_usa_tally === vis1_usa_SCORE[2]){
            vis1_usa_color = vis1_oxycodone_color;
        }
        if (vis1_usa_tally === vis1_usa_SCORE[3]){
            vis1_usa_color = vis1_fentanyl_color;
        }
        if (vis1_usa_tally === vis1_usa_SCORE[4]) {
            vis1_usa_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_usa_bounds, vis1_usa_tally, vis1_usa_color);
        vis1_usa_tally++;
    }
}

function vis1_GERMANY(vis1_germany_SCORE) {
    vis1_germany_finished = false;
    vis1_germany_interval = setInterval( function(){vis1_run_GERMANY(vis1_allocation_to_benchmarks(vis1_germany_SCORE))}, vis1_global_speed);
}
function vis1_run_GERMANY(vis1_germany_SCORE)
{
    if (vis1_germany_tally===vis1_germany_SCORE[5]){
        vis1_germany_finished = true;
        vis1_close_lid(vis1_germany_bounds);
        clearInterval(vis1_germany_interval);
    }

    if (vis1_germany_tally%12 === 0){
        vis1_germany_slots = vis1_random_slots();
    }
    if (vis1_germany_finished === false){
        if (vis1_germany_tally === vis1_germany_SCORE[0]){
            vis1_germany_color = vis1_morphine_color;
        }
        if (vis1_germany_tally === vis1_germany_SCORE[1]){
            vis1_germany_color = vis1_pethidine_color;
        }
        if (vis1_germany_tally === vis1_germany_SCORE[2]){
            vis1_germany_color = vis1_oxycodone_color;
        }
        if (vis1_germany_tally === vis1_germany_SCORE[3]){
            vis1_germany_color = vis1_fentanyl_color;
        }
        if (vis1_germany_tally === vis1_germany_SCORE[4]) {
            vis1_germany_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_germany_bounds, vis1_germany_tally, vis1_germany_color);
        vis1_germany_tally++;
    }
}
function vis1_CANADA(vis1_canada_SCORE) {
    vis1_canada_finished = false;
    vis1_canada_interval = setInterval( function(){vis1_run_CANADA(vis1_allocation_to_benchmarks(vis1_canada_SCORE))}, vis1_global_speed);
}
function vis1_run_CANADA(vis1_canada_SCORE)
{
    if (vis1_canada_tally===vis1_canada_SCORE[5]){
        vis1_canada_finished = true;
        vis1_close_lid(vis1_canada_bounds);
        clearInterval(vis1_canada_interval);
    }

    if (vis1_canada_tally%12 === 0){
        vis1_canada_slots = vis1_random_slots();
    }
    if (vis1_canada_finished === false){
        if (vis1_canada_tally === vis1_canada_SCORE[0]){
            vis1_canada_color = vis1_morphine_color;
        }
        if (vis1_canada_tally === vis1_canada_SCORE[1]){
            vis1_canada_color = vis1_pethidine_color;
        }
        if (vis1_canada_tally === vis1_canada_SCORE[2]){
            vis1_canada_color = vis1_oxycodone_color;
        }
        if (vis1_canada_tally === vis1_canada_SCORE[3]){
            vis1_canada_color = vis1_fentanyl_color;
        }
        if (vis1_canada_tally === vis1_canada_SCORE[4]) {
            vis1_canada_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_canada_bounds, vis1_canada_tally, vis1_canada_color);
        vis1_canada_tally++;
    }
}
function vis1_UK(vis1_uk_SCORE) {
    vis1_uk_finished = false;
    vis1_uk_interval = setInterval( function(){vis1_run_UK(vis1_allocation_to_benchmarks(vis1_uk_SCORE))}, vis1_global_speed);
}
function vis1_run_UK(vis1_uk_SCORE)
{
    if (vis1_uk_tally===vis1_uk_SCORE[5]){
        vis1_uk_finished = true;
        vis1_close_lid(vis1_uk_bounds);
        clearInterval(vis1_uk_interval);
    }

    if (vis1_uk_tally%12 === 0){
        vis1_uk_slots = vis1_random_slots();
    }
    if (vis1_uk_finished === false){
        if (vis1_uk_tally === vis1_uk_SCORE[0]){
            vis1_uk_color = vis1_morphine_color;
        }
        if (vis1_uk_tally === vis1_uk_SCORE[1]){
            vis1_uk_color = vis1_pethidine_color;
        }
        if (vis1_uk_tally === vis1_uk_SCORE[2]){
            vis1_uk_color = vis1_oxycodone_color;
        }
        if (vis1_uk_tally === vis1_uk_SCORE[3]){
            vis1_uk_color = vis1_fentanyl_color;
        }
        if (vis1_uk_tally === vis1_uk_SCORE[4]) {
            vis1_uk_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_uk_bounds, vis1_uk_tally, vis1_uk_color);
        vis1_uk_tally++;
    }
}
function vis1_SPAIN(vis1_spain_SCORE) {
    vis1_spain_finished = false;
    vis1_spain_interval = setInterval( function(){vis1_run_SPAIN(vis1_allocation_to_benchmarks(vis1_spain_SCORE))}, vis1_global_speed);
}
function vis1_run_SPAIN(vis1_spain_SCORE)
{
    if (vis1_spain_tally===vis1_spain_SCORE[5]){
        vis1_spain_finished = true;
        vis1_close_lid(vis1_spain_bounds);
        clearInterval(vis1_spain_interval);
    }

    if (vis1_spain_tally%12 === 0){
        vis1_spain_slots = vis1_random_slots();
    }
    if (vis1_spain_finished === false){
        if (vis1_spain_tally === vis1_spain_SCORE[0]){
            vis1_spain_color = vis1_morphine_color;
        }
        if (vis1_spain_tally === vis1_spain_SCORE[1]){
            vis1_spain_color = vis1_pethidine_color;
        }
        if (vis1_spain_tally === vis1_spain_SCORE[2]){
            vis1_spain_color = vis1_oxycodone_color;
        }
        if (vis1_spain_tally === vis1_spain_SCORE[3]){
            vis1_spain_color = vis1_fentanyl_color;
        }
        if (vis1_spain_tally === vis1_spain_SCORE[4]) {
            vis1_spain_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_spain_bounds, vis1_spain_tally, vis1_spain_color);
        vis1_spain_tally++;
    }
}
function vis1_FRANCE(vis1_france_SCORE) {
    vis1_france_finished = false;
    vis1_france_interval = setInterval( function(){vis1_run_FRANCE(vis1_allocation_to_benchmarks(vis1_france_SCORE))}, vis1_global_speed);
}
function vis1_run_FRANCE(vis1_france_SCORE)
{
    if (vis1_france_tally===vis1_france_SCORE[5]){
        vis1_france_finished = true;
        vis1_close_lid(vis1_france_bounds);
        clearInterval(vis1_france_interval);
    }

    if (vis1_france_tally%12 === 0){
        vis1_france_slots = vis1_random_slots();
    }
    if (vis1_france_finished === false){
        if (vis1_france_tally === vis1_france_SCORE[0]){
            vis1_france_color = vis1_morphine_color;
        }
        if (vis1_france_tally === vis1_france_SCORE[1]){
            vis1_france_color = vis1_pethidine_color;
        }
        if (vis1_france_tally === vis1_france_SCORE[2]){
            vis1_france_color = vis1_oxycodone_color;
        }
        if (vis1_france_tally === vis1_france_SCORE[3]){
            vis1_france_color = vis1_fentanyl_color;
        }
        if (vis1_france_tally === vis1_france_SCORE[4]) {
            vis1_france_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_france_bounds, vis1_france_tally, vis1_france_color);
        vis1_france_tally++;
    }
}
function vis1_AUSTRALIA(vis1_australia_SCORE) {
    vis1_australia_finished = false;
    vis1_australia_interval = setInterval( function(){vis1_run_AUSTRALIA(vis1_allocation_to_benchmarks(vis1_australia_SCORE))}, vis1_global_speed);
}
function vis1_run_AUSTRALIA(vis1_australia_SCORE)
{
    if (vis1_australia_tally===vis1_australia_SCORE[5]){
        vis1_australia_finished = true;
        vis1_close_lid(vis1_australia_bounds);
        clearInterval(vis1_australia_interval);
    }

    if (vis1_australia_tally%12 === 0){
        vis1_australia_slots = vis1_random_slots();
    }
    if (vis1_australia_finished === false){
        if (vis1_australia_tally === vis1_australia_SCORE[0]){
            vis1_australia_color = vis1_morphine_color;
        }
        if (vis1_australia_tally === vis1_australia_SCORE[1]){
            vis1_australia_color = vis1_pethidine_color;
        }
        if (vis1_australia_tally === vis1_australia_SCORE[2]){
            vis1_australia_color = vis1_oxycodone_color;
        }
        if (vis1_australia_tally === vis1_australia_SCORE[3]){
            vis1_australia_color = vis1_fentanyl_color;
        }
        if (vis1_australia_tally === vis1_australia_SCORE[4]) {
            vis1_australia_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_australia_bounds, vis1_australia_tally, vis1_australia_color);
        vis1_australia_tally++;
    }
}
function vis1_CHINA(vis1_china_SCORE) {
    vis1_china_finished = false;
    vis1_china_interval = setInterval( function(){vis1_run_CHINA(vis1_allocation_to_benchmarks(vis1_china_SCORE))}, vis1_global_speed);
}
function vis1_run_CHINA(vis1_china_SCORE)
{
    if (vis1_china_tally===vis1_china_SCORE[5]){
        vis1_china_finished = true;
        vis1_close_lid(vis1_china_bounds);
        clearInterval(vis1_china_interval);
    }

    if (vis1_china_tally%12 === 0){
        vis1_china_slots = vis1_random_slots();
    }
    if (vis1_china_finished === false){
        if (vis1_china_tally === vis1_china_SCORE[0]){
            vis1_china_color = vis1_morphine_color;
        }
        if (vis1_china_tally === vis1_china_SCORE[1]){
            vis1_china_color = vis1_pethidine_color;
        }
        if (vis1_china_tally === vis1_china_SCORE[2]){
            vis1_china_color = vis1_oxycodone_color;
        }
        if (vis1_china_tally === vis1_china_SCORE[3]){
            vis1_china_color = vis1_fentanyl_color;
        }
        if (vis1_china_tally === vis1_china_SCORE[4]) {
            vis1_china_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_china_bounds, vis1_china_tally, vis1_china_color);
        vis1_china_tally++;
    }
}
function vis1_BELGIUM(vis1_belgium_SCORE) {
    vis1_belgium_finished = false;
    vis1_belgium_interval = setInterval( function(){vis1_run_BELGIUM(vis1_allocation_to_benchmarks(vis1_belgium_SCORE))}, vis1_global_speed);
}
function vis1_run_BELGIUM(vis1_belgium_SCORE)
{
    if (vis1_belgium_tally===vis1_belgium_SCORE[5]){
        vis1_belgium_finished = true;
        vis1_close_lid(vis1_belgium_bounds);
        clearInterval(vis1_belgium_interval);
    }

    if (vis1_belgium_tally%12 === 0){
        vis1_belgium_slots = vis1_random_slots();
    }
    if (vis1_belgium_finished === false){
        if (vis1_belgium_tally === vis1_belgium_SCORE[0]){
            vis1_belgium_color = vis1_morphine_color;
        }
        if (vis1_belgium_tally === vis1_belgium_SCORE[1]){
            vis1_belgium_color = vis1_pethidine_color;
        }
        if (vis1_belgium_tally === vis1_belgium_SCORE[2]){
            vis1_belgium_color = vis1_oxycodone_color;
        }
        if (vis1_belgium_tally === vis1_belgium_SCORE[3]){
            vis1_belgium_color = vis1_fentanyl_color;
        }
        if (vis1_belgium_tally === vis1_belgium_SCORE[4]) {
            vis1_belgium_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_belgium_bounds, vis1_belgium_tally, vis1_belgium_color);
        vis1_belgium_tally++;
    }
}
function vis1_AUSTRIA(vis1_austria_SCORE) {
    vis1_austria_finished = false;
    vis1_austria_interval = setInterval( function(){vis1_run_AUSTRIA(vis1_allocation_to_benchmarks(vis1_austria_SCORE))}, vis1_global_speed);
}
function vis1_run_AUSTRIA(vis1_austria_SCORE)
{
    if (vis1_austria_tally===vis1_austria_SCORE[5]){
        vis1_austria_finished = true;
        vis1_close_lid(vis1_austria_bounds);
        clearInterval(vis1_austria_interval);
    }

    if (vis1_austria_tally%12 === 0){
        vis1_austria_slots = vis1_random_slots();
    }
    if (vis1_austria_finished === false){
        if (vis1_austria_tally === vis1_austria_SCORE[0]){
            vis1_austria_color = vis1_morphine_color;
        }
        if (vis1_austria_tally === vis1_austria_SCORE[1]){
            vis1_austria_color = vis1_pethidine_color;
        }
        if (vis1_austria_tally === vis1_austria_SCORE[2]){
            vis1_austria_color = vis1_oxycodone_color;
        }
        if (vis1_austria_tally === vis1_austria_SCORE[3]){
            vis1_austria_color = vis1_fentanyl_color;
        }
        if (vis1_austria_tally === vis1_austria_SCORE[4]) {
            vis1_austria_color = vis1_hydromorphone_color;
        }
        vis1_generate_pill(vis1_austria_bounds, vis1_austria_tally, vis1_austria_color);
        vis1_austria_tally++;
    }
}

function vis1_drop_pills(vis1_data_array) {
    console.log(vis1_data_array);
    if (vis1_check_animation_status() === true)
    {
        vis1_open_pill_bottle_lids();
        vis1_reset_intervals_and_tallies();
        vis1_USA(vis1_allocate_pills(vis1_data_array[0]));
        vis1_GERMANY(vis1_allocate_pills(vis1_data_array[1]));
        vis1_CANADA(vis1_allocate_pills(vis1_data_array[2]));
        vis1_UK(vis1_allocate_pills(vis1_data_array[3]));
        vis1_SPAIN(vis1_allocate_pills(vis1_data_array[4]));
        vis1_FRANCE(vis1_allocate_pills(vis1_data_array[5]));
        vis1_AUSTRALIA(vis1_allocate_pills(vis1_data_array[6]));
        vis1_CHINA(vis1_allocate_pills(vis1_data_array[7]));
        vis1_BELGIUM(vis1_allocate_pills(vis1_data_array[8]));
        vis1_AUSTRIA(vis1_allocate_pills(vis1_data_array[9]));
    }else{
        console.log("Animation in process");
    }
}

//------------------------------------------------------
//               HELPER FUNCTIONS
//------------------------------------------------------
//https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function vis1_getRandomInt(VIS1_min, VIS1_max) {
    return Math.floor(Math.random() * (VIS1_max - VIS1_min + 1)) + VIS1_min;
}

/*
 * Randomize array of numbers 0-12, which represent slots for pill dropping
 * Using Durstenfeld shuffle algorithm, found here:
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
function vis1_random_slots() {
    var vis1_array = [0,1,2,3,4,5,6,7,8,9,10,11];
    for (var i = vis1_array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = vis1_array[i];
        vis1_array[i] = vis1_array[j];
        vis1_array[j] = temp;
    }
    return vis1_array;
}


function vis1_reset_intervals_and_tallies(){
    vis1_usa_interval = 0;
    vis1_germany_interval = 0;
    vis1_canada_interval = 0;
    vis1_uk_interval = 0;
    vis1_spain_interval = 0;
    vis1_france_interval = 0;
    vis1_australia_interval = 0;
    vis1_china_interval = 0;
    vis1_belgium_interval = 0;
    vis1_austria_interval = 0;
    vis1_usa_tally = 0;
    vis1_germany_tally = 0;
    vis1_canada_tally = 0;
    vis1_uk_tally = 0;
    vis1_spain_tally = 0;
    vis1_france_tally = 0;
    vis1_australia_tally = 0;
    vis1_china_tally = 0;
    vis1_belgium_tally = 0;
    vis1_austria_tally = 0;
    vis1_usa_color = vis1_methadone_color;
    vis1_germany_color = vis1_methadone_color;
    vis1_canada_color = vis1_methadone_color;
    vis1_uk_color = vis1_methadone_color;
    vis1_spain_color = vis1_methadone_color;
    vis1_france_color = vis1_methadone_color;
    vis1_australia_color = vis1_methadone_color;
    vis1_china_color = vis1_methadone_color;
    vis1_belgium_color = vis1_methadone_color;
    vis1_austria_color = vis1_methadone_color;
    vis1_svg.selectAll(".vis1_pill").remove();
}

function vis1_check_animation_status(){
    if (vis1_usa_finished === true &&
        vis1_germany_finished === true &&
        vis1_canada_finished === true &&
        vis1_uk_finished === true &&
        vis1_spain_finished === true &&
        vis1_france_finished === true &&
        vis1_australia_finished === true &&
        vis1_china_finished === true &&
        vis1_belgium_finished === true &&
        vis1_austria_finished === true)
    {
        return true;
    }else{
        return false;
    }
}

//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//                         MANIPULATING THE VISUAL ACCORDING TO USER INPUTS
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
queue()
    .defer(d3.json, "data/vis1.json")
    .await(vis1_data_loaded);

var vis1_ALL_DATA;
var vis1_LOADED = false;

function vis1_data_loaded(error, vis1_data){
    vis1_ALL_DATA = vis1_data;
    vis1_initiate_program();
}

function vis1_initiate_program(){
    console.log(vis1_ALL_DATA);
    vis1_LOADED = true;
}

function vis1_GO() {
    if (vis1_LOADED === true) {
        // USA   GERMANY   CANADA   UK   SPAIN   FRANCE   AUSTRALIA  CHINA   BELGIUM   AUSTRIA
        var vis1_total_pills_per_country = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var vis1_macro_no_data_tracker = ['', '', '', '', '', '', '', '', '', ''];

        // Determine which year we want
        var vis1_targetYear = document.getElementById("vis1_singleYear").value;

        // Determine which substances we want
        var vis1_METHADONE = document.getElementById("vis1_methadone").checked;
        var vis1_MORPHINE = document.getElementById("vis1_morphine").checked;
        var vis1_PETHIDINE = document.getElementById("vis1_pethidine").checked;
        var vis1_OXYCODONE = document.getElementById("vis1_oxycodone").checked;
        var vis1_FENTANYL = document.getElementById("vis1_fentanyl").checked;
        var vis1_HYDROMORPHONE = document.getElementById("vis1_hydromorphone").checked;

        // Go through each country, go to that year, and tally the values of those substances
        var vis1_methadone_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var vis1_morphine_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var vis1_pethidine_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var vis1_oxycodone_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var vis1_fentanyl_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var vis1_hydromorphone_results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (vis1_METHADONE === true){
            vis1_methadone_results = vis1_add_substance(vis1_targetYear, "Methadone");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_methadone_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_methadone_results[1][i];
            }
        }else{
            vis1_methadone_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        if(vis1_MORPHINE === true){
            vis1_morphine_results = vis1_add_substance(vis1_targetYear, "Morphine");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_morphine_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_morphine_results[1][i];
            }
        }else{
            vis1_morphine_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        if(vis1_PETHIDINE === true){
            vis1_pethidine_results = vis1_add_substance(vis1_targetYear, "Pethidine");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_pethidine_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_pethidine_results[1][i];
            }
        }else{
            vis1_pethidine_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        if(vis1_OXYCODONE === true){
            vis1_oxycodone_results = vis1_add_substance(vis1_targetYear, "Oxycodone");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_oxycodone_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_oxycodone_results[1][i];
            }
        }else{
            vis1_oxycodone_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        if(vis1_FENTANYL === true){
            vis1_fentanyl_results = vis1_add_substance(vis1_targetYear, "Fentanyl");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_fentanyl_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_fentanyl_results[1][i];
            }
        }else{
            vis1_fentanyl_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        if(vis1_HYDROMORPHONE === true){
            vis1_hydromorphone_results = vis1_add_substance(vis1_targetYear, "Hydromorphone");
            for (var i = 0; i<10; i++){
                vis1_total_pills_per_country[i] += vis1_hydromorphone_results[0][i];
                vis1_macro_no_data_tracker[i] += vis1_hydromorphone_results[1][i];
            }
        }else{
            vis1_hydromorphone_results = [[0,0,0,0,0,0,0,0,0,0],['', '', '', '', '', '', '', '', '', '']];
        }
        vis1_total_pills_per_country = vis1_kg_to_pills(vis1_total_pills_per_country);
        for (var i = 0; i<10; i++){
            var vis1_portions = [0,0,0,0,0,0];
            var vis1_temp_sum = vis1_methadone_results[0][i] + vis1_morphine_results[0][i] + vis1_pethidine_results[0][i] + vis1_oxycodone_results[0][i] + vis1_fentanyl_results[0][i] + vis1_hydromorphone_results[0][i];
            vis1_portions[0] = (Math.round(100*vis1_methadone_results[0][i]/vis1_temp_sum))/100;
            vis1_portions[1] = (Math.round(100*vis1_morphine_results[0][i]/vis1_temp_sum))/100;
            vis1_portions[2] = (Math.round(100*vis1_pethidine_results[0][i]/vis1_temp_sum))/100;
            vis1_portions[3] = (Math.round(100*vis1_oxycodone_results[0][i]/vis1_temp_sum))/100;
            vis1_portions[4] = (Math.round(100*vis1_fentanyl_results[0][i]/vis1_temp_sum))/100;
            vis1_portions[5] = (Math.round(100*vis1_hydromorphone_results[0][i]/vis1_temp_sum))/100;
            vis1_total_pills_per_country[i] = [vis1_total_pills_per_country[i], vis1_portions];

        }

        console.log(vis1_total_pills_per_country);
        console.log(vis1_macro_no_data_tracker);
        console.log('----------');
        console.log(vis1_pethidine_results);
        vis1_drop_pills(vis1_total_pills_per_country);
    }
}

function vis1_add_substance(vis1_selected_year, vis1_selected_substance){

    console.log("ADDING: " + vis1_selected_substance + " for the year " + vis1_selected_year);

    var vis1_selected_year_position = vis1_selected_year - 1980;
    var vis1_substance_holder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var vis1_micro_no_data_tracker = ['', '', '', '', '', '', '', '', '', ''];

    vis1_substance_holder[0] = vis1_checkValue(vis1_ALL_DATA["USA"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[1] = vis1_checkValue(vis1_ALL_DATA["Germany"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[2] = vis1_checkValue(vis1_ALL_DATA["Canada"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[3] = vis1_checkValue(vis1_ALL_DATA["United Kingdom"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[4] = vis1_checkValue(vis1_ALL_DATA["Spain"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[5] = vis1_checkValue(vis1_ALL_DATA["France"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[6] = vis1_checkValue(vis1_ALL_DATA["Australia"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[7] = vis1_checkValue(vis1_ALL_DATA["China"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[8] = vis1_checkValue(vis1_ALL_DATA["Belgium"][vis1_selected_year_position][vis1_selected_substance]);
    vis1_substance_holder[9] = vis1_checkValue(vis1_ALL_DATA["Austria"][vis1_selected_year_position][vis1_selected_substance]);

    for (var i = 0; i<10; i++){
        if (vis1_substance_holder[i].length > 1){
            vis1_micro_no_data_tracker[i] = (" " + vis1_selected_substance + ",");
            vis1_substance_holder[i] = 0;
        }
    }
    console.log([vis1_substance_holder, vis1_micro_no_data_tracker]);
    return [vis1_substance_holder, vis1_micro_no_data_tracker];
}

function vis1_checkValue(vis1_value_result){
    if (vis1_value_result === "N/A"){
        return [0, "N/A"];
    }else{
        return parseFloat(vis1_value_result);
    }

}

function vis1_kg_to_pills(vis1_kg_array){
    var vis1_new_pill_array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i<10; i++){
        vis1_new_pill_array[i] = Math.round(vis1_kg_array[i]/500);
    }
    return vis1_new_pill_array;

}

// takes array nest of the form [429, [0.28, 0.09, 0, 0.38, 0.19, 0.05]], for example
function vis1_allocate_pills(vis1_portion_array) {
    var vis1_complete = vis1_portion_array[0];
    var vis1_categorized_pills = [0, 0, 0, 0, 0, 0];
    var vis1_rounding_check = 0;

    for (var i = 0; i < 6; i++) {
        vis1_categorized_pills[i] = Math.round(vis1_portion_array[0] * vis1_portion_array[1][i]);
    }
    for (var j = 0; j < 6; j++) {
        vis1_rounding_check += vis1_categorized_pills[j];
    }
    if (vis1_rounding_check < vis1_complete) {
        var vis1_pills_remaining = vis1_complete - vis1_rounding_check;
        var vis1_pill_priority = vis1_portion_array[1].sort(function (a, b) {
            return b - a;
        });
        for (var k = 0; k < vis1_pills_remaining; k++) {
            vis1_categorized_pills[vis1_categorized_pills.indexOf(Math.round(vis1_portion_array[0] * vis1_pill_priority[k]))] += 1;
        }
    }
    return [vis1_complete, vis1_categorized_pills];
}

function vis1_allocation_to_benchmarks(vis1_AA){
    return [vis1_AA[1][0],
        vis1_AA[1][0] + vis1_AA[1][1],
        vis1_AA[1][0]+vis1_AA[1][1]+vis1_AA[1][2],
        vis1_AA[1][0]+vis1_AA[1][1]+vis1_AA[1][2]+vis1_AA[1][3],
        vis1_AA[1][0]+vis1_AA[1][1]+vis1_AA[1][2]+vis1_AA[1][3]+vis1_AA[1][4],
        vis1_AA[1][0]+vis1_AA[1][1]+vis1_AA[1][2]+vis1_AA[1][3]+vis1_AA[1][4]+vis1_AA[1][5]]
}
yikers = [429, [0.28, 0.09, 0, 0.38, 0.19, 0.05]];
console.log(vis1_allocate_pills(yikers));
console.log(vis1_allocation_to_benchmarks(vis1_allocate_pills([429, [0.28, 0.09, 0, 0.38, 0.19, 0.05]])));



var vis1_label_holder = ["USA", "Germany", "Canada", "UK", "Spain", "France", "Australia", "China", "Belgium", "Austria"];
console.log(vis1_label_holder[1]);

for (var i =0; i<vis1_label_holder.length; i++){
    console.log(vis1_label_holder[i]);
    vis1_svg.append("text")
        .attr("x", 60 + 120*i)
        .attr("y", 55)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .style("font-weight", "bolder")
        .text(vis1_label_holder[i].toUpperCase());
}