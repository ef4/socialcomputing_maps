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
var g;
var infoGraphToggle = false;
var maxWidth = 1;
var map;
var allData;
var accidentData;
var accidentDataDraw;
var showAllFlag = true;
var lightBoxShown = false;
var essayBoxShown = false;
var currentDrawPoints;
var drawIndex = 0;
var URL_PREFIX = '{{URL_PREFIX}}';


function initialize(){

  $('#drawer').click(function(){
    if (!infoGraphToggle){
      $('#infoGraphic').css('display', 'inline-block');
      $('#infoGraphic').css('width', '400px');
      $('#chart').css('width', $('#infoGraphic').width());
      $('#chart').css('height', $('#infoGraphic').height() * 0.95);

      $('#details').css('right', '380px');
      drawChart();
      $('#street-view').css('width','100%');
      $('#button-icon').removeClass('glyphicon glyphicon-chevron-left');
      $('#button-icon').addClass('glyphicon glyphicon-chevron-right');
      
    } else {
      $('#details').css('display','inline-block');
      $('#details').css('right','0px');
      $('#infoGraphic').css('display','none');
      $('#infoGraphic').css('width', '0px');
      $('#chart').empty();
      $('#street-view').html('');
      $('#street-view').css('width','0px');
      $('#button-icon').removeClass('glyphicon glyphicon-chevron-right');
      $('#button-icon').addClass('glyphicon glyphicon-chevron-left');
      $('#drawer').css('right', '0px');
    }
    infoGraphToggle = !infoGraphToggle;
  });

   activeTab = $('#tab_1');
   activeTabContent = $("#tabcontent_1");
   $("#tabcontent_2").hide();

   $("#tab_2").click(function(){
      $(this).css('background-color','rgba(43, 40, 40, 0.7)');
      $('#infoGraphic').css('height','280px');
      $("#tab_1").css('background-color', 'rgba(43, 40, 40, 0.1)');
      $("#tabcontent_1").hide()
      $("#tabcontent_2").show();
   });

   $("#tab_1").click(function(){
    $(this).css('background-color','rgba(43, 40, 40, 0.7)');
    $("#tab_2").css('background-color', 'rgba(43, 40, 40, 0.1)');
    $("#tabcontent_1").show();
    $('#infoGraphic').css('height','600px');
    $("#tabcontent_2").hide();
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

  $('#showMore').click(function(){
    essayBoxShown = true;
    console.log('click show more');
    $('#essayBox').css('display', 'inline-block');
    $('.title-container').css('opacity',0.1);
    $('#essayBox').css('z-index',12);
    $('#drawer').css('opacity',0.2);
    $('#essayBox').animate({
        'opacity':0.9}, 1500
    );
  })


  $('#essayBox-close').click(function(){
    closeEssayBox();
  });

}


function bindHoverHandlers(){
  $('svg circle').on('mouseover',function(event){
    var classname = $(this).attr('class');
    if (classname.indexOf('accident') != -1){
      var data = this.__data__;
      toggleStreetView(data['lat'],data['lng'], data['image_id'], true);
      var screenPoint = projection([this.__data__.lng, this.__data__.lat]);
      $('#streetname').css('display','inline-block');
      var text ='';
      if (this.__data__.street1 !== '(n/a)'){ text += this.__data__.street1};
      if (this.__data__.street2 !== '(n/a)'){ 
        text +=  ' , ' + this.__data__.street2;
      }

        $('#streetname').html(text);
      $('#streetname').offset({top : screenPoint[1]-8 , left:screenPoint[0] +100});
    }
  });

  $('svg circle').on('mouseout', function(){
    $('#streetname').html('');
    $('#streetname').css('display','none');
  })
}


function closeEssayBox(){
  if (essayBoxShown){
      
      $('#svgContainer').animate({'opacity':1.0},'slow');
      $('.title-container').css('opacity',1.0);
      $('#essayBox').css('display','none');
      $('#essayBox').css('opacity',0.0);
      $('#drawer').css('opacity',1.0);
      $('#essayBox').css('z-index',1);
      $('#svgContainer').css('z-index',3);
      essayBoxShown = false;
    };
}


function setProjection(){ 
  projection.scale(1)
    .translate([0, 0]);

  width = $("#svgContainer").width(); height = $("#svgContainer").height();
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


function drawController(){

  if (accidentDataDraw.length > 0){

    if (accidentDataDraw.length > 500){
      currentDrawPoints = accidentDataDraw.splice(0,500);
      //drawIndex += currentDrawPoints.length;
      //console.log("middle",drawIndex);
      setTimeout(drawCircles, 200);
    } else {
        //drawIndex += accidentData.length;
        currentDrawPoints = accidentDataDraw;
        accidentDataDraw = [];
        //console.log("end", drawIndex);
        setTimeout(drawCircles,200);
    }
  } else {
    bindHoverHandlers();
  } 
}



function drawChart(){
  var chartHeight = $("#chart").height();
  var chartWidth = $("#chart").width();

  var maxBarWidth = chartWidth-2; var barHeight = 20;
  var svg2 = d3.select("#chart").append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);


  var barLabel = function(d) { return d['name']; };
  var barValue = function(d) { return d['numAccidents']; };
  
  var yScale = d3.scale.ordinal().domain(d3.range(0, chartData.length)).rangeBands([0, chartData.length * barHeight]);
  var y = function(d, i) { return yScale(i); };
  var x = d3.scale.linear().domain([0, d3.max(chartData, barValue)]).range([0, maxBarWidth]);

  // var chart = d3.select('#chart').append("svg")
  //   .attr("width", chartWidth)
  //   .attr("height", chartHeight)
  // var gridContainer = chart.append('g')


  svg2.selectAll("rect")
      .data(chartData)
    .enter().append("rect")

      .attr("y", y)
      .attr('height', 12 )
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


function toggleStreetView(lat, lng, image_id, show){
  var LatLng = new google.maps.LatLng(lat, lng);
  if (show){
    //Load image
    $('#street-view').empty();
    $('#street-view').css('visibility', 'visible');
    var imgName = cityName + '_' + image_id.toString() + '.jpeg';
    console.log(imgName);
    var fileName = URL_PREFIX +'static/data/' + cityName + '/bicycle_accidents/streetviews/' + imgName;
    console.log(fileName);
    $('#street-view').attr('src', fileName);

  } else{
    $('#street-view').html('');
  }
}

function drawMap(){
  svg = d3.select("#svgContainer").append("svg")
        .attr('height',$('#svgContainer').height())
        .attr('width', $('#svgContainer').width());
        
  svg.selectAll("path")
    .data(geoJSON.features)
   .enter().append("path")
    .attr("d", path)
    .attr("fill", 000)
    .attr("fill-opacity",1.0)
    .attr("stroke", 000);

  g = svg.append('g'); 

  var filter = svg.append("defs")
    .append("filter")
      .attr("id", "blur")
    .append("feGaussianBlur")
      .attr("stdDeviation", blurConstant);
}

function blur() {
  filter.attr("stdDeviation", this.value / 5);
}


function drawClusters(){
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
      .attr('z-index', 0);
}

function drawCircles(){


  g.selectAll(".accidents-shell")
    .data(currentDrawPoints)
    .enter().append("circle")
      .attr("class", function(d){
        return 'accident-' + d.street1 + '-' + d.street2;
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
      .attr('data', function(d){return d;})
      .attr("fill", "#FA8602")
      .attr("stroke", "#FA8602")
      .attr("opacity", shellOpacity)
      .attr('z-index', 4)
      .attr("filter", "url(#blur)");


  g.selectAll(".accidents-core")
    .data(currentDrawPoints)
    .enter().append("circle")
      .attr("class", function(d){
        return 'accidents-' + d.street1 + '-' + d.street2;
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
      .attr('z-index', 0)
      .attr("opacity", coreOpacity);

  setTimeout(drawController,200);
}