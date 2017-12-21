var ViewerApp;

(function (ViewerApp) {
    var dataInfoPanel = (function () {
        function dataInfoPanel(domId, parent) {
            var _this = this;
            _this.dom = document.getElementById(domId);
            _this.parent = parent;
            _this.initialPanel();
        }

        dataInfoPanel.prototype.initialPanel = function () {
            var _this = this;
            var runButton = $("#dip-run-button");
            runButton.bootstrapToggle('on');
            runButton.change(_this.onclickRunButton);

            _this.batchSlider = new Slider("#dip-batch-slider");
            _this.batchSlider.on("slideStop", function (sliderValue) {
                document.getElementById("dip-batch-select").textContent = sliderValue;
                _this.parent.setIterationId(sliderValue);
            });
        };

        dataInfoPanel.prototype.setData = function (data) {
            var _this = this;
            _this.data = data;
            _this.updatePanel4OverAll();
        };

        dataInfoPanel.prototype.updatePanel4OverAll = function () {
            var _this = this;
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            _this.updateBatchSlider();

            var iterationId = _this.parent.iterationId;
            var loss = _this.getADataWithIter(iterationId)[1];
            d3.select("#dip-table-loss").text(loss);
            $("#dip-overall-info").css("display", "block");
            $("#dip-class-info").css("display", "none");
            $("#dip-sample-info").css("display", "none");
        };

        dataInfoPanel.prototype.updatePanel4Class = function (classId) {
            var _this = this;
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            _this.updateBatchSlider();

            var iterationId = _this.parent.iterationId;
            var img_list = _this.getClassInfoImgList(classId, iterationId, 10);
            var tableFunc = function (d) {
                var pList = _this.sortWithIndeces(d.slice(5, 15));
                var text = "<td><img src=\"static/images/dataset/" + d[4] + "\" class=\"img-rounded\"></td>"; // img
                text = text + "<td>" + d[4] + "</td>"; // name
                text = text + "<td>" + pList.sortIndices[0] + "<br>" + pList[0]*100 + "</td>"; // 1st
                text = text + "<td>" + pList.sortIndices[1] + "<br>" + pList[1]*100 + "</td>"; // 2nd
                text = text + "<td>" + pList.sortIndices[2] + "<br>" + pList[2]*100 + "</td>"; // 3rd
                return text;
            };
            d3.select("#dip-class-image-table-body")
                .selectAll('tr').remove();
            d3.select("#dip-class-image-table-body")
                .selectAll('tr')
                .data(img_list)
                .enter().append("tr").html(tableFunc);
            $("#dip-overall-info").css("display", "none");
            $("#dip-class-info").css("display", "block");
            $("#dip-sample-info").css("display", "none");
            $("#dip-class-name").text(classId);
        };


        dataInfoPanel.prototype.updatePanel4Sample = function (samplePath) {
            var _this = this;
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            _this.updateBatchSlider();

            $("#dip-sample-name").text(samplePath);
            var iterationId = _this.parent.iterationId;
            var dataItem = _this.getDataItem(samplePath, iterationId);
            d3.select("#dip-sample-img").selectAll("img").remove();
            d3.select("#dip-sample-img").append("img")
                .attr("src", "static/images/dataset/" + samplePath)
                .attr("class", "img-rounded")
                .style("width", "190px").style("height", "190px");

            var sortedData = _this.sortWithIndeces(dataItem.slice(5, 15));
            var pieChartData = makePieChartDate(sortedData);
            var width = 260,
                height = 260,
                radius = 130;
            var color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6a6666"]);

            var arc = d3.arc().outerRadius(radius-10).innerRadius(0);
            var labelArc = d3.arc().outerRadius(radius-40).innerRadius(radius-40);
            var pie = d3.pie().sort(null).value(function (d) {
                return d[0];
            });

            d3.select("#dip-sample-pie-chart").selectAll("svg").remove();
            var svg = d3.select("#dip-sample-pie-chart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width/2 + "," +height/2 + ")");

            var g = svg.selectAll(".arc")
                .data(pie(pieChartData))
                .enter().append("g").attr("class", "arc");
            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return color(d.data);
                });
            g.append("text")
                .attr("transform", function (d) {
                    return "translate(" + labelArc.centroid(d) + ")";
                })
                .attr("dy", "1.35em")
                .text(function (d) {
                    return d.data[1];
                });

            var sampleTableData = [];
            for (var j=0;j<sortedData.length;j++) {
                sampleTableData.push([sortedData[j], sortedData.sortIndices[j]]);
            }
            d3.select("#dip-sample-table").select("tbody").selectAll("tr").filter(function (d, i) {return i>0;}).remove();
            var infoTr = d3.select("#dip-sample-table").select("tbody").selectAll("tr").filter(function (d, i) {return i>0;})
                .data(sampleTableData).enter()
                .append("tr").attr("class", function (d, i) {
                if (i<3) { return "danger"; }
                return "success";
            });

            infoTr.append("td").attr("width", "25%")
                .text(function (d, i) {
                    if (i == 0) {return "1 st";}
                    if (i == 1) {return "2 nd";}
                    if (i == 2) {return "3 rd";}
                    return (i+1) + " th";
                });
            infoTr.append("td").attr("width", "25%")
                .text(function (d) {
                    return "lable: " + d[1];
                });
            infoTr.append("td").attr("width", "50%")
                .text(function (d) {
                    return (d[0]*100).toFixed(2) + "%";
                });

            $("#dip-overall-info").css("display", "none");
            $("#dip-class-info").css("display", "none");
            $("#dip-sample-info").css("display", "block");

            function makePieChartDate(sortedData) {
                var data = [];
                for (var i=0;i<3;i++) {
                    data.push([sortedData[i], sortedData.sortIndices[i]]);
                }
                data.push([1-data[0][0]-data[1][0]-data[2][0], "others"]);
                return data;
            }
        };

        dataInfoPanel.prototype.updateBatchSlider = function () {
            var _this = this;
            var iterationId = _this.parent.iterationId;
            _this.batchSlider.setValue(iterationId);
            document.getElementById("dip-batch-select").textContent = iterationId;
        };


        dataInfoPanel.prototype.getClassInfoImgList = function (classId, iterationId, listNum) {
            // console.log(iterationId);
            var _this = this;
            var selectedList = _this.data.filter(function (x) {
                return (x[15] == iterationId && x[3] == classId);
            });
            var pId = classId + 5;
            var returnList = selectedList.sort(function (x, y) {
                if (x[pId] > y[pId]) {
                    return -1;
                }
                if (x[pId] < y[pId]) {
                    return 1;
                }
                return 0;
            });
            return returnList.slice(0, listNum);
        };

        dataInfoPanel.prototype.getDataItem = function(imgPath, iterationId) {
            var _this = this;
            for (var i in _this.data) {
                if (_this.data[i][15] == iterationId && _this.data[i][4] == imgPath) {
                    return _this.data[i];
                }
            }
            return [];
        };

        dataInfoPanel.prototype.sortWithIndeces = function (toSort) {
            for (var i = 0; i < toSort.length; i++) {
                toSort[i] = [toSort[i], i];
            }
            toSort.sort(function (left, right) {
                return left[0] > right[0] ? -1 : 1;
            });
            toSort.sortIndices = [];
            for (var j = 0; j < toSort.length; j++) {
                toSort.sortIndices.push(toSort[j][1]);
                toSort[j] = toSort[j][0];
            }
            return toSort;
        };

        dataInfoPanel.prototype.getADataWithIter = function (iterationId) {
            var _this = this;
            for (var i in _this.data) {
                if (_this.data[i][15] == iterationId) {
                    return _this.data[i];
                }
            }
            return [];
        };

        dataInfoPanel.prototype.onclickRunButton = function () {
            var _this = myApp.dataInfoPanel;
            var runButton = $("#dip-run-button");
            if (runButton.prop('checked')) {
                _this.parent.stopTraining();
                _this.batchSlider.enable();
            }
            else {
                _this.batchSlider.disable();
                _this.parent.startTraining();
            }
        };

        return dataInfoPanel;
    })();

    ViewerApp.dataInfoPanel = dataInfoPanel;
})(ViewerApp || (ViewerApp = {}));

