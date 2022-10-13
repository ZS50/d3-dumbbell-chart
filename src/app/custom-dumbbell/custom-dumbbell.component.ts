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
      "time": "30",
      "num_vehicles_t0": 25,
      "num_vehicles_t": "8",
      "num_vehicles_t1": "12",
      "num_vehicles_t2": "17",
      "surv_prob": "0.53"
    },
    {
      "make": "JEEP",
      "model": "WRANGLER UNLIMITED",
      "make_model": "JEEP WRANGLER UNLIMITED",
      "time": "30",
      "num_vehicles_t0": 55,
      "num_vehicles_t": "23",
      "num_vehicles_t1": "40",
      "num_vehicles_t2": "50",
      "surv_prob": "0.43"
    },
    {
      "make": "JEEP",
      "model": "RENEGADE",
      "make_model": "JEEP RENEGADE",
      "time": "30",
      "num_vehicles_t0": 59,
      "num_vehicles_t": "39",
      "num_vehicles_t1": "50",
      "num_vehicles_t2": "56",
      "surv_prob": "0.67"
    },
    {
      "make": "JEEP",
      "model": "COMPASS",
      "make_model": "JEEP COMPASS",
      "time": "30",
      "num_vehicles_t0": 60,
      "num_vehicles_t": "35",
      "num_vehicles_t1": "50",
      "num_vehicles_t2": "53",
      "surv_prob": "0.59"
    },
    {
      "make": "JEEP",
      "model": "CHEROKEE",
      "make_model": "JEEP CHEROKEE",
      "time": "30",
      "num_vehicles_t0": 124,
      "num_vehicles_t": "80",
      "num_vehicles_t1": "90",
      "num_vehicles_t2": "100",
      "surv_prob": "0.65"
    },
    {
      "make": "JEEP",
      "model": "GRAND CHEROKEE",
      "make_model": "JEEP GRAND CHEROKEE",
      "time": "30",
      "num_vehicles_t0": 136,
      "num_vehicles_t": "83",
      "num_vehicles_t1": "95",
      "num_vehicles_t2": "100",
      "surv_prob": "0.62"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    let svg: any = d3.select("svg");
    let margin = { top: 20, right: 30, bottom: 30, left: 150 }
    let width = svg.attr("width") - margin.left - margin.right;
    let height = svg.attr("height") - margin.top - margin.bottom;

    // add scales
    let x = d3.scaleLinear().rangeRound([10, width - 10]);
    let y = d3.scalePoint().rangeRound([height, 10]).padding(0.4);

    let chart = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // import data from csv
    (d3 as any).csv("../assets/dumbbell.csv", (d: any) => {
      d.num_vehicles_t0 = +d.num_vehicles_t0;
      return d;
    }).then((data: any) => {
      // sort vehicles from highest to lowest inventory
      data.sort(function (a: any, b: any) {
        return d3.ascending(+a.num_vehicles_t0, +b.num_vehicles_t0);
      });

      x.domain([0, (d3 as any).max(data, function (d: any) { return d.num_vehicles_t0; })]);
      y.domain(data.map(function (d: any) { return d.make_model; }));

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
        console.log(d, "Zub")
        return (i * 50) + 25;
      }).attr("cy", 150 / 2).attr("r", function (d: any) {
        return d;
      }).on("mouseover", function (d: any) {
        console.log(d)
        return tooltip.style("visibility", "visible").text('Value: ' + d.target.__data__.num_vehicles_t0);
      })
        // we move tooltip during of "mousemove"
        .on("mousemove", function (event: any) {
          return tooltip.style("top", (event.pageY - 30) + "px").style("left", event.pageX + "px");
        })
        // we hide our tooltip on "mouseout"
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        });

      // lines: between dots
      dumbbell.append("line")
        .attr("class", "line between")
        .attr("x1", function (d: any) { return x(d.num_vehicles_t); })
        .attr("x2", function (d: any) { return x(d.num_vehicles_t0); })
        .attr("y1", 0)
        .attr("y2", 0);

      // lines: before dots
      // dumbbell.append("line")
      //   .attr("class", "line before")
      //   .attr("x1", 0)
      //   .attr("x2", function (d: any) { return x(d.num_vehicles_t); })
      //   .attr("y1", 0)
      //   .attr("y2", 0);

      // dots: current inventory
      dumbbell.append("circle")
        .attr("class", "circle current")
        .attr("cx", function (d: any) { return x(d.num_vehicles_t0); })
        .attr("cy", 0)
        .attr("r", 5);

      // data labels: current
      dumbbell.append("text")
        .attr("class", "text current")
        .attr("x", function (d: any) { return x(d.num_vehicles_t0); })
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("dx", 10)
        .text(function (d: any) { return d.num_vehicles_t0; });

      // data labels: future
      dumbbell.append("text")
        .attr("class", "text future")
        .attr("x", function (d: any) { return x(d.num_vehicles_t); })
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("dx", -10)
        .attr("text-anchor", "end")
        .text(function (d: any) { return d.num_vehicles_t; });


      // d3.select(".dumbbell:last-child")
      //   .append("text")
      //   .attr("class", "label current")
      //   .attr("x", function (d: any) { return x(d.num_vehicles_t0); })
      //   .attr("y", 0)
      //   .attr("dy", -20)
      //   .attr("text-anchor", "middle")
      //   .text("Current");
      // d3.select(".dumbbell:last-child")
      //   .append("text")
      //   .attr("class", "label future")
      //   .attr("x", function (d: any) { return x(d.num_vehicles_t); })
      //   .attr("y", 0)
      //   .attr("dy", -20)
      //   .attr("text-anchor", "middle")
      //   .text(function (d: any) { return d.time + " Days"; });

      // dots: future inventory
      dumbbell.append("circle")
        .attr("class", "circle future")
        .attr("cx", function (d: any) { return x(d.num_vehicles_t); })
        .attr("cy", 0)
        .attr("r", 5);

      dumbbell.append("circle")
        .attr("class", "circle future")
        .attr("cx", function (d: any) { return x(d.num_vehicles_t1); })
        .attr("cy", 0)
        .attr("r", 5);

      dumbbell.append("circle")
        .attr("class", "circle future")
        .attr("cx", function (d: any) { return x(d.num_vehicles_t2); })
        .attr("cy", 0)
        .attr("r", 5);
    })
      .catch((error: any) => {
        if (error) throw error;
      });
  }

}
