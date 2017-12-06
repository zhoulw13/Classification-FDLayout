var ViewerApp;

(function (ViewerApp) {
    var App = (function() {
        function App(regionName) {
            _this = this;
            this.fdPanel = new ViewerApp.fdPanel("fd-panel", this);

            this.fetchData();
        }

        App.prototype.fetchData = function() {
            var _this = this;
            $.get("/get_data")
                .done(function(data) {
                    _this.data = JSON.parse(data);
                    console.log(_this.data);
                    _this.fdPanel.setData(_this.data);
                })
                .fail(function() {
                    console.log("Error get data!")
                });
        }

        return App;
    })();
    ViewerApp.App = App;
})(ViewerApp || (ViewerApp = {}));

var myApp = new ViewerApp.App("us");