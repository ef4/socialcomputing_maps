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
        $('.ui-slider-handle').css('left','0px');
        $('canvas').css('opacity',1.0);
        $('#allStreets').css('display','none');
        d3.selectAll('.road')
          .attr('stroke','green')
          .attr("stroke-opacity", 0.1);
      })

      $('#svgContainer').on('mouseover',function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'road2'){
          var d  = element.attr("name");
          $('#streetname').css('display','block');
          $('#streetname').html(d);
          $('#streetname').offset({top : e.pageY -22, left:e.pageX - 35});
        }
      });

      $('#svgContainer').on('mouseout', function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'road2'){
          $('#streetname').css('display','none');
          $('#streetname').html('');
        }
      });    

      $('#graphContainer').on('mouseover', function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'datapoint'){
          $('#chartKey').css('display','block');
          $('#chartKey').html(element.attr('value') + ' streets');
          $('#chartKey').offset({top : e.pageY - 35, left:e.pageX-35});
        }
      });

      $('#graphContainer').on('mouseout', function(e){
        var element = d3.select($(event.target).clone()[0]);
        var classname = element.attr('class');
        if (classname == 'datapoint'){
          $('#chartKey').css('display','none');
          $('#chartKey').html('');
        }
      });
  setupSlider();
}

function closeEssayBox(){
  $('#essayBox').animate({'opacity':0.0}, 300, function () {
    $('#essayBox').css('display', 'none');
  })
  essayBoxShown = false;
  $('#mainframe').css('opacity',1.0);

}

function setupSlider(){
  var colorScaleSlider = d3.scale.linear().domain([0,100]).range([minStreetAvg, maxStreetAvg]);
  $( "#slider" ).slider({
    change:function(event,ui){
      $('#allStreets').css('display', 'block');
      d3.selectAll('.road')
          .attr('stroke','gray')
          .attr("stroke-opacity", 0.1);

        $('canvas').css('opacity',0.0);
        d3.selectAll('.road').filter(function(d){
          return Math.abs(d[7] - colorScaleSlider(ui.value)) < 0.02;
        }).each(function(d){
          d3.select(this)
              .attr('stroke', function(d) {return colorScale(d[7]);})
              .attr('stroke-opacity',0.8)
              .attr('stroke-width',2.5);
        });
      //}
   }
   });
  $('.ui-slider-handle').height(25);
  $('.ui-slider-handle').width(20);
  $('.ui-slider-handle').css('left','10px');
  $('.ui-slider-handle').css('background','none');
  $('.ui-slider-handle').css('border','1px solid black');
  $('.ui-slider-handle').css('border-radius','0px');
  $('.ui-slider-handle').css('outline','none');
}

function setProjection(){ 
  projection.scale(1)
    .translate([0, 0]);

  width = $('canvas').width(); height = $('canvas').height();
  console.log(width, height);
  var b = path.bounds(boundary),
    s = scaleFactor / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  projection.scale(s).translate(t);

}



function drawBoundary(){

  svg.selectAll("path")
    .data(boundary.features)
   .enter().append("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", 0.8)
    .attr("stroke", "gray");
}




function drawMap(){
  svg.selectAll(".street")
    .data(geoJSON.features)
   .enter().append("path")
    .attr('class', 'street')
    .attr("d", path)
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", 0.2)
    .attr("stroke-width",2.5)
    .attr("stroke", "red");
}



function drawPoints(){

  $('#dataContainer').css('display','block');

  var line = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  svg.selectAll('.road')
    .data(segments)
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
    .each(function(d) {
      var path = d3.select(this).node();
      var pathLength = path.getTotalLength();
      for (var i = 0; i<pathLength;i+=pixelOffset){
        var p = path.getPointAtLength(i);
        //drawCircle(ctx, p.x, p.y, 1, 0.5,'red');
        var value = (i / pathLength) * (d[6] - d[5]) + d[5];
        drawCircle(ctx, p.x,p.y,radiusScale(value), opacityScale(value), colorScale(value));
      }
      var lastPoint = projection([d[3], d[2]]); 
      drawCircle(ctx, lastPoint[0], lastPoint[1],radiusScale(d[6]), opacityScale(d[6]), colorScale(d[6]));
      //drawCircle(ctx, lastPoint[0], lastPoint[1], 1, 0.5, 'red');
  });

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


 svg = d3.select("#svgContainer").append("svg")
      .attr('height',$('#svgContainer').height())
      .attr('width', $('#svgContainer').width());

  var line = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  svg.selectAll('.road2')
    .data(segments)
    .enter().append("path")
    .attr('class','road2')
    .attr('d', function(d){
      var coords = [projection([d[1],d[0]]), projection([d[3], d[2]])];
      return line(coords);})
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", 0.0)
    .attr("stroke-width",8)
    .attr("name", function(d){return d[4];})
    .attr("stroke", "red");
}


function drawGreenGraph(){

  var height = $('#graphContainer').height();
  var width = $('#graphContainer').width();

  var histogram = Array.apply(null, new Array(10)).map(Number.prototype.valueOf,0);

  var histScale = d3.scale.linear().domain([minStreetAvg, maxStreetAvg]).range([0,histogram.length]);

  

  streets.map(function(d){
    var i = Math.floor(histScale(d[1]));
    histogram[i]++;
  });


  svg2 = d3.select('#graphContainer').append('svg')
    .attr('height', height)
    .attr('width', width);


  console.log(histogram, height,width);

  var xScale = d3.scale.linear().domain([0, histogram.length-1]).range([2,width]);
  var yScale = d3.scale.linear().domain([0, d3.max(histogram)]).range([15,height-3]);

  var startLine = d3.svg.line()
    .x(function(d,i){
      return xScale(i);})
    .y(function(d,i){return 0;})
    .interpolate('basis');


  var finalLine = d3.svg.line()
    .x(function(d,i){
      return xScale(i);})
    .y(function(d,i){return height - yScale(d);})
    .interpolate('basis');


  var startArea = d3.svg.area()
    .x(function(d,i) { return xScale(i); })
    .y0(height)
    .y1(function(d) { return 0; })
    .interpolate('basis');

  var finalArea = d3.svg.area()
    .x(function(d,i) { return xScale(i); })
    .y0(height)
    .y1(function(d) { return height - yScale(d); })
    .interpolate('basis');



  svg2.append("path")
    .attr("d", startLine(histogram))
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke", 'green')
    .attr("stroke-width",2.5)
    .attr("stroke-opacity", 0.1)
    .transition()
      .duration(2000)
      .attr("d", finalLine(histogram));


  svg2.append("path")
        .datum(histogram)
        .attr("class", "area")
        .attr("d", startArea)
        .attr("fill-opacity", 0.1)
        .attr("fill","green")
        .attr("stroke","green")
        .attr("stroke-width",2.5)
        .attr("stroke-opacity", 0.1)
        .transition()
          .duration(2000)
          .attr("d", finalArea);


  var path = svg2.append('path').datum(histogram).attr('d',finalLine).attr("fill-opacity", 0.0)
        .attr("fill","green")
        .attr("stroke","green")
        .attr("stroke-width",2.5)
        .attr("stroke-opacity", 0.0);

  svg2.selectAll('.datapoint')
    .data(histogram)
    .enter().append('circle')
    .attr('class','datapoint')

    .attr('cx', function(d,i){ 
      var p = path.node().getPointAtLength((i/histogram.length) * path.node().getTotalLength());
      return p.x;
    })
    .attr('r',2)
    .attr('fill', 'green')
    .attr('fill-opacity',0.1)
    .attr("stroke", 'green')
    .attr('stroke-opacity', 0.5)
    .attr('cy', 0)
    .attr('value', function(d){return d;})
    .transition()
      .duration(2000)
      .attr('cy',function(d,i){
        var p = path.node().getPointAtLength((i/histogram.length) * path.node().getTotalLength());
        return p.y;
      });

}


  




  

    

   

   