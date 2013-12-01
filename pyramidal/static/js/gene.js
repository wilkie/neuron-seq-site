window.gene_expression = {
  bars: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    attr.width  = attr.width  || 800;
    attr.height = attr.height || 400;
    attr.margin = attr.margin || 100;

    chart_attr = {
      width:  attr.width,
      height: attr.height
    };

    var barWidth = 25;

    var chart = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr(chart_attr)
      .append("svg:g").attr('transform', 'translate(50, 50)');

    var x0 = d3.scale.ordinal()
               .domain(headers[0])
               .rangeBands([0, attr.width - attr.margin]);

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, attr.width - attr.margin]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, attr.height - attr.margin] );

    // Bars
    var bars = chart.append('g')
                    .attr('class', 'bars');

    bars.selectAll( 'rect' )
      .data( data )
      .enter().append( 'rect' )
      .attr( 'x', function( d, i ) { return x0( d.timepoint ) + 44 + (i%3) * (barWidth+5); } )
      .attr( 'y', function( d ) { return (attr.height - attr.margin) - y( d.fpkm ) + .5 } )
      .attr( 'width', barWidth )
      .attr( 'height', function( d ) { return y( d.fpkm ) } )
      .style({
        stroke: "white",
        fill:   function(d, i){return colors[i%3];}});

    // lines
    errorbars = chart.append('g')
      .attr('class','errorbars');
    topmarks = chart.append('g')
      .attr('class','errorbars');
    bottommarks = chart.append('g')
      .attr('class','errorbars');

    errorbars.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + (barWidth/2);})
      .attr( 'x2', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + (barWidth/2);})
      .attr( 'y1', function( d ) { return (attr.height - attr.margin) - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return (attr.height - attr.margin) - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    topmarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + (barWidth/4);})
      .attr( 'x2', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + 3*(barWidth/4);})
      .attr( 'y1', function( d ) { return (attr.height - attr.margin) - y( d.conf_hi ) + .5 } )
      .attr( 'y2', function( d ) { return (attr.height - attr.margin) - y( d.conf_hi ) + .5 } )
      .style({
        "stroke": "black"});

    bottommarks.selectAll('line')
      .data( data )
      .enter().append('line')
      .attr("class","errorbar")
      .attr( 'x1', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + (barWidth/4);})
      .attr( 'x2', function(d,i) { return x0(d.timepoint) + 44 + (i%3) * (barWidth+5) + 3*(barWidth/4);})
      .attr( 'y1', function( d ) { return (attr.height - attr.margin) - y( d.conf_lo ) + .5 } )
      .attr( 'y2', function( d ) { return (attr.height - attr.margin) - y( d.conf_lo ) + .5 } )
      .style({
        "stroke": "black"});


    // Axis
    var xAxis = d3.svg.axis()
      .scale(x0)
      .ticks(headers[0].length)
      .tickSize(6, 3, 1)
      .tickValues(headers[0]);

    var yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [attr.height - attr.margin, 0] ))
      .tickSize(6, 3, 1)
      .orient('left');

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (attr.height - attr.margin) + ')')
      .call(xAxis)

    chart.selectAll('.axis line')
      .style({
        "stroke": "black"});

    chart.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + x0.range()[0] + ')')
      .call(yAxis)
      .append("text")
      .style()
      .style({
        "text-anchor": "end"})
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("FPKM");

    chart.selectAll('.tick line')
      .style({
        "stroke": "black"});

    var legend = chart.selectAll(".legend")
                      .data(headers[1])
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr("y", 400)
                      .attr("transform", function(d, i) { return "translate(" + (((attr.width / 3) * i) + 60) + "," + (attr.height - 60) + ")"; });

    legend.append("rect")
      .attr("transform", "translate(10,-9)")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){return colors[i]});

    legend.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  },

  lines: function(selector, headers, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    attr.width  = attr.width  || 800;
    attr.height = attr.height || 400;
    attr.margin = attr.margin || 100;

    var chart = d3.select(selector)
      .append("svg:svg")
      .attr("class", "chart")
      .data([data])
      .attr(chart_attr)
      .append("svg:g").attr('transform', 'translate(50, 50)');

    var lines,
        margin = attr.margin,
        x, y,
        xAxis, yAxis;

    var x0 = d3.scale.ordinal()
               .domain(headers[0])
               .rangeBands([0, attr.width - margin]);

    var x1 = d3.scale.ordinal()
               .domain(headers[1])
               .rangeBands([0, attr.width - margin]);

    var y = d3.scale.linear()
              .domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] )
              .rangeRound( [0, attr.height - margin] );

    // Data
    var line = d3.svg.line()
      .x(function(d) { return x0(d.timepoint) + 84 })
      .y(function(d) { return (attr.height - margin) - y(d.fpkm) + .5 });

    var data_lines = headers[1].map(function(elem) {
      return data.filter(function(datapoint) {
        return datapoint.celltype == elem;
      });
    });

    // Confidence areas
    errorPolys = chart.append('g')
      .attr('class','errorpolys');

    errorPolys.selectAll('polygon')
      .data( data_lines )
      .enter().append('polygon')
      .attr("points", function(d) {
        return [
          d.map(function(elem) {
            return [x0(elem.timepoint) + 84, (attr.height - margin) - y(elem.conf_lo) + 0.5].join(",")
          }).join(" "),
          d.map(function(elem) {
            return [x0(elem.timepoint) + 84, (attr.height - margin) - y(elem.conf_hi) + 0.5].join(",")
          }).reverse().join(" ")
        ].join(" ")
      })
      .style({
        "fill": function(d,i){ return colors[i%3] },
        "opacity": "0.1",
        "stroke": "none"});

    // Lines
    lines = chart.append('g')
      .attr('class', 'lines');

    lines.selectAll('path')
      .data(data_lines)
      .enter().append('path')
      .style({
        fill: "none",
        "stroke-width": 5,
        stroke: function(d, i){return colors[i%3];}})
      .attr('d', line);

    // Axis
    xAxis = d3.svg.axis()
      .scale(x0)
      .ticks(headers[0].length)
      .tickSize(6, 3, 1)
      .tickValues(headers[0]);

    yAxis = d3.svg.axis()
      .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.conf_hi; } )] ).rangeRound( [attr.height - margin, 0] ))
      .tickSize(6, 3, 1)
      .orient('left');

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (attr.height - margin) + ')')
      .call(xAxis);

    chart.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + x0.range()[0] + ')')
      .call(yAxis)
      .append("text")
      .style()
      .style({
        "text-anchor": "end"})
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("FPKM");

    chart.selectAll('.axis line')
      .style({
        "stroke": "black"});

    chart.selectAll('.tick line')
      .style({
        "stroke": "black"});

    var legend = chart.selectAll(".legend")
                      .data(headers[1])
                      .enter().append("g")
                      .attr("class", "legend")
                      .attr("y", 400)
                      .attr("transform", function(d, i) { return "translate(" + (((attr.width / 3) * i) + 60) + "," + (attr.height - 60) + ")"; });

    legend.append("rect")
      .attr("transform", "translate(10,-9)")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){return colors[i]});

    legend.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  },

  isoforms: function(selector, data, attr) {
    var colors = ["steelblue", "green", "crimson"];

    if (attr == undefined) { attr = {}; }
    attr.width  = attr.width  || 700;
    attr.height = attr.height || 100;
    attr.margin = attr.margin || 10;

    chart_attr = {
      width:  attr.width,
      height: attr.height
    };

    var isoform_height = attr.height - attr.margin;
    var isoform_rail_height = 0.3;

    var isoform_names = Object.keys(data);

    // Get extents
    var x_min = Math.min.apply(null,
      isoform_names.map(function(isoform, i) {
        var isoform_data = data[isoform];
        return Math.min.apply(null,
          isoform_data.map(function(elem) {
            return elem.start;
          })
        );
      })
    );

    var x_max = Math.max.apply(null,
      isoform_names.map(function(isoform, i) {
        var isoform_data = data[isoform];
        return Math.max.apply(null,
          isoform_data.map(function(elem) {
            return elem.end;
          })
        );
      })
    );

    var x = d3.scale.linear()
              .domain( [x_min, x_max] )
              .range( [0, attr.width - attr.margin] );

    // For every isoform
    isoform_names.forEach(function(isoform, i) {
      var isoform_data = data[isoform];
      var starts = isoform_data.map(function(elem) {
        return elem.start;
      });

      var ends = isoform_data.map(function(elem) {
        return elem.end;
      });

      var dataset = isoform_data.map(function(elem) {
        return {start: elem.start, end: elem.end, width: elem.width};
      });

      var isoform_selector = selector + "#isoform-" + isoform.replace('.', '_');

      var chart = d3.select(isoform_selector)
        .append("svg:svg")
        .attr("class", "chart")
        .data([data])
        .attr(chart_attr)
        .append("svg:g").attr('transform', 'translate(5, 5)');

      // Middle Rail
      var rail = chart.append('g')
                      .attr('class', 'rail');

      var x_min_local = Math.min.apply(null, starts);
      rail.append( 'rect' )
          .attr( 'x', x(x_min))
          .attr( 'y', (isoform_height-(isoform_height*isoform_rail_height))/2)
          .attr( 'width', x(x_max) - x(x_min))
          .attr( 'height', isoform_height * isoform_rail_height)
          .style({
            stroke: "none",
            fill:   "lightGray"});

      // Bars
      var bars = chart.append('g')
                      .attr('class', 'bars');

      bars.selectAll( 'rect' )
        .data( dataset )
        .enter().append( 'rect' )
        .attr( 'x', function(d) {
          return x(d.start)
        })
        .attr( 'y', 0.5)
        .attr( 'width', function(d) {
          var width = x(d.end) - x(d.start);
          if (width < 2) {
            width = 2;
          }
          return width;
        })
        .attr( 'height', isoform_height)
        .style({
          stroke: "none",
          fill:   "crimson"});
    });
  }
};
