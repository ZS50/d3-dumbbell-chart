import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-custom-dumbbell',
  templateUrl: './custom-dumbbell.component.html',
  styleUrls: ['./custom-dumbbell.component.scss']
})
export class CustomDumbbellComponent implements OnInit {

  public data: any[] = [
    {
      "make": "JEEP",
      "model": "WRANGLER",
      "make_model": "JEEP WRANGLER",
      "survey_items": [60, 20, 40, 80]
    },
    {
      "make": "JEEP",
      "model": "WRANGLER UNLIMITED",
      "make_model": "JEEP WRANGLER UNLIMITED",
      "survey_items": [50, 85, 40, 100]
    },
    {
      "make": "JEEP",
      "model": "RENEGADE",
      "make_model": "JEEP RENEGADE",
      "survey_items": [89, 60, 78, 140]
    },
    {
      "make": "JEEP",
      "model": "CHEROKEE",
      "make_model": "JEEP CHEROKEE",
      "survey_items": [40, 60, 80, 110]
    },
    {
      "make": "JEEP",
      "model": "GRAND CHEROKEE",
      "make_model": "JEEP GRAND CHEROKEE",
      "survey_items": [46, 15, 78, 105]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.drawChart(this.data);
  }

  drawChart(data: any) {
    //initial svg create
    let svg: any = d3.select("svg");
    let margin = { top: 20, right: 30, bottom: 30, left: 150 }
    let width = svg.attr("width") - margin.left - margin.right;
    let height = svg.attr("height") - margin.top - margin.bottom;

    // add scales
    let x = d3.scaleLinear().rangeRound([10, width - 10]);
    let y = d3.scalePoint().rangeRound([height, 10]).padding(0.4);

    let chart = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, 180]);
    y.domain(data.map(function (d: any) {
      return d.make_model;
    }));

    // x-axis
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("text-anchor", "end")
      .text("# of Vehicles");

    // y-axis
    chart.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

    var dumbbellGroup = chart.append("g")
      .attr("id", "dumbbellGroup");

    var dumbbell = dumbbellGroup.selectAll(".dumbbell")
      .data(data)
      .enter().append("g")
      .attr("class", "dumbbell")
      .attr("transform", function (d: any) { return "translate(0," + y(d.make_model) + ")"; });

    // **** Tooltip ZS ***
    var tooltip = d3.select("body").append("div").attr('class', 'tooltip');
    dumbbell.attr("cx", function (d: any, i: any) {
      return (i * 50) + 25;
    }).attr("cy", 150 / 2).attr("r", function (d: any) {
      return d;
    }).on("click", function (d: any) {
      return tooltip.style("visibility", "visible").text('Value: ' + d.target.__data__)
      .append('span').attr("class", "close").html('&times').on("click", function() {
        tooltip.style("visibility", "hidden")
      })
    }).on("mousemove", function (event: any) {
      return tooltip.style("top", (event.pageY - 30) + "px").style("left", event.pageX + 5 + "px");
    })
    // we hide our tooltip on "mouseout"
    .on("mouseout", function () {
      //return tooltip.style("visibility", "hidden");
    });

    // lines: between dots
    dumbbell.append("line")
      .attr("class", "line between")
      .attr("x1", function (d: any) {
        var min = Math.min(...d.survey_items)
        return x(min);
      })
      .attr("x2", function (d: any) {
        var max = Math.max(...d.survey_items)
        return x(max);
      })
      .attr("y1", 0)
      .attr("y2", 0);

    // lines: before dots
    // dumbbell.append("line")
    //   .attr("class", "line before")
    //   .attr("x1", 0)
    //   .attr("x2", function (d: any) { return x(d.num_vehicles_t); })
    //   .attr("y1", 0)
    //   .attr("y2", 0);

    var colors = ["#ff8d00", "#12a599", "blue", "#9024d5"];
    // dots: current inventory
    dumbbell.append("g").selectAll("circle")
      .data(function (d: any) { return d.survey_items })
      .enter()
      .append("circle")
      .style("fill", function(d:any, i:any) { return colors[i] })
      .attr("class", "circle current")
      .attr("r", 5)
      .attr("cx", function (dd: any) { return x(dd) })
      .attr("cy", 0);

    dumbbell.append("g").selectAll("text")
      .data(function (d: any) { return d.survey_items })
      .enter()
      .append("text").text(function (d: any) {
        return d;
      })
      .attr("class", "text current")
      .attr("x", function (d: any) {
        return x(d);
      })
      .attr("y", 0)
      .attr("dy", "1.6em")
      .attr("dx", -6);
  }

}
