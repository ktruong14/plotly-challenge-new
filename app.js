// Creating table
function demographicInfo(id) {

    // Use d3.json() to fetch data from JSON file
    // Incoming data is internally referred to as data
    d3.json("samples.json").then((data) => {
        // Grabbing metadata from samples.json
        var meta = data.metadata;
        // Filtering metadata 
        samples = meta.filter(sample => sample.id.toString() === id)[0];
        // Using d3 to select the panel body sample metadata 
        metaData = d3.select("#sample-metadata");
        // Clearing existing data
        metaData.html("");
        // Use 'Object.entries' to console.log each data value
        Object.entries(samples).forEach(([key, value]) => {
            metaData.append("p").text(`${key}:${value}`);
        });
    });
};

// Function for generating bar and bubble chart
function createChart(id) {

    // Building Horizontal Bar Chart
    d3.json("samples.json").then((data) => {
        // Viewing data with console log
        console.log(data);
        // Filtering samples
        var samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        // Slicing first 10 objects for plotting
        // Reversing the array to accommodate Plotly's defaults
        sampleValues = samples.sample_values.slice(0, 10).reverse()
        sampleID = samples.otu_ids.slice(0, 10).reverse()
        sampleText = samples.otu_labels.slice(0, 10).reverse()

        var trace0 = {
            x: sampleValues,
            y: sampleID,
            text: sampleText,
            type: "bar",
            orientation: "h"
        };

        // Data
        var data0 = [trace0];

        // Layout
        var layout0 = {
            title: "Top 10 OTUs",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 20
            }
        };
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data0, layout0);

        // Building Bubble Chart
        var xValue = samples.otu_ids;
        var yValue = samples.sample_values;
        var markerSize = samples.sample_values;
        var markerColour = samples.otu_ids;
        var textValue = samples.otu_labels;

        var trace1 = {
            x: xValue,
            y: yValue,
            text: textValue,
            mode: "markers",
            marker: {
                size: markerSize,
                color: markerColour
            }
        };

        // Data
        var data1 = [trace1];

        // Layout
        var layout1 = {
            title: "Belly Button Biodiversity",
            xaxis: { title: "OTU ID" }
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", data1, layout1);
    });
}

// Function that updates all of the plots when a new sample is selected
function optionChanged(id) {
    // Fetching new data when new sample is selected
    demographicInfo(id);
    createChart(id);
};

// This function is called when a dropdown menu item is selected
function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable 
    d3.json("samples.json").then((data) => {
        console.log(data);

        // Assign the value of the dropdown menu option to a variable
        data.names.forEach(function (name) {
            dropdownMenu.append("option").text(name).property("value");
        });
        // Display demographic info and plots
        createChart(data.names[0]);
        demographicInfo(data.names[0]);
    });
};
updatePlotly();
