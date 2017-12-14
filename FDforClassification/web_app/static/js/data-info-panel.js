var ViewerApp;

(function (ViewerApp) {
    var dataInfoPanel = (function () {
        function dataInfoPanel(domId, parent) {

        }

        dataInfoPanel.prototype.setData = function (data) {
            this.data = data;
            console.log(data);
        };


        var batchSlider = new Slider("#dip-batch-slider");
        batchSlider.on("slide", function (sliderValue) {
            document.getElementById("dip-batch-select").textContent = sliderValue;
        });

        return dataInfoPanel;
    })();

    ViewerApp.dataInfoPanel = dataInfoPanel;
})(ViewerApp || (ViewerApp = {}));


