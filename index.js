(function() {
  fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function(response) { return response.json(); })
  .then(function(data) {
    var leadIt = function(t) {
      return t < 10 ? '0' + t : t;
    }

    var timeFormat = function(time) {
      var mins = Math.floor(time / 60);
      var sec = Math.floor(time % 60);

      return leadIt(mins) + ':' + leadIt(sec);
    }

    var margin = {
      top: 0,
      left: 50,
      bottom: 30,
      right: 90
    }

    var width = 740 - margin.left - margin.right;
    var height = 540 - margin.top - margin.right;

    var timeMin = data.reduce(function(p,c)
          { return c.Seconds < p ? c.Seconds : p; } , Number.MAX_SAFE_INTEGER);
    var timeMax = data.reduce(function(p,c) 
          { return c.Seconds > p ? c.Seconds : p; }, 0);

    var toolTip = d3.select('.chart')
      .append('div')
      .attr('class', 'tooltip')
      .attr('style','visibility: hidden;')

    var yScale = d3.scale.linear()
      .domain([0, data.length])
      .range([0, height]);

    var xScale = d3.scale.linear()
      .domain([timeMin, timeMax])
      .range([0, width]);

    var xAxis = d3.svg.axis()
      .scale(d3.scale.linear()
      .domain([timeMin, timeMax])
      .range([0, width + 10]))
      .orient("bottom")
      .tickFormat(timeFormat)
      .ticks(10);

    var yAxis = d3.svg.axis()
      .scale(d3.scale.linear()
      .domain([0, data.length])
      .range([0, height]))
      .orient("left")
      .ticks(10);

    var bar = d3.select('.chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('style', 'background: #fff')

    var barGroup = bar.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top +')')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')

    barGroup
      .attr("transform", function(d) {
        return 'translate(' + xScale(d.Seconds) + ',' + yScale(d.Place) + ')';
      })
      .attr('class', 'bar-item')
      .append('circle')
      .attr('r', 5)
      .attr('fill', function(d) {
        if (d.Doping == '') {
          return '#9000ff';
        }
        return '#ff44ff';
      })

    barGroup.append('text')
      .attr('class', 'dot-label')
      .attr('transform', 'translate(10, 5)')
      .text(function(d) { return d.Name; })

    barGroup.on('mouseover', function(d) {
      var posX = d3.event.pageX;
      var posY = d3.event.pageY;

      toolTip
        .attr('style','left:'+ posX +'px;top:'+ posY +'px; visibility: visible;')
        .html('<strong>' + d.Name 
              + '</strong><br /><span>Place :'+d.Place+'</span><br>'
              + '<span>Year :'+d.Year+'</span><br>'
              +'<span>Time :' + d.Time + '</span>'

              );

    });

    barGroup.on('mouseout', function(d) {
      toolTip.attr('style', 'visibility: hidden;');
    });

    bar.append('g')
      .attr('transform', 'translate(0'+(margin.left - 10)+', '+ margin.top + 10 +')')
      .call(yAxis)
      .selectAll('line')
      .style({ 'stroke': '#000', 'stroke-width': '0.1'})
      .selectAll('text')
      .attr("style","font-size: 12px;")

    bar.append('g')
      .attr('transform', 'translate(0'+(margin.left - 38)+', '+ margin.top + 100 +')')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .text('Place (rating)')

    bar.append('g')
      .attr('transform', 'translate('+(margin.left - 10)+', '+(height + 10)+')')
      .call(xAxis)
      .selectAll('line')
      .style({ 'stroke': '#000', 'stroke-width': '0.1'})
      .selectAll('text')
      .style('transform','rotate(-90deg)')
      .attr("style","font-size: 12px;")

    bar.append('g')
      .attr('transform', 'translate(0'+(margin.left + 10)+', '+ (height) +')')
      .append('text')
      .text('Record time')

    var legend1 = bar.append('g')
      .attr('transform', 'translate(0'+(margin.left + 20)+', '+ (height - 50) +')')

      legend1.append('circle')
      .attr('r', 5)
      .attr('fill', '#9000ff')

      legend1.append('text')
      .attr('transform', 'translate(10,5)')
      .text('Have doping notes')

    var legend2 = bar.append('g')
      .attr('transform', 'translate(0'+(margin.left + 20)+', '+ (height - 70) +')')

      legend2.append('circle')
      .attr('r', 5)
      .attr('fill', '#ff44ff')

      legend2.append('text')
      .attr('transform', 'translate(10,5)')
      .text('No doping notes')
  });
})();
