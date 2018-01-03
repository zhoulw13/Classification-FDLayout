var ViewerApp;

(function(ViewerApp) {
    var tsnePanel = (function() {
        function tsnePanel(domId, parent) {
            this.dom = document.getElementById(domId);
            this.parent = parent;
            this.width = document.getElementById(domId).offsetWidth;
            this.height = document.getElementById(domId).offsetHeight;
            this.svg = d3.select("#" + domId).append("svg")
                .attr("width", this.width)
                .attr("height", this.height - 50);
            this.label = d3.select("#" + domId).append("svg")
                .attr("width", this.width)
                .attr("height", 50);
            this.colorSheet = d3.schemeCategory10;
            this.class_number = 10;
            this.test_number = 500;
            this.max_level = 10;
            this.iter = 400;
            this.selectedId = -1;
            this.className = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];

            this.xScalar = null;
            this.yScalar = null;
        }

        tsnePanel.prototype.setData = function(data) {
            var _this = this;
            this.data = data;

            minx = d3.min(_this.data, function(d) { return d[5]; })
            miny = d3.min(_this.data, function(d) { return d[6]; })
            maxx = d3.max(_this.data, function(d) { return d[5]; })
            maxy = d3.max(_this.data, function(d) { return d[6]; })

            this.xScalar = d3.scaleLinear()
            .domain([minx, maxx])
            .range([ 0, this.width ]);

            this.yScalar = d3.scaleLinear()
                .domain([miny, maxy])
                .range([ this.height-50, 0 ]);

            this.preRender();
        };

        tsnePanel.prototype.setIter = function (iter) {
            var _this = this;
            this.iter = iter;
            this.clear();
            this.render()
        };


        tsnePanel.prototype.preRender = function () {
            var _this = this;

            this.label.selectAll("g").data(this.className).enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate("+ i * _this.width / _this.class_number +","+ 0 +")";
                })
                .each(function (d, i) {
                    d3.select(this).append("rect")
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", _this.colorSheet[i]);
                    d3.select(this).append("text")
                        .attr("x", 40)
                        .attr("y", 27)
                        .attr("font-size", "18px")
                        .text(d);
                });

            this.svg.selectAll("circle")
                 .data(this.getIterationData(_this.iter))
                 .enter().append("circle")
                 .attr("r", 2.5)
                 .attr("cx", function(d) { return _this.xScalar(d[5]); })
                 .attr("cy", function(d) { return _this.yScalar(d[6]); })
                 .style("fill", function(d) { return _this.colorSheet[d[3]]});
        }

        tsnePanel.prototype.render = function() {
            var _this = this;

            this.svg.selectAll("circle")
                .data(this.getIterationData(_this.iter))
                .transition().duration(0)
                .attr("cx", function(d) { return _this.xScalar(d[5]); })
                .attr("cy", function(d) { return _this.yScalar(d[6]); });

        };

        tsnePanel.prototype.getIterationData = function(iter) {
            var _this = this;
            return _this.data.slice(iter*_this.test_number,(iter+1)*_this.test_number)
        }

        tsnePanel.prototype.clear = function() {

        };


        return tsnePanel;
    })();

    ViewerApp.tsnePanel = tsnePanel;
})(ViewerApp || (ViewerApp = {}));