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
            var xScale = d3.scaleLinear()
                .domain([0, max_x])
                .range([0, _this.width]);
            var yScale = d3.scaleLinear()
                .domain([0, Math.ceil(_this.data[0][1])])
                .range([_this.height, 0]);

            _this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + _this.height + ")")
                .call(d3.axisBottom(xScale));
            _this.svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale));
        };

        return lossPanel;
    })();

    ViewerApp.lossPanel = lossPanel;
})(ViewerApp || (ViewerApp = {}));