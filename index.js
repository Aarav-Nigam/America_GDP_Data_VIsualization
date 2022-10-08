
//Defining the variables that will keep the data of the request
let data
let values = []

//Function variables that will create scales
let heightScale //To interpolate the height values of the bar
let widthScale  //To interpolate the width values of the bar
let xAxisScale  //To make the axises
let yAxisScale

//Definig the canvas size
let width = 800
let height = 600
let padding = 60

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let xhr = new XMLHttpRequest()
xhr.open('GET', url, true)
xhr.onload = () => {
    data = JSON.parse(xhr.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
xhr.send()

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    //To interpolate the height values of the bar
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2*padding)])

    //To interpolate the width values of the bar
    widthScale = d3.scaleLinear()
                    .domain([0, values.length -1])
                    .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    //It is scaleTime bacause we are passing date objects
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width-padding])

    //scaleLinear for normal strings
    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding ])
}

let drawBars =() => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return widthScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })        
}

let generateAxes = () => {

    //builtin function to generate axes
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')');
        //Setting the location of the x-axis
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Years--->");

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)');
        //Setting the location of the y-axis
        console.log("a");
        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("GDP(in billions--->)");
        
}

