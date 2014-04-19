var essayBoxShown= false;

function initialize(){

  colorScale = d3.scale.pow().exponent(power).domain([0,maxValue]).range(['#d9f0a3', '#238443']);
  radiusScale = d3.scale.pow().exponent(power).domain([0,maxValue]).range([minRadiusLimit, maxRadiusLimit]);
  opacityScale = d3.scale.pow().exponent(power).domain([0,maxValue]).range([minOpacityLimit, 1.0]);

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

      $('#allStreets').click(function(){
        ctx.clearRect(0,0,canvas.width(), canvas.height());
        $('#allStreets').css('display','none');
        svg.selectAll('.road')
          .attr('stroke','green')
          .attr("stroke-opacity", streetOpacity)
          .attr("stroke-width", streetWidth)
          .each(function(d,i){drawHelper(d3.select(this),d);});

        svg2.selectAll('.bar')
          .attr('fill', function(d){return d3.select(this).attr('color')})
          .attr('stroke',function(d){return d3.select(this).attr('color')});
      });
    

      $('#svgContainer').on('mouseover',function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'road2'){
          var d  = element.attr("name");
          $('#streetname').css('display','block');
          $('#streetname').html(streetMap[d][0]);
          $('#streetname').offset({top : e.pageY -22, left:e.pageX - 35});
        }
      });

      $('#svgContainer').on('mouseout',function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'road2'){
          var d  = element.attr("name");
          $('#streetname').css('display','none');
          $('#streetname').html('');
          $('#streetname').offset({top : e.pageY -22, left:e.pageX - 35});
        }
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

  width = $('canvas').width(); height = $('canvas').height();
  console.log(width, height);
  var b = path.bounds(boundary),
    s = scaleFactor / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2 + leftShiftOffset, (height - s * (b[1][1] + b[0][1])) / 2 + downShiftOffset];
  projection.scale(s).translate(t);
}




function drawPoints(){

  var line = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  svg.selectAll('line')
    .data(segmentsToDraw)
    .enter().append("path")
    .attr('class','road')
    .attr('d', function(d){
      var coords = [projection([d[1],d[0]]), projection([d[3], d[2]])];
      return line(coords);})
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", streetOpacity)
    .attr("stroke-width",streetWidth)
    .attr("stroke", "green")
    .each(function(d,i) {
      drawHelper(d3.select(this),d);
   });
  setTimeout(drawInvisibleRoads,75);
}


function drawHelper(road, d){
  var path = road.node();
      var pathLength = path.getTotalLength();
      for (var i = 0; i<pathLength;i+=pixelOffset){
        var p = path.getPointAtLength(i);
        var value = (i / pathLength) * (d[6] - d[5]) + d[5];
        drawCircle(ctx, p.x,p.y,radiusScale(value), opacityScale(value), colorScale(value));
      }
      var lastPoint = projection([d[3], d[2]]); 
      drawCircle(ctx, lastPoint[0], lastPoint[1],radiusScale(d[6]), opacityScale(d[6]), colorScale(d[6]));
}
function drawCircle(ctx, x, y, r, a, color) {
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.shadowBlur=1.2;
  ctx.shadowColor=color;
  ctx.strokeStyle = color;
  ctx.fill();
}

function drawInvisibleRoads(){

  var line = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  svg.selectAll('line')
    .data(segmentsToDraw)
    .enter().append('path')
    .attr('class','road2')
    .attr('d', function(d){
      var coords = [projection([d[1],d[0]]), projection([d[3], d[2]])];
      return line(coords);})
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", 0.0)
    .attr("stroke-width",8)
    .attr("name", function(d){return d[4];})
    .attr("stroke", "red")
    .attr("cursor", "pointer");

  setTimeout(drawController,75);
}


function drawController(){  
  console.log("drawController ", controlIndex);
  if (controlIndex +1000 < segments.length){
    segmentsToDraw = segments.slice(controlIndex, controlIndex+1000);
    controlIndex+=1000;
    setTimeout(drawPoints,75);
    //setTimeout(drawInvisibleRoads,200);
  } else if (controlIndex  < segments.length){
    segmentsToDraw = segments.slice(controlIndex, segments.length - controlIndex);
    controlIndex = segments.length;
    setTimeout(drawPoints,75);
    setTimeout(drawInvisibleRoads,200);
    if (controlIndex >= segments.length){
      drawGreenGraph();
      $('#svgContainer').on('click', function(e){
        
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'road2'){
          svg2.selectAll('.bar').attr('fill','#CFCFCF').attr("stroke",'#CFCFCF');

          ctx.clearRect(0,0,canvas.width(), canvas.height());
          var street_avg=streetMap[element.attr("name")][1];
          var streets_with_avg = histogram[Math.round(histScale(street_avg))];
          var streets_names = streets_with_avg.map(function(d){return d[0];})
          drawStreetsFromHistogram(streets_names);
          $('#allStreets').css('display','block');

          svg2.selectAll('.bar').each(function(d,i){
            names = d.map(function(d){return d[0];})
            if (names.indexOf(element.attr("name")) != -1){
              d3.select(this).attr('fill',function(d,i){return d3.select(this).attr('color')}).attr('stroke', function(d,i){return barColorScale(i);});
            } else {
              d3.select(this).attr('fill','#CFCFCF').attr("stroke",'#CFCFCF');

            }
          })
          


        }
      }); 
    }
  }
}

function drawStreetsFromHistogram(streets){
  svg.selectAll('.road').each(function(d){
      if (streets.indexOf(d[4].toString()) != -1){
        d3.select(this)
          .attr('fill', 'none')
          .attr("stroke",'green')
          .attr("fill-opacity", 0.0)
          .attr("stroke-opacity",streetOpacity)
          .attr("stroke-width",streetWidth)
          .each(function(d,i) {drawHelper(d3.select(this),d);});
      } else {
        d3.select(this)
          .attr('fill', 'gray')
          .attr("stroke",'gray')
          .attr("fill-opacity", 0.1)
          .attr("stroke-opacity",0.1)
          .attr("stroke-width",0.7);
      }
    })
}

function drawGreenGraph(){

  $('#graphContainer').css('display','block');
  var height = $('#graphContainer').height();
  var width = $('#graphContainer').width();

  svg2 = d3.select('#graphContainer').append('svg')
    .attr('height', height)
    .attr('width', width);


  var yScale = d3.scale.linear().domain([0, d3.max(histogram,function(d){return d.length;})]).range([height-4, 0]); 
  var barColorScale = d3.scale.linear().domain([0,numBuckets]).range(['#d9f0a3', '#238443']);

  var barWidth = width/numBuckets;

  var bar = svg2.selectAll('g')
    .data(histogram)
    .enter().append('g')
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });



  bar.append('rect')
    .attr('class', 'bar')
    .transition()
      .delay(function(d,i) {return i*50;})
      .attr('y', height)
      .attr('height', 0)
      .attr('width', function(d){return barWidth;})
      .attr('fill', function(d,i){return barColorScale(i);})
      .attr('fill-opacity', 0.6)
      .attr('stroke', function(d,i){return barColorScale(i);})
      .attr('stroke-opacity',0.3)
      .attr('cursor','pointer')
      .attr('color', function(d,i){return barColorScale(i);})
      .transition()
        .duration(2000)
          .attr('y', function(d){return yScale(d.length);})
        .attr('height', function(d){return height -yScale(d.length);});


  svg2.selectAll('.bar')
      .on('mouseover',function(d,i){
      $('#chartKey').css('display','block')
      $('#chartKey').html(d.length + ' street segments');
      })
      .on('mouseout',function(d){$('#chartKey').css('display','none');});

  svg2.selectAll('.bar').on('click',function(d,i){
    svg2.selectAll('.bar').attr('fill','#CFCFCF').attr("stroke",'#CFCFCF');
    d3.select(this).attr('fill',function(d,i){return d3.select(this).attr('color')}).attr('stroke', function(d,i){return barColorScale(i);});
    ctx.clearRect(0,0,canvas.width(), canvas.height());
    $('#allStreets').css('display', 'block');
    var streets = d.map(function(d){return d[0];});
    console.log(streets);
    drawStreetsFromHistogram(streets);
  });


}




  

    

   

   