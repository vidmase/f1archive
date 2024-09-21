import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LapTimesChart = ({ lapTimes }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (lapTimes && d3Container.current) {
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove();

            const margin = { top: 20, right: 120, bottom: 50, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .domain([1, d3.max(lapTimes, d => d3.max(d.times, t => t.lap))])
                .range([0, width]);

            const y = d3.scaleTime()
                .domain([
                    d3.min(lapTimes, d => d3.min(d.times, t => d3.timeParse("%M:%S.%L")(t.time))),
                    d3.max(lapTimes, d => d3.max(d.times, t => d3.timeParse("%M:%S.%L")(t.time)))
                ])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            const line = d3.line()
                .x(d => x(d.lap))
                .y(d => y(d3.timeParse("%M:%S.%L")(d.time)));

            lapTimes.forEach(driver => {
                g.append("path")
                    .datum(driver.times)
                    .attr("class", `line-${driver.driverId}`)
                    .attr("fill", "none")
                    .attr("stroke", color(driver.driverId))
                    .attr("stroke-width", 2)
                    .attr("d", line);
            });

            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10))
                .append("text")
                .attr("fill", "#fff")
                .attr("x", width / 2)
                .attr("y", 35)
                .attr("text-anchor", "middle")
                .text("Lap Number");

            g.append("g")
                .call(d3.axisLeft(y).ticks(10).tickFormat(d3.timeFormat("%M:%S")))
                .append("text")
                .attr("fill", "#fff")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .text("Lap Time");

            const legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(lapTimes)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(${width + 90},${i * 20})`);

            legend.append("rect")
                .attr("x", -19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", d => color(d.driverId));

            legend.append("text")
                .attr("x", -24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .attr("fill", "#fff")
                .text(d => d.driverId);

            // Add hover functionality
            legend.on("mouseover", function (event, d) {
                svg.selectAll(".line-" + d.driverId).style("stroke-width", 4);
                svg.selectAll("path").style("opacity", 0.1);
                svg.selectAll(".line-" + d.driverId).style("opacity", 1);
            }).on("mouseout", function () {
                svg.selectAll("path").style("stroke-width", 2).style("opacity", 1);
            });

            g.selectAll("path")
                .on("mouseover", function () {
                    const className = d3.select(this).attr("class");
                    svg.selectAll("path").style("opacity", 0.1);
                    svg.selectAll("." + className).style("opacity", 1).style("stroke-width", 4);
                })
                .on("mouseout", function () {
                    svg.selectAll("path").style("stroke-width", 2).style("opacity", 1);
                });
        }
    }, [lapTimes]);

    if (!lapTimes || lapTimes.length === 0) {
        return <div>No lap times data available</div>;
    }

    return (
        <svg
            className="d3-component"
            width={800}
            height={400}
            ref={d3Container}
        />
    );
};

export default LapTimesChart;
