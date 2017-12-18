var ViewerApp;

(function (ViewerApp) {
    var App = (function() {
        function App(regionName) {
            _this = this;
            this.fdPanel = new ViewerApp.fdPanel("fd-panel", this);
            this.dataInfoPanel = new ViewerApp.dataInfoPanel("data-info-panel", this);

            // current iteration id
            this.iterationId = 0;

            this.fetchData();
        }

        App.prototype.fetchData = function() {
            var _this = this;
            $.get("/get_data")
                .done(function(data) {
                    // _this.data = JSON.parse(data);
                    // console.log(_this.data);
                    // _this.fdPanel.setData(_this.data);
                    _this.data = Papa.parse(data);
                    console.log(_this.data);
                    _this.dataInfoPanel.setData(_this.data);
                })
                .fail(function() {
                    console.log("Error get data!")
                });
        };

        // callback function to set iteration id
        App.prototype.setIterationId = function (iterationId) {
            _this.iterationId = iterationId;
            // if user selection is class 5
            this.dataInfoPanel.updatePanel4Class(5);
            //    TODO
        };

        // callback function to start training simulation from current iterationId
        App.prototype.startTraining = function () {
            // TODO
        };

        // callback function to stop training simulation
        App.prototype.stopTraining = function () {
            // TODO
        };

        return App;
    })();
    ViewerApp.App = App;
})(ViewerApp || (ViewerApp = {}));

var myApp = new ViewerApp.App("us");