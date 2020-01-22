// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 700;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select scatter, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from csv
d3.csv("assets/data/data.csv").then(function(stateData) {

  // Print the data
  console.log(stateData);

  // Cast the values to a number for each piece of data
  stateData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
  });

  // x function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.healthcare)*.8,
        d3.max(stateData, d => d.healthcare)*1.1])
    .range([0, chartWidth]);
  // y function  
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.obesity)*1.1])
    .range([chartHeight, 0]);
  
  // set axes  
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // x axis
  chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
  // y axis      
  chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);
  
  // chart circles      
  chartGroup.selectAll('circle')
        .data(stateData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.healthcare))
        .attr('cy', d => yLinearScale(d.obesity))
        .attr('r', 13)
        .attr('fill', 'green')
        .attr('opacity', .7);

  // add text to circles      
  chartGroup.selectAll('text.text-circles')
        .data(stateData)
        .enter()
        .append('text')
        .classed('text-circles', true)
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d.healthcare))
        .attr('y', d => yLinearScale(d.obesity))
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'yellow');

  // y axis      
  chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 30 - chartMargin.left)
        .attr('x', 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed('active', true)
        .text('Lacks Healthcare (%)');

    // x axis    
    chartGroup.append('text')
        .attr('y', chartHeight + chartMargin.bottom / 2 - 10)
        .attr('x', chartWidth / 2)
        .attr("dy", "1em")
        .classed('active', true)
        .text('Obesity Rate (%)')

    });