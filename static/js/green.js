
function initialize(){
  $("#chart").hide();

     activeTab = $('#tab_1');
     activeTabContent = $("#tabcontent_1");
     $("#tabcontent_2").hide();

     //$("#map").show();
     $("#tab_2").click(function(){
        console.log("here")
        $('#tab_2').addClass("active");
        $('#tab_1').removeClass("active");
        $("#tabcontent_1").hide()
        $("#tabcontent_2").show();
        $("#chart").show();
        drawChart();
     });

     $("#tab_1").click(function(){
      $('#tab_2').removeClass("active");
      $('#tab_1').addClass("active");
      $("#tabcontent_1").show()
      $("#tabcontent_2").hide();
      $("#chart").hide();
     });

     $('#drawer').click(function(){
            var width = $(window).width(); var height = $(window).height();
            $('#svgContainer').empty();
            console.log('click');

            if (!infoGraphToggle){
                console.log("here1");
                $('#infoGraphic').show();


                
                $('#svgContainer').width(width * 0.7);
                $('#infoGraphic').css('left', width * 0.7);
                $('#infoGraphic').css('width', width * 0.3);
                $('#chart').css('width', $('#infoGraphic').width());
                $('#chart').css('height', $('#infoGraphic').height() * 0.95);


                
                $('#drawer').css('left', width * 0.7);
                $('#button-icon').removeClass('glyphicon glyphicon-chevron-left');
                $('#button-icon').addClass('glyphicon glyphicon-chevron-right');
            } else {
                console.log("here2");
                $('#infoGraphic').hide();
                $('#svgContainer').width(width * 1.0);
                $('#infoGraphic').css('left', width * 1.0);
                $('#infoGraphic').css('width', width * 0);
                $('#drawer').children().find('span').css('class','glyphicon glyphicon-arrow-left');
                $('#chart').empty();
                $("#title").empty();
                $('#button-icon').removeClass('glyphicon glyphicon-chevron-right');
                $('#button-icon').addClass('glyphicon glyphicon-chevron-left');
                $('#drawer').css('left', width * 0.95);
            }

            infoGraphToggle = !infoGraphToggle;
            setProjection();
            drawMap();
            //drawCircles();
            // console.log('end chart');            

        });

}

function setProjection(){ 
  projection.scale(1)
    .translate([0, 0]);

  width = $("#svgContainer").width(); height = $("#svgContainer").height();
  console.log(width, height);
  var b = path.bounds(geoJSON),
    s = scaleFactor / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  projection.scale(s).translate(t);
  projection([-87.715044,41.93202]);
}




function drawChart(){
  var chartHeight = $("#chart").height();
  var chartWidth = $("#chart").width();

  var maxBarWidth = chartWidth-2; var barHeight = 20;
  var svg = d3.select("#chart").append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);


  var barLabel = function(d) { return d['name']; };
  var barValue = function(d) { return d['numAccidents']; };
  
  var yScale = d3.scale.ordinal().domain(d3.range(0, chartData.length)).rangeBands([0, chartData.length * barHeight]);
  var y = function(d, i) { return yScale(i); };
  var x = d3.scale.linear().domain([0, d3.max(chartData, barValue)]).range([0, maxBarWidth]);

  var chart = d3.select('#chart').append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
  var gridContainer = chart.append('g')


  svg.selectAll("rect")
      .data(chartData)
    .enter().append("rect")
      .attr("y", y)
      .attr('height', 5)
      .attr("fill", "#FA8602")
      .attr("stroke", "white")
      .attr('opacity',0.3)
      .on('mouseover', function(d){
        d3.select(this).attr('opacity', 1.0);
      })
      .on('mouseout', function (){
        d3.select(this).attr('opacity',0.3);
      })
      .transition()
      .ease("elastic")
        .duration(1000)
        .attr("x", 0)
        .attr('width', function(d) { return x(barValue(d)); });
  
  svg.selectAll("circle")
    .data(chartData)
    .enter().append("circle")
      .attr("cy",y)
      .attr("cx", function(d) { return x(barValue(d)); })
      .attr("r", 3)
      .attr("fill","#FA8602" );
      $('svg rect').tipsy({ 
          gravity: 's', 
          fade:true,
          html: true, 
          title: function() {
            var d = this.__data__.name;
            var val = this.__data__.numAccidents;
            return '<p style="#FA8602">' + d + ', # Accidents =  <span style="#FA8602">' + val + '</span></p>'; 
          }
        });


}


  function toggleStreetView(latlng, show){
        
        if (show){
          var panoramaOptions = {
            position: latlng,
            pov: {
              heading: 0,
              pitch: -10,
              zoom: 1
            },
            //map: map,
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            panControl:false,
            zoomControl:false
        };
       
        pano = new google.maps.StreetViewPanorama(document.getElementById("street-view"), panoramaOptions);
        } else{
          $('#street-view').html('');
        }
  }

function drawMap(){
  svg = d3.select("#svgContainer").append("svg");

  svg.selectAll("path")
    .data(geoJSON.features)
   .enter().append("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke-opacity", 0.1)
    .attr("stroke", "black");
}

function blur() {
  filter.attr("stdDeviation", this.value / 5);
}

function drawController(){

  if (drawIndex <= maxPoints){

    if (points.length > 1000){
      currentDrawPoints = points.splice(0,1000);
      drawIndex += currentDrawPoints.length;
      console.log("middle",drawIndex);
      setTimeout(drawCircles, 200);
    } else {
        drawIndex += points.length;
        currentDrawPoints = points;
        console.log("end", drawIndex);
        setTimeout(drawCircles,200);
    }
  }
}

function drawCircles(){

  
  var opValue = function(d) { return d.properties.opacity; };

  var radValue = function(d){ return d.properties.radius;};

  var maxOpVal = d3.max(greenData.features, opValue);
  var maxRadVal = d3.max(greenData.features, radValue);

  var opScale = d3.scale.sqrt().domain([0, maxOpVal]).range([0.0, 1]);
  var radiusScale = d3.scale.sqrt().domain([0, 3]).range([0.05, 2.0]); 

  var colorScale = d3.scale.sqrt().domain([0,maxOpVal]).range(['#57C900', '#275901']);

  var filter = svg.append("defs")
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 1.2);

  g = svg.append('g');

  g.selectAll('path')
    .data(greenData.features)
    .enter().append("circle")
    .attr("class", "greens")
    .attr("r", function(d,i){ return radiusScale(d.properties.radius);})
    .attr('cx', function (d) {       
      return projection([parseFloat(d.geometry.coordinates[1]), parseFloat(d.geometry.coordinates[0])])[0]; 
    })
    .attr('cy', function (d) {
      return projection([parseFloat(d.geometry.coordinates[1]), parseFloat(d.geometry.coordinates[0])])[1]; 
    })
    .attr("fill",function(d){return colorScale(d.properties.opacity);})
    .attr("stroke", function(d){return colorScale(d.properties.opacity);})
    .attr("opacity", function(d){return opScale(d.properties.opacity);});

    
  
}
  




  

    

   

   