var ViewerApp;

(function (ViewerApp) {
    var dataInfoPanel = (function () {
        function dataInfoPanel(domId, parent) {
            _this = this;
            _this.dom = document.getElementById(domId);
            _this.parent = parent;
            _this.initialPanel();
        }

        dataInfoPanel.prototype.setData = function (data) {
            _this.data = data.data;
            _this.initialData();
            // _this.updatePanel4OverAll();
            _this.updatePanel4Class(2);
            // _this.updatePanel4Sample("1.png");
            console.log(_this.data);
        };

        dataInfoPanel.prototype.initialPanel = function () {
            _this.batchSlider = new Slider("#dip-batch-slider");
            _this.batchSlider.on("slideStop", function (sliderValue) {
                document.getElementById("dip-batch-select").textContent = sliderValue;
                _this.parent.setIterationId(sliderValue);
            });
        };

        dataInfoPanel.prototype.updatePanel4OverAll = function () {
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            $("#dip-overall-info").css("display", "block");
            $("#dip-class-info").css("display", "none");
            $("#dip-sample-info").css("display", "none");
        };

        dataInfoPanel.prototype.updatePanel4Class = function (classId) {
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            $("#dip-overall-info").css("display", "none");
            $("#dip-class-info").css("display", "block");
            $("#dip-sample-info").css("display", "none");
            $("#dip-class-name").text(classId);
        };


        dataInfoPanel.prototype.updatePanel4Sample = function (samplePath) {
            _this.batchSlider.setAttribute("max", _this.data[_this.data.length - 1][15]);
            $("#dip-overall-info").css("display", "none");
            $("#dip-class-info").css("display", "none");
            $("#dip-sample-info").css("display", "block");
        };

        dataInfoPanel.prototype.initialData = function () {
            // delete field row
            _this.data.shift();
            // delete blank row
            _this.data.pop();
            for (var i = 0; i < _this.data.length; i++) {
                _this.data[i][0] = parseInt(_this.data[i][0]);
                _this.data[i][1] = parseFloat(_this.data[i][1]);
                _this.data[i][2] = parseInt(_this.data[i][2]);
                _this.data[i][3] = parseInt(_this.data[i][3]);
                for (var j = 5; j < 15; j++) {
                    _this.data[i][j] = parseFloat(_this.data[i][j]);
                }
                // compute iteration id
                _this.data[i].push(_this.batch2iter(_this.data[i][0], _this.data[i][2]));
            }
        };

        // function for translating epochId and batchId to iterationId
        dataInfoPanel.prototype.batch2iter = function (epoch, batch) {
            return 940 * (epoch - 1) + batch;
        };

        // function for translating iterationId to epochId and batchId
        dataInfoPanel.prototype.iter2batch = function (iter) {
            var epoch = Math.floor(iter / 940);
            var batch = iter % 940;
            return [epoch, batch];
        };

        return dataInfoPanel;
    })();

    ViewerApp.dataInfoPanel = dataInfoPanel;
})(ViewerApp || (ViewerApp = {}));


