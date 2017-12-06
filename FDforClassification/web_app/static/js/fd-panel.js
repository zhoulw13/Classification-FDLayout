var ViewerApp;

(function(ViewerApp) {
    var fdPanel = (function() {
        function fdPanel(domId, parent) {
            this.dom = document.getElementById(domId);
            this.parent = parent;
            this.width = document.getElementById(domId).offsetWidth;
            this.height = document.getElementById(domId).offsetHeight;
            this.svg = d3.select("#" + domId).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

            //this.render();
        }

        fdPanel.prototype.setData = function(data) {
            this.data = data;
            console.log(data);
            this.clear();
            this.render()
        };

        fdPanel.prototype.render = function() {
            var _this = this;
        };

        fdPanel.prototype.clear = function() {

        };


        return fdPanel;
    })();

    ViewerApp.fdPanel = fdPanel;
})(ViewerApp || (ViewerApp = {}));