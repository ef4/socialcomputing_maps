var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection); 
var geoJSON;
var segmentColor = '#F52307'
var svg;
var stations
var g;
var currentStation;
var segmentsToDraw;
var streets = {};
var stationIndex  = 0;
var maxOverlap=1;
var lightBoxShown = false;



function initialize(){

  $('#data-source').click(function(){
    console.log("click lbox");
    lightBoxShown = true;
    $('#svgContainer').css('opacity',0.1);
    $('.tag').css('opacity',0.1);

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var selfWidth = $(this).width(); var selfHeight = $(this).height();
    var moveX = 0.4*(windowWidth - selfWidth);
    var moveY = 0.35*(windowHeight - selfHeight);

    $('#data-lightbox').animate({
        'opacity':1.0}, 1500
    );

    $('#data-lightbox').attr('z-index', 6);
    $('.tag').attr('z-index', 1);
   });

  $('#svgContainer').click(function(){
      closeLightBox();
  });

  $('#lightbox-close').click(function(){
    closeLightBox();
  });
}


function closeLightBox(){
  if (lightBoxShown){
      $('#data-lightbox').animate({
        'opacity':0.0}, 'fast'
      );

      $('#svgContainer').animate({'opacity':1.0},'slow');
      $('.tag').css('opacity',0.4);
      lightBoxShown = false;
  };
  $('#data-lightbox').attr('z-index', 1);
  $('.tag').animate({'z-index': 6}, 'slow');
}



function setProjection(){ 
  projection.scale(1)
  .translate([0, 0]);
  width = $("#svgContainer").width(); height = $("#svgContainer").height();
  console.log(width,height);
  var b = path.bounds(geoJSON),
  s = scaleFactor / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
  t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  projection.scale(s).translate(t);
  projection(mapCenter);
}

function drawMap(){

  svg = d3.select("#svgContainer").append("svg")
        .attr('height',$('#svgContainer').height())
        .attr('width', $('#svgContainer').width());


  svg.selectAll(".map")
  .data(geoJSON.features)
  .enter().append("path")
  .attr("d", path)
  .attr("stroke-opacity", 0.0)
  .attr("stroke", "black")
  .attr("fill", "#CCCCCC")
  .attr("fill-opacity", 0.3);
}