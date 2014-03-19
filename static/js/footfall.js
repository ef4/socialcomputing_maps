var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection); 
var geoJSON;
var segmentColor = '#F52307'
var svg;
var stations;
var convexHulls;
var g;
var currentStation;
var segmentsToDraw;
var streets = {};
var stationIndex  = 0;
var maxOverlap=1;
var lightBoxShown = false;

function initialize(){

  $('#data-source').click(function(){
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

  $('body').click(function(event){
    console.log(event.pageX);

  })
}


function sortByStation(){
  for (var i in segments){
  var station = segments[i].station;
    byStation[station].push({'start_lat': segments[i].start_lat, 'start_lng':segments[i].start_lng, 'end_lat': segments[i].end_lat, 'end_lng':segments[i].end_lng,'name':segments[i].name, 'station':segments[i].station, 'opacity':segments[i].opacity});
  }

  for (var i = 0; i<stationNames.length; i++){
    segmentsFinal.push(byStation[stationNames[i]]);
  }

  setTimeout(drawSegments,600);
}


function addStationTags(){
  for (var i in stations){
    var  station = stations[i];
    var p_tag = "<p id="+station.tagname+" class='tag'></p>";
    $('body').append(p_tag);
  }
}

function createConvexHull(station_id){
  console.log(station_id);
  var hull_points = station_points[station_id].map(function(d){return projection([parseFloat(d[0]), parseFloat(d[1])]);});
  svg.append("path")
    .datum(d3.geom.hull(hull_points))
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .attr("class","hull")
    .attr("stroke","black").attr("stroke-opacity",0.3).attr("stroke-width",1.5)
    .attr("fill","none").attr("fill-opacity",0.0);
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
  .attr("fill-opacity", 0.075);
}


function drawSegments(){


  var opValue = function(d) { return d.opacity; };

  var opScale = d3.scale.sqrt().domain([0, d3.max(segments, opValue)]).range([0.0, 1]); 
  var widthScale = d3.scale.linear().domain([0, d3.max(segments, opValue)]).range([1.0, 3.0]); 

  var stationGroup = svg.selectAll('g')
        .data(segmentsFinal)
        .enter().append('g')
        .attr('class', 'stationGroup');




  var paths = stationGroup.selectAll('path')
        .data(function(d,i){
          return d;
        })
        .enter().append('path')
        .attr('stroke-opacity', function(d){
          return opScale(opValue(d));})
        .attr('stroke-width', function(d){return widthScale(opValue(d));})
        .attr('fill', 'none')
        .attr('stroke', segmentColor)  
        .attr('class', function(d){
            return d.station.split(" ").join("_") + '-' + d.name.split(" ").join("_");
        })
        .on('mouseover', function(d){
          console.log("here", d.name);
          $("#streetname").html(d.name);
        })
        .on('mouseout', function(d){
          $('#streetname').html("");
        })
        .transition().delay(function(d,i){
          return  i*drawSpeed;})                    

        .attr('d', function (d) {
            var lineData = [
                projection([parseFloat(d.start_lng), parseFloat(d.start_lat)]),
                projection([parseFloat(d.end_lng), parseFloat(d.end_lat)]),
            ]
            var dataLine =  d3.svg.line()
                .interpolate("basis")
                .x(function (d) {return d[0]})
                .y(function (d) {return d[1]});
            return dataLine(lineData);
        })

}


var fadeOutMoveText = function(){
  var tags = d3.selectAll('.tag')[0];
  for (i in tags){
    var tag = tags[i];
    var id = tag.id;
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var moveX = (parseFloat(tag.style.left) <= windowWidth/2 ? '0%' : '100%');
    var moveY = (parseFloat(tag.style.top) <= windowHeight/2 ? '0%' : '100%');
    $('#'+id).animate({
    'opacity': 0.4
      }, 12000, function() {
      // Animation complete.
    });
  }
}


function bindTagHandlers(){
  $('.tag').on('mouseover', function(){
    var station_id = $(this).attr('id');
    createConvexHull(station_id);
    d3.selectAll('.tag').each(function(d){
      if(this.id != station_id){
        $(this).css('opacity',0.4);
      } else {
        $(this).css('opacity',1.0);
      }
    });
  });

  $('.tag').on('mouseout', function(){
    svg.selectAll('.hull').each(function(){
      d3.select(this).remove();
    })
    d3.selectAll('.tag').each(function(d){
      $(this).css('opacity',1.0);
    });
  });

}





function drawStations(){

  //stations.sort(function(a, b) {return d3.descending(parseFloat(a.lng), parseFloat(b.lng));});


  var circle = d3.selectAll('circle')
      .data(stations)
      .enter().append('circle')
      .attr('class', function(d){
        currentStation = d.name;
        stationName = d.name;
        return 'segment-'+d.name;})
      .attr('cx', function(d,i){
         var x =  projection([d.lng, d.lat])[0];
         var name = '#' + d.tagname;
         var finalXOffset;
         if (structuredOffset){
          var diffX = (i%2 == 0 ? tagRightMargin : tagRightMargin - leftToRightGap);
          tagRightMargin = tagRightMargin - leftMarginOffset;
          finalXOffset = diffX;
         } else {
          finalXOffset = x+labelXoffset;
         }
         $(name).offset({'left': finalXOffset});
         return x;
      })
      .attr('cy', function(d,i){
          var y = projection([d.lng, d.lat])[1];
          var name = '#' + d.tagname;
          var finalYOffset;
          if (structuredOffset){
            var diffY = (i%2 == 1 ? tagVerticalGap : 0)
            tagTopMargin = tagTopMargin + diffY;
            finalYOffset = tagTopMargin;
          } else {
            finalYOffset = y+labelYoffset;
          }
          $(name).offset({'top': finalYOffset});
          $(name).html(d.name);
          return y;
      })
      .attr('fill', 'black')
      .attr('r', 0)
      .attr('fill-opacity', 0.2)
      .attr('stroke-opacity', 0.0)
      


  circle
      .transition()
      .duration(2000).delay(function(d, i) {return i * 1000;})
        .attr("r", 3)
        .ease("bounce");


      $('svg circle').tipsy({ 
        gravity: 'w', 
        fade:true,
        html: true, 
        title: function() {
          var d = this.__data__.name;
          return '<p style="font-size:8pt;">' + d + '</p>'; 
        }
      });

  bindTagHandlers();
  }