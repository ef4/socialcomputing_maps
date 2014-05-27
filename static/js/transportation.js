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

  var essayBoxShown = false;
    $('#showMore').click(function(e){
        e.preventDefault();
        essayBoxShown = !essayBoxShown;
        if (essayBoxShown) {
            $('#mainframe').css('opacity',0.25);
            $('#essayBox').css('display', 'block');
            $('#essayBox').animate({'opacity':1.0}, 300);
            $(this).text(' ... view map ');
        } else {
            closeEssayBox();
            $(this).text(' ... more ');
        }

      })


      $('#essayBox-close').click(function(){
        closeEssayBox();
        $('#showMore').text(' ... more ');
      });

      $('#essayBox').click(function () {
          closeEssayBox(); 
          $('#showMore').text(' ... more ');
      });

      $('#viewMap').click(function () {
          closeEssayBox(); 
          $('#showMore').text(' ... more ');
      });

}

function closeEssayBox(){
  $('#essayBox').animate({'opacity':0.0}, 300, function () {
    $('#essayBox').css('display', 'none');
  })
  essayBoxShown = false;
  $('#mainframe').css('opacity',1.0);

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
  .attr("fill-opacity", 0.05);
}