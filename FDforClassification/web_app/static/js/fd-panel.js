var ViewerApp;

(function(ViewerApp) {
    var fdPanel = (function() {
        function fdPanel(domId, parent) {
            this.dom = document.getElementById(domId);
            this.parent = parent;
            this.width = document.getElementById(domId).offsetWidth;
            this.height = document.getElementById(domId).offsetHeight;
            this.canvas = d3.select("#" + domId).append("canvas")
                .attr("width", this.width)
                .attr("height", this.height - 50);
            this.svg = d3.select("#" + domId).append("svg")
                .attr("width", this.width)
                .attr("height", 50);
            this.colorSheet = d3.schemeCategory10;
            this.class_number = 10;
            this.test_number = 500;
            this.max_level = 10;
            this.nodes = [];
            this.links = [];
            this.iter = 100;
            this.selectedId = -1;
            this.className = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
        }

        fdPanel.prototype.setData = function(data) {
            var _this = this;
            this.data = data;
            this.sorted = new Array(data.length);
            this.sortedInd = new Array(data.length);
            for(var i = 0; i < data.length; i++)
            {
                this.sorted[i] = false;
            }
            //console.log(data);

            this.nodes = d3.range(this.class_number + this.test_number).map(function(i) {
              return {
                index: i
              };
            });
            this.preRender();
            this.setIter(400);
        };

        fdPanel.prototype.setIter = function (iter) {
            var _this = this;
            this.iter = iter;
            this.links = d3.range(this.test_number * (this.max_level + 1)).map(function(i) {
                if(i < _this.test_number)
                {
                    return {
                        source: i + 10,
                        target: _this.data[i][3],
                        type: 0
                    };
                }
                else
                {
                    var rank = Math.floor(i / _this.test_number) - 1;
                    i = i % _this.test_number + _this.test_number * _this.iter;
                    if(_this.sorted[i] != true)
                    {
                        _this.sortedInd[i] = _this.sortWithIndeces(_this.data[i].slice(5, 15));
                        _this.sorted[i] = true;
                    }
                    return {
                        source: i + 10 - _this.test_number * _this.iter,
                        target: _this.sortedInd[i][rank],
                        type: 1
                    };
                }
            });
            this.clear();
            this.render()
        };

        fdPanel.prototype.sortWithIndeces = function (toSort) {
            for (var i = 0; i < toSort.length; i++) {
                toSort[i] = [toSort[i], i];
            }
            toSort.sort(function (left, right) {
                return left[0] > right[0] ? -1 : 1;
            });
            toSort.sortIndices = [];
            for (var j = 0; j < toSort.length; j++) {
                toSort.sortIndices.push(toSort[j][1]);
            }
            return toSort.sortIndices;
        };

        fdPanel.prototype.preRender = function () {
            var _this = this;

            this.svg.selectAll("g").data(this.className).enter().append("g")
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

            this.context = document.querySelector("canvas").getContext("2d");


            this.drawLink = function(d) {
                var alpha = _this.data[d.source.index - 10 + _this.test_number * _this.iter][d.target.index + 5];
                if(alpha > 0.2)
                {
                    if(alpha >= 0.5) alpha = 1;
                    else if(alpha >= 0.1) alpha = 0.3;
                    _this.context.beginPath();
                    _this.context.moveTo(d.source.x, d.source.y);
                    _this.context.lineTo(d.target.x, d.target.y);
                    _this.context.strokeStyle = "rgba(150, 150, 150, " + alpha + ")";
                    if(d.source.index == _this.selectedId || d.target.index == _this.selectedId)
                    {
                        _this.context.strokeStyle = "rgba(255, 0, 0, " + alpha + ")";
                    }
                    _this.context.stroke();
                }
            };

            this.drawNode = function(d) {
                _this.context.beginPath();
                if(d.index <= 9)
                {
                    _this.context.fillStyle = _this.colorSheet[d.index];
                    _this.context.moveTo(d.x + 10, d.y);
                    _this.context.arc(d.x, d.y, 10, 0, 2 * Math.PI);
                }
                else
                {
                    _this.context.fillStyle = "#000";
                    if(d.index == _this.selectedId)
                    {
                        _this.context.fillStyle = "rgba(255, 0, 0, 1)";
                    }
                    _this.context.moveTo(d.x + 3, d.y);
                    _this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
                }
                _this.context.fill();
                _this.context.strokeStyle = "#fff";
                _this.context.stroke();
            };

            this.ticked = function() {
                  _this.context.clearRect(0, 0, _this.width, _this.height);
                  _this.context.save();
                  _this.context.translate(_this.width / 2, _this.height / 2);
                  _this.links.forEach(_this.drawLink);
                  _this.nodes.forEach(_this.drawNode);
                  _this.context.restore();
            };


            this.simulation = d3.forceSimulation(this.nodes)
                .alphaDecay(0.1)
                .force("charge", d3.forceManyBody())
                .force("collide", d3.forceCollide().radius(function (node) {
                    if(node.index < 10)
                    {
                        return 10;
                    }
                    return 1;
                }).strength(2))
                .force("link", d3.forceLink(this.links).distance(20).strength(function (link) {
                    if(link.type == 0)
                    {
                        return 0.1;
                    }
                    return _this.data[link.source.index - 10 + _this.test_number * _this.iter][link.target.index + 5];
                }))
                .force("x", d3.forceX())
                .force("y", d3.forceY())
                .on("tick", this.ticked);

            this.dragsubject = function() {
                var node = _this.simulation.find(d3.event.x - _this.width / 2, d3.event.y - _this.height / 2, 20);
                if(node)
                {
                    _this.selectedId = node.index;
                }
                else
                {
                    _this.selectedId = -1;
                }
                _this.parent.onDataSeleted(node);
                return node;
            }

            this.dragstarted = function() {
                  if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart();
                  d3.event.subject.fx = d3.event.subject.x;
                  d3.event.subject.fy = d3.event.subject.y;
            }

            this.dragged = function() {
                  d3.event.subject.fx = d3.event.x;
                  d3.event.subject.fy = d3.event.y;
            }

            this.dragended = function() {
                  if (!d3.event.active) _this.simulation.alphaTarget(0);
                  d3.event.subject.fx = null;
                  d3.event.subject.fy = null;
            }

            this.canvas
                .call(d3.drag()
                    .container(document.querySelector("canvas"))
                    .subject(this.dragsubject)
                    .on("start", this.dragstarted)
                    .on("drag", this.dragged)
                    .on("end", this.dragended));


        }

        fdPanel.prototype.render = function() {
            var _this = this;
            this.simulation.stop();
            this.simulation.alpha(0.3)
                .alphaDecay(0.0228)
                //.alphaMin(0.1)
                .force("link", d3.forceLink(this.links).distance(20).strength(function (link) {
                    if(link.type == 0)
                    {
                        return 0.1;
                    }
                    return _this.data[link.source.index - 10 + _this.test_number * _this.iter][link.target.index + 5];
                }));
            this.simulation.restart();
        };

        fdPanel.prototype.clear = function() {

        };


        return fdPanel;
    })();

    ViewerApp.fdPanel = fdPanel;
})(ViewerApp || (ViewerApp = {}));