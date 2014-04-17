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
          $('#streetname').html(streetMap[d][0]);
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



  
}

function closeEssayBox(){
  $('#essayBox').animate({'opacity':0.0}, 300, function () {
    $('#essayBox').css('display', 'none');
  })
  essayBoxShown = false;
  $('#mainframe').css('opacity',1.0);

}

// function setupSlider(){
//   var colorScaleSlider = d3.scale.pow().exponent(power).domain([0,100]).range([minStreetAvg, maxStreetAvg]);
//   $( "#slider" ).slider({
//     change:function(event,ui){
//       $('#allStreets').css('display', 'block');
//       d3.selectAll('.road')
//           .attr('stroke','gray')
//           .attr("stroke-opacity", 0.1);

//         $('canvas').css('opacity',0.0);
//         d3.selectAll('.road').filter(function(d){
//           return Math.abs(streetMap[d[4]][1] - colorScaleSlider(ui.value)) < 0.02;
//         }).each(function(d){
//           d3.select(this)
//               .attr('stroke', function(d) {return colorScale(streetMap[d[4]][1]);})
//               .attr('stroke-opacity',0.8)
//               .attr('stroke-width',roadWidth);
//         });
//       //}
//    }
//    });
//   $('.ui-slider-handle').height(25);
//   $('.ui-slider-handle').width(20);
//   $('.ui-slider-handle').css('left','10px');
//   $('.ui-slider-handle').css('background','none');
//   $('.ui-slider-handle').css('border','1px solid black');
//   $('.ui-slider-handle').css('border-radius','0px');
//   $('.ui-slider-handle').css('outline','none');
// }

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
      var path = d3.select(this).node();
      var pathLength = path.getTotalLength();
      for (var i = 0; i<pathLength;i+=pixelOffset){
        var p = path.getPointAtLength(i);
        var value = (i / pathLength) * (d[6] - d[5]) + d[5];
        drawCircle(ctx, p.x,p.y,radiusScale(value), opacityScale(value), colorScale(value));
      }
      var lastPoint = projection([d[3], d[2]]); 
      drawCircle(ctx, lastPoint[0], lastPoint[1],radiusScale(d[6]), opacityScale(d[6]), colorScale(d[6]));
  });
  setTimeout(drawInvisibleRoads,75);
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


 // svg = d3.select("#svgContainer").append("svg")
 //      .attr('height',$('#svgContainer').height())
 //      .attr('width', $('#svgContainer').width());

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
    .attr("stroke", "red");

  setTimeout(drawController,75);
}


function drawController(){  
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
    }
  }
}


// function drawGreenGraph(){

//   var height = $('#graphContainer').height();
//   var width = $('#graphContainer').width();

//   var histogram = Array.apply(null, new Array(50)).map(Number.prototype.valueOf,0);

//   var histScale = d3.scale.pow().exponent(power).domain([minStreetAvg, maxStreetAvg]).range([0,histogram.length]);

  

//   for (key in streetMap){
//     var i = Math.floor(histScale(streetMap[key][1]));
//     histogram[i]++;
//   };


//   svg2 = d3.select('#graphContainer').append('svg')
//     .attr('height', height)
//     .attr('width', width);


//   console.log(histogram, height,width);

//   var xScale = d3.scale.linear().domain([0, histogram.length-1]).range([2,width]);
//   var yScale = d3.scale.linear().domain([0, d3.max(histogram)]).range([height-3, 4]);

//   var startLine = d3.svg.line()
//     .x(function(d,i){
//       return xScale(i);})
//     .y(function(d,i){return 0;})
//     .interpolate('basis');


//   var finalLine = d3.svg.line()
//     .x(function(d,i){
//       return xScale(i);})
//     .y(function(d,i){return yScale(d);})
//     .interpolate('basis');


//   var startArea = d3.svg.area()
//     .x(function(d,i) { return xScale(i); })
//     .y0(height)
//     .y1(function(d) { return 0; })
//     .interpolate('basis');

//   var finalArea = d3.svg.area()
//     .x(function(d,i) { return xScale(i); })
//     .y0(height)
//     .y1(function(d) { return yScale(d); })
//     .interpolate('basis');



//   svg2.append("path")
//     .attr("d", startLine(histogram))
//     .attr("fill", "none")
//     .attr("fill-opacity", 0.0)
//     .attr("stroke", 'green')
//     .attr("stroke-width",2.5)
//     .attr("stroke-opacity", 0.1)
//     .transition()
//       .ease("bounce")
//       .duration(2000)
//       .attr("d", finalLine(histogram));


//   svg2.append("path")
//         .datum(histogram)
//         .attr("class", "area")
//         .attr("d", startArea)
//         .attr("fill-opacity", 0.1)
//         .attr("fill","green")
//         .attr("stroke","green")
//         .attr("stroke-width",2.5)
//         .attr("stroke-opacity", 0.1)
//         .transition()
//           .ease("bounce")
//           .duration(2000)
//           .attr("d", finalArea);


//   var path = svg2.append('path').datum(histogram).attr('d',finalLine).attr("fill-opacity", 0.0)
//         .attr("fill","green")
//         .attr("stroke","green")
//         .attr("stroke-width",2.5)
//         .attr("stroke-opacity", 0.0);

//   svg2.selectAll('.datapoint')
//     .data(histogram)
//     .enter().append('circle')
//     .attr('class','datapoint')

//     .attr('cx', function(d,i){ 
//       var p = path.node().getPointAtLength((i/histogram.length) * path.node().getTotalLength());
//       return p.x;
//     })
//     .attr('r',2)
//     .attr('fill', 'green')
//     .attr('fill-opacity',0.1)
//     .attr("stroke", 'green')
//     .attr('stroke-opacity', 0.5)
//     .attr('cy', 0)
//     .attr('value', function(d){return d;})
//     .transition()
//       .ease("bounce")
//       .duration(2000)
//       .attr('cy',function(d,i){
//         var p = path.node().getPointAtLength((i/histogram.length) * path.node().getTotalLength());
//         return p.y;
//       });

// }


function drawGreenGraph(){

  $('#graphContainer').css('display','block');
  var height = $('#graphContainer').height();
  var width = $('#graphContainer').width();

  svg2 = d3.select('#graphContainer').append('svg')
    .attr('height', height)
    .attr('width', width);

  var numBuckets = 50;


  var histogram = Array.apply(new Array, new Array(numBuckets)).map(function(){return [];});


  var histScale = d3.scale.pow().exponent(power).domain([minStreetAvg, maxStreetAvg]).range([0,numBuckets]);


  for (key in streetMap){
    var i = Math.floor(histScale(streetMap[key][1]));
    histogram[i].push([key,streetMap[key]]);
  };

  var yScale = d3.scale.linear().domain([0, d3.max(histogram,function(d){return d.length;})]).range([height-4, 0]); 
  var barColorScale = d3.scale.linear().domain([0,numBuckets]).range(['#d9f0a3', '#238443']);

  var barWidth = width/numBuckets;

  var bar = svg2.selectAll('g')
    .data(histogram)
    .enter().append('g')
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });



  bar.append('rect')
    .attr('y', height)
    .attr('height', 0)
    .attr('class', 'bar')
    .attr('width', function(d){return barWidth;})
    .attr('fill', function(d,i){return barColorScale(i);})
    .attr('fill-opacity', 0.8)
    .attr('stroke', function(d,i){return barColorScale(i);})
    .attr('stroke-opacity',0.8)
    .attr('cursor','pointer')
    .transition()
      .duration(2000)
      .ease("bounce")
        .attr('y', function(d){return yScale(d.length);})
      .attr('height', function(d){return height -yScale(d.length);})
    


  svg2.selectAll('.bar')
      .on('mouseover',function(d,i){
      $('#chartKey').css('display','block')
      $('#chartKey').html(d.length + ' streets');
      })
      .on('mouseout',function(d){$('#chartKey').css('display','none');});

  svg2.selectAll('.bar').on('click',function(d){
    $('canvas').css('opacity',0.0);
    $('#allStreets').css('display', 'block');
    var streets = d.map(function(d){return d[0];});
    svg.selectAll('.road').each(function(d){
      if (streets.indexOf(d[4].toString()) != -1){
        d3.select(this)
          .attr('fill', function(d){return colorScale(streetMap[d[4]][1]);})
          .attr("stroke",function(d){return colorScale(streetMap[d[4]][1]);})
          .attr("fill-opacity", 0.8)
          .attr("stroke-opacity",0.8)
          .attr("stroke-width",2.5);
      } else {
        d3.select(this)
          .attr('fill', 'gray')
          .attr("stroke",'gray')
          .attr("fill-opacity", 0.1)
          .attr("stroke-opacity",0.1)
          .attr("stroke-width",0.7);
      }
    })
  });

}




  

    

   

   