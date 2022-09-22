/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'require', 'modernizr', 'modules/jquery.columnList', 'modules/jquery.positionList'], factory);
    } else if (window.jQuery && window.Modernizr) {
        factory(window.jQuery, null, window.Modernizr);
    }

})(function($, require, Modernizr) {
    
    $.fn.ts360view = function(options, callback) {

        var defaults = {
            data: [ { value: 100, link: "#mobile" } ],
            innerRadius: 125,
            outerRadius: 200,
            hover: null,
            startAngle: - Math.PI / 2,
            clockwise: false,
            padding: 10
        };

        options = $.extend({}, defaults, options);

        /**
         * Calculates the path regions from the data array
         * 
         * @param  {object} options [description]
         * @return {array}          [description]
         */
        var calculatePaths = function(options) {
  
            var cx = options.padding + options.outerRadius;
            var cy = cx;
            var r1 = options.innerRadius;
            var r2 = options.outerRadius;
            var startAngle = -Math.PI/2;

            var paths = options.data.map(function(data) {

                if (data.value === options.total) {
                    return [ "M", cx, cy - r2, "A", r2, r2, 0, 0, 0, cx, cy + r2, "A", r2, r2, 0, 0, 0, cx, cy - r2, "L", cx, cy - r1, "A", r1, r1, 0, 0, 1, cx, cy + r1, "A", r1, r1, 0, 0, 1, cx, cy - r1 ];
                }

                var endAngle = startAngle - 2*Math.PI*data.value/options.total;

                var x1 = cx + r1 * Math.cos(startAngle);
                var y1 = cy + r1 * Math.sin(startAngle);
                var x2 = cx + r2 * Math.cos(startAngle);
                var y2 = cy + r2 * Math.sin(startAngle);
                var x3 = cx + r2 * Math.cos(endAngle);
                var y3 = cy + r2 * Math.sin(endAngle);
                var x4 = cx + r1 * Math.cos(endAngle);
                var y4 = cy + r1 * Math.sin(endAngle);

                var path = [];
                path.push("M", x1, y1);
                path.push("L", x2, y2);
                path.push("A", r2, r2, 0, Math.abs(endAngle-startAngle) > Math.PI ? 1 : 0, 0, x3, y3);
                path.push("L", x4, y4);
                path.push("A", r1, r1, 0, Math.abs(endAngle-startAngle) > Math.PI ? 1 : 0, 1, x1, y1);

                startAngle = endAngle;

                return path;
            });

            return paths;

        };

        return this.each(function() {

            var size = (options.outerRadius + options.padding) * 2;
            var paths = calculatePaths(options);

            var wrapper = $("<div />", { "class": "ts360view-pie-wrapper" }).prepend(
                $("<div />", { "class": "ts360view-pie-background" }).append(
                    $("<div />", { "class": "ts360view-pie-info" }).append(
                        $("<div />", { "class": "ts360view-pie-info-inner" }).append(
                            $("<i />", { "class": "tsIcon-Environment" }),
                            $("<span />").append(
                                $("<strong />").text(options.total),
                                " abonnemang"
                            )
                        )
                    )
                )
            );

            $(this).prepend(wrapper);
            
            if (Modernizr.svg) {
                
                var xmlns = "http://www.w3.org/2000/svg";
                var svg = document.createElementNS(xmlns, "svg");
                svg.setAttribute('width', size);
                svg.setAttribute('height', size);
                svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

                paths.forEach(function(path, index) {

                    var data = options.data[index];
                    var e;
                    if (data.disabled) {
                        e = document.createElementNS(xmlns, "g");
                    } else {
                        e = document.createElementNS(xmlns, "a");
                        e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", data.link);
                        $(e).on('mouseover mouseout', function(e) { $("a", data.item).toggleClass('active', e.type === 'mouseover'); });
                    }
                    e.setAttribute('class', data.className);
                    svg.appendChild(e);

                    var pe = document.createElementNS(xmlns, "path");
                    pe.setAttribute("d", path.join(' ').replace(/([a-z])\s/ig, "$1").replace(/\s(?=[a-z])/ig, "").replace(/\s/g, ","));
                    
                    e.appendChild(pe);

                });

                wrapper.append(svg);

                if (typeof callback === "function") {
                    callback();
                }

            } else {

                // add support for amd, otherwise assume that raphael is loaded and the styleSheets.prototype.getList is defined 

                (function(run) {
                    if (typeof define === "function" && define.amd) {
                        require(['libs/misc/raphael-min', 'common/utils'], run);
                    } else {
                        run(window.Raphael, window.Utils);
                    }
                })(function(Raphael, utils) {

                    var list = utils.getStyleSheetsList(/\.(color-(?:disabled|\d+))\spath/, /fill:\s*(#[a-f0-9]+)/, "color");

                    Raphael.fn.pieChart = function(paths, options) {

                        var chart = this;

                        console.log(list);
                        paths.map(function(path, i) {
                        
                            var data = options.data[i];
                            var color = $.grep(list, function(item) { return item.index === data.className; });

                            var e = chart.path(path).attr('fill', color.length ? color[0].value : '#000').attr('stroke-width', 0);
                            if (data.disabled) {
                                e.node.setAttribute('class', (e.node.getAttribute('class') ? e.node.getAttribute('class') + " " : "") + "is-disabled");
                            } else {
                                e.data('data', data).click(function() { window.location = this.data("data").link; }).mouseover(function() { $("a", data.item).addClass('active'); }).mouseout(function() { $("a", data.item).removeClass('active'); });
                            }

                        });

                    };
                    
                    var pie = new Raphael(wrapper.get(0), size, size);
                    pie.pieChart(paths, options);
                    wrapper.prepend($(".ts360view-pie-background", wrapper));

                    if (typeof callback === "function") {
                        callback();
                    }

                });

            }

            var resize = function() {
                var w = wrapper.width();
                var ow = wrapper.outerWidth();
                if (w < size) {
                    var scale = w / size;
                    var offset = (1 - scale) * options.outerRadius;
                    $("svg", wrapper).css({ transform: 'scale(' + scale + ')', 'margin-top': -offset, 'margin-left': -offset });
                    $(".ts360view-pie-wrapper").css('height', ow);
                    $(".ts360view-pie-background", wrapper).css({ 'border-radius': ow/2 });
                } else {
                    $("svg", wrapper).css({ transform: '', 'margin-top': '', 'margin-left': '' });
                    $(".ts360view-pie-background", wrapper).css({ 'border-radius': '' });
                }
            };
            $(window).resize(resize);
            resize();

        });

    };

    $(function() {

        $(".ts360view").each(function() {

            var ts360view = $(this);

            ts360view.addClass("ts360view-initialized");
                  
            var getOptions = function(org) {
                var total = 0;
                var data = $.map($("li.ts360view-category-item", ts360view), function(item, index) {
                    var attr = 'data' + ('-' + (org || "") + '-').replace(/\-\-/, '-') + 'value';
                    var value = parseInt($(item).attr(attr), 10);
                    // set the main amount 
                    $(".amount", item).text(value);
                    // set the subscription amount 
                    $("ul li span", item).text(value);
                    total += value;
                    var ret = { value: value, link: $("a", item).attr('href'), disabled: $(item).hasClass('is-disabled'), className: "color-" + (index + 1), item: item };
                    if (ret.disabled) {
                        ret.className = 'color-disabled';
                    }
                    return ret;
                });
                var options = {
                    innerRadius: 125,
                    outerRadius: 200,
                    data: data,
                    total: total,
                    padding: 0,
                    cssColorMatch: /\.color(\d+)\spath/
                };
                return options;
            };

            $('#pie', ts360view).ts360view(getOptions(), function() {
                $(".ts360view-category-list--vertical", ts360view).tsColumnList({ columns: 2, center: true });
                $(".ts360view-category-list", ts360view).positionList({ item: '.ts360view-category-item', target: '.h4', bottom: true, css: 'margin-top', columnMatch: { className: 'column-{0}', columns: 2 } });
                $(".ts360view-category-list", ts360view).positionList({ item: '.ts360view-category-item', target: '.ts360view-tag-item:last', css: 'margin-bottom', columnMatch: { className: 'column-{0}', columns: 2 } });
                $(".ts360view-category-list--vertical", ts360view).tsColumnList('refresh');
                ts360view.trigger('resized');
            });

            $("select", this).change(function(e) {
                var org = $(this).val();
                var options = getOptions(org);
                console.log(options);
                $("#pie", ts360view).children(':not(ul)').remove();
                $("#pie", ts360view).ts360view(options);
            });

        });

    });

});
