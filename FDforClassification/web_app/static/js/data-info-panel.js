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
            _this.runButton = $("#dip-run-button");
            _this.runButton.bootstrapToggle('on');
            _this.runButton.change(_this.onclickRunButton);
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
            $("#dip-overall-info").css("display", "none");
            $("#dip-class-info").css("display", "none");
            $("#dip-sample-info").css("display", "block");
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
            if (_this.runButton.prop('checked'))
            console.log("onclick");
        };

        return dataInfoPanel;
    })();

    ViewerApp.dataInfoPanel = dataInfoPanel;
})(ViewerApp || (ViewerApp = {}));

