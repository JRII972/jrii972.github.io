

jQuery.fn.extend({
    setAttribute: function(type, value) {
        return this.attr(type, value);
    },
    getAttribute: function(type) {
        return this.attr(type);
    },
});

jsPlumb.ready(function () {

    var c_normal = "wheat";    
    var c_active = "blue";    
    var c_disable = "gray";    
    var c_unique = "red";      
    var dash = "2 4" 
    var canvas = document.getElementById("jsplumb");
  
    var instance = jsPlumb.newInstance({
        // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
        // than the curves on the first demo, which use the default curviness value.
        connector: { type:"Bezier", options:{ curviness: 50 } },
        dragOptions: { cursor: "pointer", zIndex: 2000 },
        paintStyle: { stroke: c_unique, strokeWidth: 2 },
        endpointStyle: { radius: 9, fill: c_unique },
        hoverPaintStyle: {stroke: "#ec9f2e" },
        endpointHoverStyle: {fill: "#ec9f2e" },
        container: canvas
    });
  
    addEventListener("resize", (event) => { instance.repaint(document.getElementById("jsplumb")); });
    addEventListener("scroll", (event) => { instance.repaint(document.getElementById("jsplumb")); });
    // $('.data-box').on( "click", function() {
    //     setTimeout( function() { instance.repaint(document.getElementById("jsplumb"));}, 10);
    // });
    
    // suspend drawing and initialise.
    instance.batch(function () {
        //overlay
        var arrow = [
            { type:"Arrow", options:{ location: 1, foldback:0.7, fill:c_unique, width:14 }},
            // { type:"Arrow", options:{ location: 0.3, direction: -1, foldback:0.7, fill:c_unique, width:14 }}
        ];
  

        //paintStyle
        var ps_normal = { strokeWidth: 2, stroke: c_normal };
        var ps_active = { strokeWidth: 2, stroke: c_active };
        var ps_disable = { strokeWidth: 2, stroke: c_disable };
        var ps_unique = { strokeWidth: 2, stroke: c_unique};
        var ps_merge = { strokeWidth: 2,  stroke: c_normal, dashstyle: dash };
        var ps_mergeUnique = { strokeWidth: 2, stroke: c_unique, dashstyle: dash };
        var ps_merge_disable = { strokeWidth: 2,  stroke: c_disable, dashstyle: dash };
        var ps_mergeUnique_disable = ps_merge_disable

        //connector type
        var normal = {paintStyle:ps_normal, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var active = {paintStyle:ps_active, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var disable = {paintStyle:ps_disable, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var unique = {paintStyle:ps_unique, overlays: arrow, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var merge = {paintStyle:ps_merge, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var mergeUnique = {paintStyle:ps_mergeUnique, overlays: arrow, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var merge_disable = {paintStyle:ps_merge_disable, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        var mergeUnique_disable = {paintStyle:ps_mergeUnique_disable, overlays: arrow, anchors:anchors_side, detachable: false, reattach: false,  endpoint: "Blank"};
        
        
        // add endpoints, giving them a UUID.
        // you DO NOT NEED to use this method. You can use your library's selector method.
        // the jsPlumb demos use it so that the code can be shared between all three libraries.
        var windows = document.querySelectorAll(".chart-demo .window");
        for (var i = 0; i < windows.length; i++) {
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-bottom",
                anchor: "Bottom",
                maxConnections: -1
            });
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-top",
                anchor: "Top",
                maxConnections: -1
            });
        }

        instance.creatNormal = function (source, target) {  instance.connect(Object.assign({source, target}, normal)); }
        instance.creatActive = function (source, target) {  instance.connect(Object.assign({source, target}, active)); }
        instance.creatDisable = function (source, target) {  instance.connect(Object.assign({source, target}, disable)); }
        instance.creatUnique = function (source, target) {  instance.connect(Object.assign({source, target}, unique)); }
        instance.creatMerge = function (source, target) {  instance.connect(Object.assign({source, target}, merge)); }
        instance.creatMergeUnique = function (source, target) {  instance.connect(Object.assign({source, target}, mergeUnique)); }
        instance.creatMerge_disable = function (source, target) {  instance.connect(Object.assign({source, target}, merge_disable)); }
        instance.creatMergeUnique_disable = function (source, target) {  instance.connect(Object.assign({source, target}, mergeUnique_disable)); }


        getObj = function (id) { return document.getElementById(id) }

        instance.creatNormal(getObj('container0'), getObj('container3'))
        instance.creatNormal(getObj('container0'), getObj('container2'))
        instance.creatNormal(getObj('container1'), getObj('container2'))
        instance.creatNormal(getObj('container1'), getObj('container3'))
        instance.creatNormal(getObj('container0'), getObj('container3'))
        
        //2
        instance.creatMerge(getObj('container3'), getObj('container5'))
        instance.creatNormal(getObj('container3'), getObj('container6'))

        instance.creatMerge(getObj('container2'), getObj('container5'))
        instance.creatNormal(getObj('container2'), getObj('container4'))

        //3
        instance.creatMerge(getObj('container5'), getObj('container10'))

        instance.creatNormal(getObj('container4'), getObj('container7'))

        instance.creatNormal(getObj('container6'), getObj('container8'))

        //4
        instance.creatMergeUnique(getObj('container7'), getObj('container10'))
        instance.creatMergeUnique(getObj('container8'), getObj('container10'))

        instance.creatUnique(getObj('container7'), getObj('container9'))
        instance.creatUnique(getObj('container8'), getObj('container11'))

        
  
    });

    document.instance = instance
  });