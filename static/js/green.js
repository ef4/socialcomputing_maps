var essayBoxShown= false;
var colorScale = d3.scale.pow().exponent(0.75).domain([0,0.3381]).range(['#d9f0a3', '#238443']);
var radiusScale = d3.scale.pow().exponent(0.75).domain([0,0.3381]).range([1, 3.5]);
var opacityScale = d3.scale.pow().exponent(0.75).domain([0,0.3381]).range([0.2, 1.0]);
function initialize(){

  var essayBoxShown = false;
    $('#showMore').click(function(e){
        e.preventDefault();
        essayBoxShown = !essayBoxShown;
        if (essayBoxShown) {
            $('#svgContainer').css('opacity',0.25);
            $('canvas').css('opacity',0.25);
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

    $('path').on('mouseover',function(){
      console.log("hover");
    })

  setupSlider();
}

function closeEssayBox(){
  $('#essayBox').animate({'opacity':0.0}, 300, function () {
    $('#essayBox').css('display', 'none');
  })
  essayBoxShown = false;
  $('#svgContainer').css('opacity',1.0);
  $('canvas').css('opacity',1.0);
}

function setupSlider(){
  var colorScaleSlider = d3.scale.linear().domain([0,100]).range([9.99723963294e-05, 0.591211975017]);
  $( "#slider" ).slider({
    change:function(event,ui){
      d3.selectAll('.road')
          .attr('stroke','gray')
          .attr("stroke-opacity", 0.2);

      if (ui.value < 5){
        
        drawPoints();
      
      } else {
        ctx.clearRect(0, 0, canvas.width(), canvas.height());

        var show_streets = streets.filter(function(d){
          return Math.abs(d[1] - colorScaleSlider(ui.value)) < 0.1 ;
        });
        var names = show_streets.map(function(d){return d[0];});

        d3.selectAll('.road').filter(function(d){
          if (names.indexOf(d.properties.street) != -1){
            d3.select(this)
              .attr('stroke', colorScale(d.properties.value))
              .attr('stroke-opacity',1.0);

          }
        });
      }
      




      // points.filter(function(d){
      //   return d[5] > color;
      // }).forEach(function(d){
      //   var screenPoint = projection([d[1], d[0]]);
      //   var radius =  d[3];
      //   var opacity = d[4];
      //   var color = colorScale(d[4]);
      //   drawCircle(ctx, screenPoint[0], screenPoint[1],radius,opacity,color);
      // })
    }
  });
  $('.ui-slider-handle').height(20);
  $('.ui-slider-handle').width(10);
  $('.ui-slider-handle').attr('background','blue');
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

 svg = d3.select("#svgContainer").append("svg")
      .attr('height',$('#svgContainer').height())
      .attr('width', $('#svgContainer').width());
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
    .attr("stroke-opacity", 0.1)
    .attr("stroke-width",2.5)
    .attr("stroke", "green")
    .each(function(d) {
      var path = d3.select(this).node();
      var pathLength = path.getTotalLength();
      for (var i = 0; i<pathLength;i+=3){
        var p = path.getPointAtLength(i);
        var value = (i / pathLength) * (d[6] - d[5]) + d[5];
        drawCircle(ctx, p.x,p.y,radiusScale(value), opacityScale(value), colorScale(value));
      }
      var lastPoint = projection([d[3], d[2]]); 
      drawCircle(ctx, lastPoint[0], lastPoint[1],radiusScale(d[6]), opacityScale(d[6]), colorScale(d[6]));
  });

}

function drawCircle(ctx, x, y, r, a, color) {
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.shadowBlur=1.5;
  ctx.shadowColor=color;
  ctx.strokeStyle = color;
  ctx.fill();
}

  




  

    

   

   