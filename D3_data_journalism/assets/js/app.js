// svg container
var svgHeight = 800;
var svgWidth = 900;

// margins
var margin = {
    top: 50,
    right: 50,
    bottom: 125,
    left: 125
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data and load data for D3 Journalism data
d3.csv("assets/data/data.csv").then(function (censusData) {

    // // Data
    // console.log(censusData);

    // Parse Data/Cast as numbers
    censusData.forEach(function (data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    // Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.age) - 1, d3.max(censusData, d => d.age) + 1])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.smokes) - 2, d3.max(censusData, d => d.smokes) + 2])
        .range([chartHeight, 0]);

    // Create axis functions
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Create Circles
    var circeLabel = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("cx", d => xLinearScale(d.age))
        .attr("r", "10")
        .attr("opacity", "0.75")
        .attr("class", "stateCircle")
        .attr("stroke", "black");


    // Set tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function (d) {
            return (`<strong>${d.state}</br></br>Smokers(%):</br>${d.smokes}</br></br>Age (%):</br> ${d.age}<strong>`);
        });

    // Create tooltip in the chart
    svg.call(toolTip);

    // Create event listenersd to display and hide the tooltip
    // mouseclick event
    circeLabel.on("click", function (data) {
        toolTip.show(data, this);
    });
    // onmouseover event
    circeLabel.on("mouseover", function (data) {
        toolTip.show(data, this);
    });
    // onmouseout event
    circeLabel.on("mouseout", function (data) {
        toolTip.hide(data, this);
    });

    // Create axes labels and state abbreviations

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 37)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-size", "16px")
        .attr("fill", "green")
        .text("Smokers (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("fill", "orange")
        .attr("font-size", "16px")
        .text("Age (%)");

    // State Abbreviation in the Circles
    chartGroup.append("text")
        .attr("class", "stateText")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
        .attr("x", data => xLinearScale(data.age))
        .attr("y", data => yLinearScale(data.smokes - 0.1))
        .text(data => data.abbr);

}).catch(function (error) {
    console.log(error);

});

