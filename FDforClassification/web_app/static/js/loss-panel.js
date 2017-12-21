var ViewerApp;

(function (ViewerApp) {
    var lossPanel = (function () {
        function lossPanel(domId, parent) {
            _this = this;
            _this.dom = document.getElementById(domId);
            _this.parent = parent;
            _this.svgDom = document.getElementById("lp-content");
            _this.margin = {top: 30, right: 30, bottom: 30, left: 30};
            _this.svg = d3.select("#lp-content").append("svg")
                .attr("width", _this.svgDom.offsetWidth)
                .attr("height", _this.svgDom.offsetHeight)
                .append("g")
                .attr("transform", "translate(" + _this.margin.left + "," + _this.margin.top + ")");
            _this.width = _this.svgDom.offsetWidth - _this.margin.left - _this.margin.right;
            _this.height = _this.svgDom.offsetHeight - _this.margin.top - _this.margin.bottom;
        }

        lossPanel.prototype.setData = function (data) {
            var _this = this;
            _this.data = data;
            _this.initialPanel();
        };

        lossPanel.prototype.initialPanel = function () {
            var _this = this;
            var max_x = _this.data[_this.data.length - 1][15];
            _this.xScale = d3.scaleLinear()
                .domain([0, max_x])
                .range([0, _this.width]);
            _this.yScale = d3.scaleLinear()
                .domain([0, Math.ceil(_this.data[0][1])])
                .range([_this.height, 0]);

            _this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + _this.height + ")")
                .call(d3.axisBottom(_this.xScale));
            _this.svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(_this.yScale));

            _this.updatePanel();
        };

        lossPanel.prototype.updatePanel = function () {
            var _this = this;
            var iterationId = _this.parent.iterationId;
            var lossData = _this.getLossData(iterationId);
            var line = d3.line()
                .x(function (d) {
                    return _this.xScale(d[15]);
                }) // set the x values for the line generator
                .y(function (d) {
                    return _this.yScale(d[1]);
                }) // set the y values for the line generator
                .curve(d3.curveMonotoneX); // apply smoothing to the line

            d3.selectAll(".loss-line").remove();
            _this.svg.append("path")
                .datum(lossData) // 10. Binds data to the line
                .attr("class", "loss-line") // Assign a class for styling
                .attr("d", line);
        };

        lossPanel.prototype.getLossData = function (iterationId) {
            var _this = this;
            var lossDataList = [_this.data[0]];
            var temp = 0;
            for (var i in _this.data) {
                if (_this.data[i][15] > temp && _this.data[i][15] <= iterationId) {
                    lossDataList.push(_this.data[i]);
                    temp = _this.data[i][15];
                }
            }
            return lossDataList;
        };

        return lossPanel;
    })();

    ViewerApp.lossPanel = lossPanel;
})(ViewerApp || (ViewerApp = {}));