// // SVG margin convention
// var vis2_margin = {top: 0, right: 0, bottom: 0, left: 0},
//             vis2_width = 500 - vis2_margin.left - vis2_margin.right,
//             vis2_height = 300 - vis2_margin.top - vis2_margin.bottom;

// // make a new svg drawing area
// var vis2drugs = d3.select("#vis2drugs").append("svg")
//     .attr("width", vis2_width + vis2_margin.left + vis2_margin.right)
//     .attr("height", vis2_height + vis2_margin.top + vis2_margin.bottom)
// 	.append("g")
//     .attr("transform", "translate(" + vis2_margin.left + "," + vis2_margin.top + ")");

// vis2drugs.append('text')
//     .attr('font-family', 'FontAwesome')
//     .attr('font-size', "1.4em")
//     .attr("class", "fa")
//     .text(function (d) {return '\uf118';}); 

// vis2drugs.append("image")
//     .attr("xlink:href", "https://github.com/favicon.ico")
//     .attr("x", -8)
//     .attr("y", -8)
//     .attr("width", 16)
//     .attr("height", 16);

// g.append('svg:foreignObject')
//     .attr("width", 100)
//     .attr("height", 100)
//     .append("xhtml:body")
//     .html('<i class="icon-fixed-width icon-user">&#xf118</i>');

// d3.select('#vis2drugs').appendHTML('<i class="fa fa-male" aria-hidden="true"></i>');


// $('#vis2drugs').appendChild('<i class="fa fa-trash-o" aria-hidden="true"></i>');