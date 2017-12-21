var ViewerApp;

(function (ViewerApp) {
    var App = (function() {
        function App(regionName) {
            var _this = this;
            _this.data = [];
            _this.fetchData();
            // current iteration id
            _this.iterationId = null;

            _this.fdPanel = new ViewerApp.fdPanel("fd-panel", _this);
            _this.dataInfoPanel = new ViewerApp.dataInfoPanel("data-info-panel", _this);
            _this.lossPanel = new ViewerApp.lossPanel("loss-panel", _this);
        }

        App.prototype.fetchData = function() {
            var _this = this;
            $.get("/get_data")
                .done(function(data) {
                    // _this.data = JSON.parse(data);
                    // console.log(_this.data);
                    // _this.fdPanel.setData(_this.data);
                    _this.data = Papa.parse(data);
                    _this.initialData();
                    _this.dataInfoPanel.setData(_this.data);
                    _this.lossPanel.setData(_this.data);
                    // disable mask
                    $("#mask").css("height", "0%");
                    console.log("data fetched");
                })
                .fail(function() {
                    console.log("Error get data!");
                });
        };

        // callback function to set iteration id
        App.prototype.setIterationId = function (iterationId) {
            var _this=this;
            _this.iterationId = iterationId;
            _this.lossPanel.updatePanel();
            // if user selection is overall
            //_this.dataInfoPanel.updatePanel4OverAll();
            // if user selection is class 5
            //_this.dataInfoPanel.updatePanel4Class(5);
            // if user selection is sample 15.png
            _this.dataInfoPanel.updatePanel4Sample("15.png");
        };

        // callback function to start training simulation from current iterationId
        App.prototype.startTraining = function () {
            // TODO
            var _this = this;
            _this.setIterationId(_this.iterationId + _this.getBatchInterval());
            _this.timer = setTimeout("myApp.startTraining()", 1000);
        };

        // callback function to stop training simulation
        App.prototype.stopTraining = function () {
            // TODO
            var _this = this;
            clearTimeout(_this.timer);
        };

        App.prototype.initialData = function () {
            var _this = this;
            _this.data = _this.data.data;
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
        App.prototype.batch2iter = function (epoch, batch) {
            return 940 * (epoch - 1) + batch;
        };

        // function for translating iterationId to epochId and batchId
        App.prototype.iter2batch = function (iter) {
            var epoch = Math.floor(iter / 940);
            var batch = iter % 940;
            return [epoch, batch];
        };

        App.prototype.getBatchInterval = function () {
            var _this = this;
            var temp = _this.data[0][15];
            for (var i in _this.data) {
                if (_this.data[i][15] != temp) {
                    return _this.data[i][15] - temp;
                }
            }
            return 0;
        };

        return App;
    })();
    ViewerApp.App = App;
})(ViewerApp || (ViewerApp = {}));

var myApp = new ViewerApp.App("us");