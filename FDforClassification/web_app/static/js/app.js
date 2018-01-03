var ViewerApp;

(function (ViewerApp) {
    var App = (function() {
        function App(regionName) {
            var _this = this;
            _this.data = [];
            _this.tsneData = [];
            _this.fetchData();
            // current iteration id
            _this.iterationId = null;

            _this.fdPanel = new ViewerApp.fdPanel("fd-panel", _this);
            _this.dataInfoPanel = new ViewerApp.dataInfoPanel("data-info-panel", _this);
            _this.lossPanel = new ViewerApp.lossPanel("loss-panel", _this);
            _this.tsnePanel = new ViewerApp.tsnePanel("tsne-panel", _this);

        }

        App.prototype.fetchData = function() {
            var _this = this;
            $.get("/get_data", 'file=web_app/static/mnist-500-fixed-interval.csv')
                .done(function(data) {
                    // _this.data = JSON.parse(data);
                    // console.log(_this.data);
                    // _this.fdPanel.setData(_this.data);
                    _this.data = Papa.parse(data);
                    _this.initialData();
                    _this.dataInfoPanel.setData(_this.data);
                    _this.lossPanel.setData(_this.data);
                    _this.fdPanel.setData(_this.data);

                    // disable mask
                    $("#mask").css("height", "0%");
                    console.log("data fetched");
                })
                .fail(function() {
                    console.log("Error get data!");
                });

            $.get("/get_data", 'file=web_app/static/mnist-500-tsne-data.csv')
                .done(function(data) {
                    _this.tsneData = Papa.parse(data);
                    _this.initialTsneData();
                    _this.tsnePanel.setData(_this.tsneData);

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
            _this.fdPanel.setIter(iterationId / 10);
            _this.tsnePanel.setIter(iterationId / 10);
            // if user selection is overall
            //_this.dataInfoPanel.updatePanel4OverAll();
            // if user selection is class 5
            //_this.dataInfoPanel.updatePanel4Class(5);
            // if user selection is sample 15.png
            this.onDataSeleted(this.selectedNode);
        };

        App.prototype.onDataSeleted = function (node) {
            this.selectedNode = node;
            if(node)
            {
                if(node.index >= 10)
                {
                    this.picname = this.data[node.index - 10][4];
                    this.dataInfoPanel.updatePanel4Sample(this.picname);
                }
                else
                {
                    this.dataInfoPanel.updatePanel4Class(node.index);
                }
            }
            else
            {
                    this.dataInfoPanel.updatePanel4OverAll();
            }
        };
        
        // callback function to start training simulation from current iterationId
        App.prototype.startTraining = function () {
            // TODO
            var _this = this;
            _this.setIterationId(_this.iterationId + _this.getBatchInterval());
            if(_this.iterationId < 4690)
            {
                _this.timer = setTimeout("myApp.startTraining()", 1000);
            }
            else
            {
                this.stopTraining();
            }
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

        App.prototype.initialTsneData = function () {
            var _this = this;
            _this.tsneData = _this.tsneData.data;
            // delete field row
            _this.tsneData.shift();
            // delete blank row
            _this.tsneData.pop();
            for (var i = 0; i < _this.tsneData.length; i++) {
                _this.tsneData[i][0] = parseInt(_this.tsneData[i][0]);
                _this.tsneData[i][1] = parseFloat(_this.tsneData[i][1]);
                _this.tsneData[i][2] = parseInt(_this.tsneData[i][2]);
                _this.tsneData[i][3] = parseInt(_this.tsneData[i][3]);
                _this.tsneData[i][5] = parseFloat(_this.tsneData[i][5]);
                _this.tsneData[i][6] = parseFloat(_this.tsneData[i][6]);

                // compute iteration id
                _this.tsneData[i].push(_this.batch2iter(_this.tsneData[i][0], _this.tsneData[i][2]));
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