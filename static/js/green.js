var essayBoxShown= false;
var colorScale = d3.scale.pow().exponent(1.5).domain([0,0.6]).range(['#d9f0a3', '#238443']);

function initialize(){

  var essayBoxShown = false;
    $('#showMore').click(function(e){
        e.preventDefault();
        essayBoxShown = !essayBoxShown;
        if (essayBoxShown) {
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

  setupSlider();
}

function closeEssayBox(){
  $('#essayBox').animate({'opacity':0.0}, 300, function () {
    $('#essayBox').css('display', 'none');
  })
  essayBoxShown = false;
}

function setupSlider(){
  var colorScaleSlider = d3.scale.linear().domain([0,100]).range([9.99723963294e-05, 0.591211975017]);
  $( "#slider" ).slider({
    change:function(event,ui){
      if (ui.value < 5){
        drawPoints();
      } else {
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
        var show_streets = streets.filter(function(d){
          return Math.abs(d[1] - colorScaleSlider(ui.value)) < 0.02 ;
        });
        console.log(show_streets);
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
    .attr("stroke-opacity", 0.3)
    .attr("stroke", "gray");
}




function drawMap(){
  svg.selectAll("path")
    .data(geoJSON.features)
   .enter().append("path")
    .attr("d", path)
    .attr('class', 'road')
    .attr("fill", "none")
    .attr("fill-opacity", 0.0)
    .attr("stroke-opacity", 0.2)
    .attr("stroke-width",3)
    .attr("stroke", "gray");
}



function drawPoints(){
  points.map(function(d){
    var screenPoint = projection([d[1], d[0]]);
    var radius =  d[3];
    var opacity = d[4];
    var color = colorScale(d[4]);
    drawCircle(ctx, screenPoint[0], screenPoint[1],radius,opacity,color);
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

  




  

    

   

   