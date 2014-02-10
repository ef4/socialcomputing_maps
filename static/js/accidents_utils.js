var activeTab;
var activeTabContent;
var pano;
var chartData = [];
var chartDrawn = false;
var finalClusters;
var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection); 
var geoJSON;
var svg;
var infoGraphToggle = false;
var maxWidth = 1;
var map;
var allData;
var showAllFlag = true;
var lightBoxShown = false;


function initialize(){
  $('#drawer').click(function(){
    var width = $(window).width(); var height = $(window).height();
    console.log('clicked');
    if (!infoGraphToggle){
      console.log('here');
      $('#infoGraphic').css('visibility', 'visible');
      $('#infoGraphic').css('left', width * 0.7);
      $('#infoGraphic').css('width', width * 0.3);
      $('#chart').css('width', $('#infoGraphic').width());
      $('#chart').css('height', $('#infoGraphic').height() * 0.95);
      $('#drawer').css('left', width * 0.7);
      $('#button-icon').removeClass('glyphicon glyphicon-chevron-left');
      $('#button-icon').addClass('glyphicon glyphicon-chevron-right');
      drawChart();
    } else {
      console.log('here2');
      $('#infoGraphic').css('visibility','hidden');
      //$('#svgContainer').width(width * 1.0);
      $('#infoGraphic').css('left', width * 1.0);
      $('#infoGraphic').css('width', width * 0);
      $('#drawer').children().find('span').css('class','glyphicon glyphicon-arrow-left');
      $('#chart').empty();
      $('#button-icon').removeClass('glyphicon glyphicon-chevron-right');
      $('#button-icon').addClass('glyphicon glyphicon-chevron-left');
      $('#drawer').css('left', width * 0.95);
    }
    infoGraphToggle = !infoGraphToggle;
  });

   activeTab = $('#tab_1');
   activeTabContent = $("#tabcontent_1");
   $("#tabcontent_2").hide();

   $("#tab_2").click(function(){
      $(this).css('background-color','rgba(43, 40, 40, 0.7)');
      $("#tab_1").css('background-color', 'rgba(43, 40, 40, 0.1)');
      $("#tabcontent_1").hide()
      $("#tabcontent_2").show();
      $("#chart").empty();
   });

   $("#tab_1").click(function(){
    $(this).css('background-color','rgba(43, 40, 40, 0.7)');
    $("#tab_2").css('background-color', 'rgba(43, 40, 40, 0.1)');
    $("#tabcontent_1").show()
    $("#tabcontent_2").hide();
    drawChart();
   });

   $('#svgContainer').on('mouseover', function(){
    if (!showAllFlag){
      var accidents = d3.selectAll('g circle')[0];
      for (var acc in accidents){
        accidents[acc].setAttribute('visibility', 'show');
      }
      var clusters = d3.selectAll('g path')[0];
      for (var cl in clusters){
        clusters[cl].setAttribute('visibility', 'show');
      }
    }
    showAllFlag = !showAllFlag; 
   })

   $('#data-source').click(function(){
    lightBoxShown = true;
    $('#svgContainer').css('opacity',0.1);

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var selfWidth = $(this).width(); var selfHeight = $(this).height();
    var moveX = 0.4*(windowWidth - selfWidth);
    var moveY = 0.35*(windowHeight - selfHeight);

    $('#data-lightbox').animate({
        'opacity':1.0}, 2000
    );

   });

  
  $('#svgContainer').click(function(){
      closeLightBox();
  });

  $('#lightbox-close').click(function(){
    closeLightBox();
  })

}


function closeLightBox(){
  if (lightBoxShown){
      $('#data-lightbox').animate({
        'opacity':0.0}, 'fast'
      );

      $('#svgContainer').animate({'opacity':1.0},'slow');
      lightBoxShown = false;
    };
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
}


function processChartData(streetData){
  for (var street in streetData){
    if (streetData[street].length > maxWidth){ maxWidth = streetData[street].length;}
    chartData.push({'name': street, 'numAccidents': streetData[street].length});
  }
  //sort
  chartData.sort(function(a, b) {return d3.descending(a.numAccidents, b.numAccidents);})
  chartData.splice(25);

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
      .attr('height', 15)
      .attr("fill", "#FA8602")
      .attr("stroke", "#FA8602")
      .attr('opacity',0.3)
      .on('mouseover', function(d){
        d3.select(this).attr('opacity', 1.0);
      })
      .on('mouseout', function (){
        d3.select(this).attr('opacity',0.3);
      })
      .on('click', function(d){
          showAllFlag = false;
          var accidents = d3.selectAll('g circle')[0];
          for (var acc in accidents){
            name = accidents[acc].className.animVal;
            if (name.indexOf(d.name) != -1){
              accidents[acc].setAttribute('visibility', 'show');
            } else {
              accidents[acc].setAttribute('visibility', 'hidden');
            }
          }

          var clusters = d3.selectAll('g path')[0];
          for (cl in clusters){
            name = clusters[cl].className.animVal;
            if (name.indexOf(d.name) != -1){
              clusters[cl].setAttribute('visibility', 'show');
            } else {
              clusters[cl].setAttribute('visibility', 'hidden');
            }
          }

          
      })
      .attr("x", function (d) {return chartWidth - x(barValue(d)) -20 ;})
      
      .transition().delay(function (d,i){ return i * 50;})
        .ease("elastic")
          .attr('width', function(d) { return x(barValue(d)); });
  
 
      $('svg rect').tipsy({ 
          gravity: 'e', 
          html: true, 
          title: function() {
            var d = this.__data__.name;
            var val = this.__data__.numAccidents;
            return '<p style="color:#FA8602;font-size:10pt;padding-top:8px;letter-spacing:2px;opacity:0.7;">' + d + ':<span style="color:#FA8602;">' + val + '</span> accidents</p>'; 
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
      navigationControl: false,
      enableCloseButton: false,
      addressControl: false,
      linksControl: false,
      panControl:false,
      zoomControl:false
  };
 
  pano = new google.maps.StreetViewPanorama(document.getElementById("street-view"), panoramaOptions);
  console.log('rendered street-view');
  } else{
    $('#street-view').html('');
  }
}

function drawMap(){
  svg = d3.select("#svgContainer").append("svg");
  console.log(geoJSON);
  svg.selectAll("path")
    .data(geoJSON.features)
   .enter().append("path")
    .attr("d", path)
    .attr("fill", 000)
    .attr("fill-opacity",1.0)
    .attr("stroke", 000);
}

function blur() {
  filter.attr("stdDeviation", this.value / 5);
}

function drawCircles(){
  var filter = svg.append("defs")
    .append("filter")
      .attr("id", "blur")
    .append("feGaussianBlur")
      .attr("stdDeviation", blurConstant);

  g = svg.append('g'); 

  g.selectAll(".finalClusters")
    .data(finalClusters)
    .enter().append("path")
      .attr('d', function (d) { 
          var lineData = [
            projection([parseFloat(d[0][1]), parseFloat(d[0][0])]),
            projection([parseFloat(d[1][1]), parseFloat(d[1][0])]),
          ]
          var dataLine =  d3.svg.line()
            .x(function (d) {return d[0]})
            .y(function (d) {return d[1]});

          return dataLine(lineData);
      })
      .attr('stroke', "red")
      .attr('stroke-opacity',clusterStrokeOpacity)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', clusterStrokeWidth)
      .attr('fill', 'none')
      .attr("filter", "url(#blur)");



  g.selectAll(".accidents-shell")
    .data(accidentData)
    .enter().append("circle")
      .attr("class", function(d){
        return d.street1 + '-' + d.street2;
      })
      .attr("r", 4.0)
      .attr('cx', function (d) {       
        x = projection([d.lng, d.lat])[0]; 
        x_min = x - (x * shellRandomShift); x_max = x + (x*shellRandomShift);
        x = Math.random() * (x_max - x_min) + x_min;
        return x;
      })
      .attr('cy', function (d) {
        y =  projection([d.lng, d.lat])[1];
        y_min = y - (y * shellRandomShift); y_max = y + (y*shellRandomShift);
        y = Math.random() * (y_max - y_min) + y_min;
        return y;
      })
      .attr("fill", "#FA8602")
      .attr("stroke", "#FA8602")
      .attr("opacity", shellOpacity)
      .on('mouseover', function(d){
        console.log("call to street-view");
        if (infoGraphToggle){
          var latlng = new google.maps.LatLng(d['lat'], d['lng']);
          toggleStreetView(latlng, true);
          d3.select(this)
        }
      })
      .attr("filter", "url(#blur)");


  g.selectAll(".accidents-core")
    .data(accidentData)
    .enter().append("circle")
      .attr("class", function(d){
        return d.street1 + '-' + d.street2;
      })
      .attr("r", 0.5)
      .attr('cx', function (d) {       
        return projection([d.lng, d.lat])[0]; 
      })
      .attr('cy', function (d) {
        return projection([d.lng, d.lat])[1];
      })
      .attr("fill", "#FA8602")
      .attr("stroke", "#FA8602")
      .attr("opacity", coreOpacity);
}