/*global define, hash*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'require', 'libs/jquery/jquery.dataTables', 'libs/hash/hash', 'elements/jquery.dropdown'], factory);
    } else if (window.jQuery && $.fn.dataTable) {
        factory(window.jQuery);
    }

})(function($, require) {
        
    // Insert a 'details' column to the table
    $('.tsTable-detailedTable').each(function() {
        var nCloneTd = document.createElement('td');
        var buttonShow = $(this).attr('data-buttonShow');
        nCloneTd.innerHTML = '<input type="submit" value="' + buttonShow + '" class="tsBtn--Internal toggleHiddenRows">';
        nCloneTd.className = "center";
        
        if ($(this).data("detailed-button") !== false) {
            $('.tsTable thead tr').append($("<th />", { "data-button": buttonShow }));
            $('.tsTable tbody tr').append($("<td />", { "class": "center" }));
        }
    });

    $('.tsTable-withButton').each(function() {
        var buttonName = $(this).attr('data-button-name');
    
        if ($(this).data("detailed-button") !== false) {
            $('.tsTable thead tr').append($("<th />", { "data-link": buttonName }));
            $('.tsTable tbody tr').append($("<td />", { "class": "center" }));
        }
    });

    // Formating function for row details
    function fnFormatDetails (oTable, nTr) {
        var sOut = '';

        if ($(nTr).data('table')) {

            var table = $.map($(nTr).data('table').split(','), function(item) { return parseInt(item, 10); });
            sOut += '<div class="container" style="dislay: none;">';
            sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
            for (var row = 0; row < table[0]; row++) {
                sOut += '<tr class="tsTable-detailedTable-row">';
                for (var col = 0; col < table[1]; col++) {
                    sOut += '<td>'+ ($(nTr).data('r' + row + '-c' + col) || '') +'</td>';
                }
                sOut += '</tr>';
            }
            sOut += '</table>';
            sOut += '</div>';

        } else if ($(nTr).data('form')) {
            
            var form = parseInt($(nTr).data('form'), 10);

            var label = $(nTr).data('label') || 'Submit';
            var text = $(nTr).data('text') || 'Do you want to submit?';
            var action = $(nTr).data('action') || '';

            sOut += '<div class="container" style="display: none;">';
            sOut += '<form method="post" action="' + action + '">';
            for (var i = 0; i < form; i++) {
                sOut += '<input type="hidden" name="' + $(nTr).data('name' + i) + '" value="' + $(nTr).data('value' + i) + '" />';
            }
            sOut += '<span style="margin-right:50px">' + text + '</span>' + '<button class="tsBtn" type="submit">' + label + '</button>';
            sOut += '</form>';
            sOut += '</div>';

        }

        /*var fields = parseInt($(nTr).data('fields') || 1, 10);
        for (var i = 0; i < 0; i++) {
            var date = "date" + i;
            var desc = "desc" + i;
            var button = "button" + i;
            dateList.push($(nTr).data(date) || '');
            descList.push($(nTr).data(desc) || '');
            buttonList.push('<form method="post"><div style="display: none;"><input type=”hidden” name=”Language” value=”Spanish”><input type=”hidden” name=”admin” value=”2”></div><button type="submit" class="tsBtn">' + $(nTr).data(button) + '</button></form>');
        }

        var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
        $.each(dateList, function(index) {
            sOut += '<tr class="tsTable-detailedTable-row"><td>'+ (dateList[index] || '') +'</td><td>'+ (descList[index] || '') +'</td><td>' + (buttonList[index] || '') + '</td></tr>';
        });
         
        sOut += '</table>';*/

        return sOut;
    }

    function fnShowSearch() {
        var tableSearch = $(".tsTable-datatable-search");
        $(".tsTable-datatable-search").css("display", "none");
        $('.tsTable-datatable-filterTabs li', '.tsTable-multi').each(function(i) {
            if ($(this).hasClass("active") === true) {
                $(tableSearch[i]).css("display", "block");
            }
        });
    }

	if ($.fn.dataTableExt) {
		$.fn.dataTableExt.oStdClasses.sWrapper = "tsTable-datatable-wrapper";
		$.fn.dataTableExt.oStdClasses.sFilter = "tsTable-datatable-search";
		$.fn.dataTableExt.oStdClasses.sProcessing = "tsTable-datatable-processing";
				
		$.fn.dataTableExt.oPagination.tsPagination = {
			fnInit: function(oSettings, nPaging, fnCallbackDraw) {
				
				var clickHandler = function(e) {
					e.preventDefault();
					oSettings.oApi._fnPageChange(oSettings, $(this).data('toggle'));
					fnCallbackDraw(oSettings);
				};
														
				$(nPaging).addClass('tsPaging').append(
						$("<a />", { href:"", "class": "tsPaging-arrow-prev" }).data('toggle', 'previous').append($("<i />").addClass('tsPaging-icon tsIcon-Previous')).click(clickHandler),
						$("<ul />").addClass('tsPaging-list'),
						$("<a />", { href:"", "class": "tsPaging-arrow-next" }).data('toggle', 'next').append($("<i />").addClass('tsPaging-icon tsIcon-Next')).click(clickHandler)
				);
								
			},
			fnUpdate: function(oSettings, fnCallbackDraw) {
				
				if (!oSettings.aanFeatures.p) { return; }
				
				var start = oSettings._iDisplayStart,
					length = oSettings._iDisplayLength,
					total = oSettings.fnRecordsDisplay();
				var pages = Math.ceil(total / length),
					current = start / length + 1;
										
				var clickHandler = function(e) {
					e.preventDefault();
					oSettings.oApi._fnPageChange(oSettings, $(this).data('toggle'));
					fnCallbackDraw(oSettings);
				};
				
				$.each(oSettings.aanFeatures.p, function(i) {
					var p = $(oSettings.aanFeatures.p[i]);
					p.toggle(pages > 1);
					
					$('a.previous', p).toggleClass('disabled', current === 1);
					$('a.next', p).toggleClass('disabled', current === pages);
		
					// the number of pages next to the current that should be displayed						
					var l = 4;
					// construct an array with all page links. -1 means an ellipsis
					// this can probably be optimized a little bit						
					
					// create a list of all pages
					var _p = $.map(new Array(pages), function(item, index) { return index + 1; });
					
					// exclude the onces that are far from the current one
					_p = $.grep(_p, function(item) { return item === 1 || item === pages || Math.abs(Math.max(l, Math.min(pages - l + 1,current)) - item) <= l; });
					
					// determine which should be the separator
					_p = $.map(_p, function(item) { return item > 2 && item < pages - 1 && Math.abs(Math.max(l, Math.min(pages - l + 1,current)) - item) === l ? -1 : item; });
						
					$('ul', p).html(
						$.map(_p, function(item) {
							if (item === -1) {
								return $("<li />", { "class": 'tsPaging-list-item tsPaging-list-item-separator' }).append($('<span />').addClass('ellipsis').text('...'));
							}
							return $("<li />", { "class": 'tsPaging-list-item' }).toggleClass('selected', item === current).append($('<a />', { href: "" }).data('toggle', item - 1).text(item).click(clickHandler));
						})
					);
		
				});
			}
		};
	}
	
	$.fn.tsDataTableFilters = function(options) {
		options = $.extend({ table: null }, options);
		return this.each(function() {
			var c = null;
			$("a", this).click(function(e) {
				e.preventDefault();
				options.table.fnFilter('', c);
				$(this).parent('li').addClass('active').siblings('li').removeClass('active');
				var filter = typeof $(this).attr('data-filter') !== "undefined" ? $(this).attr('data-filter') : null;
				if (!filter) { return; }
				var column = typeof $(this).attr('data-column') !== "undefined" ? parseInt($(this).attr('data-column'), 10) : null;
				var regex = typeof $(this).attr('data-regex') !== "undefined" && $(this).attr('data-regex') === "true";
				options.table.fnFilter(filter, column, regex, false);
				c = column;
			});
		});
	};

	$(function() {
		
	
		if ($.fn.dataTable) {

			var init = function(data) {

                var defaultSort = "0_asc";
                var defaultPage = 0;

				var labels = $.map($("thead th", this), function(item) { return $(item).text(); });
                labels = $('.tsTable-dataHeaders').data('headers') || labels;
                var search = typeof $(this).attr('data-search') === "undefined" || $(this).attr('data-search') === "true";
				var filter = typeof $(this).attr('data-filter') !== "undefined";
                var searchText = search && typeof $(this).attr('data-search-text') !== "undefined" ? $(this).attr('data-search-text') : null;
				var options = {
					bFilter: search,
					bPaginate: true,
					bLengthChange: false,
					bInfo: false,
					sPaginationType: 'tsPagination',
					iDisplayLength: 10,
                    bProcessing: true,
                    aoColumnDefs: $.map($("thead th", this), function(item) {
                        //if ($('.tsTable-detailedTable').length > 0) {
                            var field = typeof $(item).attr('data-field') !== "undefined" ? $(item).attr('data-field') : null;
                            var ret = { mData: field, aTargets: [$(item).index()] };
                            if ($(item).data("button")) {
                                ret.sDefaultContent = "<input type=\"submit\" value=\"" + $(item).data('button') + "\" class=\"tsBtn--Internal toggleHiddenRows\" />";
                            }

                            return ret.mData || ret.sDefaultContent ? ret : null;
                        //}
                    }),
					oLanguage: {
						sSearch: "_INPUT_<i class=\"tsIcon-Search\"></i>",
                        sProcessing: ""
					},
                    sAjaxDataProp: typeof $(this).attr('data-source') !== "undefined" ? $(this).attr('data-source') : "aaData",
                    fnCreatedRow: function(tr, data) {

                        if (labels) {
                            $.each($("td", tr), function(i, item) {
                                $(item).attr('data-label', labels[i]);
                            });
                        }

                        //console.log('created row');
                        $(tr).attr('data-url', $(tr).attr('data-url') || data._url || null);

                        if (data.details) {

                            if (data.details.table && data.details.table.length > 0 && data.details.table[0].length > 0) {
                                $(tr).data('table', data.details.table.length + ',' + data.details.table[0].length);
                                for (var row = 0; row < data.details.table.length; row++) {
                                    for (var col = 0; col < data.details.table[row].length; col++) {
                                        $(tr).data('r' + row + '-c' + col, data.details.table[row][col]);
                                    }
                                }
                            } else if (data.details.form) {
                                $(tr).data('form', data.details.form.fields.length || 0);
                                $(tr).data('text', data.details.form.text);
                                $(tr).data('action', data.details.form.action);
                                $(tr).data('label', data.details.form.label);
                                for (var i = 0; i < data.details.form.fields.length; i++) {
                                    $(tr).data('name' + i, data.details.form.fields[i].name);
                                    $(tr).data('value' + i, data.details.form.fields[i].value);
                                }
                            }
                        }
                    },
					sDom: filter || search ? '<"tsTable-datatable-top tsTable-menu"<"tsTable-menu-inner"f<"tsTable-changeTable">>><"tsTable-datatable-hide"li><"tsTable-wrapper"rt><"tsTable-datatable-bottom"p>' : '<"tsTable-datatable-hide"lif><"tsTable-wrapper"rt><"tsTable-datatable-bottom"p>'
				};

                if (data) {
                    options.aaData = data;
                } else {
                    options.aoColumnDefs = $.map($("thead th", this), function(item) {
                        var field = typeof $(item).attr('data-field') !== "undefined" ? $(item).attr('data-field') : null;
                        var ret = { mData: field, aTargets: [$(item).index()] };
                        if ($(item).data("button")) {
                            ret.sDefaultContent = "<input type=\"submit\" value=\"" + $(item).data('button') + "\" class=\"tsBtn--Internal toggleHiddenRows\" />";
                        }
                        else if ($(item).data("link")) {
                            ret.sDefaultContent = '<a class="tsBtn" href="/">' + $(item).data('link') + '</a>';
                        }

                        return ret.mData || ret.sDefaultContent ? ret : null;
                    });
                }

                if ($(this).data('hash')) {
                    // set the initial sort
                    var sort = hash.get('sort');
                    if (sort) {
                        options.aaSorting = [ sort.split("_") ];
                    }

                    var page = hash.get('page');
                    if (page) {
                        options.iDisplayStart = options.iDisplayLength * parseInt(page, 10);
                    }
                }

                if (typeof $(this).attr('data-url') !== "undefined") {
					options.bProcessing = true;
					options.sAjaxSource = $(this).attr('data-url');
					//var defs = [];
					//options.aoColumnDefs = defs;
					// options.fnCreatedRow = function(nRow, aData) {
					//	$(nRow).attr('data-url', aData._url || null).children('td').each(function(i) {
					//		$(this).attr('data-label', labels[i]);
					//	});
					// };
				}

                if ($(this).data('pagination') === false){
                    options.bPaginate = false;
                }

                var t = $(this).bind('sort', function(e, oSettings) {
					// remove sorting
					$('thead th i', oSettings.nTable).remove();
					// add the new sorting
					$('thead th', oSettings.nTable).eq(oSettings.aaSorting[0][0]).append($("<i />").addClass('tsIcon-Arrow' + (oSettings.aaSorting[0][1] === "asc" ? 'Up' : 'Down')));
				}).dataTable(options);

                if ($(this).data('hash')) {

                    t.bind('sort', function(e, oSettings) {

                        var sort = oSettings.aaSorting[0].slice(0, 2).join("_");

                        if (sort !== defaultSort) {
                            hash.add({ sort: sort });
                        } else {
                            hash.remove("sort");
                        }

                    });

                    t.bind('page', function(e, oSettings) {
                        var page = oSettings._iDisplayStart / oSettings._iDisplayLength;
                        if (page !== defaultPage) {
                            hash.add({ page: page });
                        } else {
                            hash.remove('page');
                        }
                    });
                }

				if (filter) {
					var f = $($(this).attr('data-filter')).tsDataTableFilters({table: t});
					$(".tsTable-menu-inner", t.fnSettings().nTableWrapper).append(f);
				}
                if (searchText) {
                    $('.tsTable-datatable-search input', t.fnSettings().nTableWrapper).attr('placeholder', searchText);
                }
				if (filter || search) {
					$(".tsTable-datatable-top", t.fnSettings().nTableWrapper).before(
						$("<div />", { 'class': 'tsCollapse-button-wrapper' }).append(
							$("<button />", { 'class': 'tsCollapse-trigger tsTable-toggle-button', 'data-toggle': 'collapse', 'data-target': '.tsTable-menu', 'data-collapse-id': 'tablemenu' }).append(
								$("<i />", { 'class': 'tsIcon-Menu' })
							)
						)
					);
                    $(document).trigger('init-collapse');
				}


                $('.tsTable-withDropdown').each(function() {
                    // Adds a dropdown and initiates it
                    if ($(this).hasClass("tsTable-multi") === false) {
                        var dropdownOptions = $('.tsTable-withDropdown').data('options');
                        // Lyft ut choose company ffs
                        var dropdown = $('<select class="tseSelectDropdown" data-placeholder="Choose company"></select>');

                        $.each(dropdownOptions, function(index) {
                            var o = new Option(dropdownOptions[index]);
                            dropdown.append(o);
                        });

                        if ($(this).hasClass("tsTable-select") === false) {
                            $(".tsTable-changeTable").append(dropdown);
                        }

                        dropdown.initDropdown({wrapper: "tseDropdown--small"});
                    }
                    $(this).addClass("tsTable-multi");

                    // Reload table from a JSON source
                    $(".tsTable-withDropdown .tseDropdown-listItem").click(function() {
                        var selectedItem = $(this).html();
                        var jsonFile = selectedItem + ".json";
                        setTimeout(function() {
                            t.fnReloadAjax('data/' + jsonFile, function() {
                            } );
                        }, 0);
                    });
                });
                
				t.on('click', "tbody tr[data-url]", function() {
                    window.location.href = $(this).data('url');
				});

                // Toggle hidden row when pressing on row
                /*t.on('click', "tbody tr[data-json-file]", function() {
                    var jsonFile = $(this).data('json-file');
                    var nDetailsRow = "";
                    var nTr = this;
                    if (t.fnIsOpen(nTr)) {
                        $('> td > *', $(nTr).next('tr')).slideUp(function() {
                            t.fnClose(nTr);
                        });
                    }
                    else {
                        $.getJSON(jsonFile, function(result) {
                            nDetailsRow = t.fnOpen(nTr, fnFormatDetails(t, nTr, result), 'tsTable-hiddenContainer');
                            $('> td > *', nDetailsRow).slideDown();
                            $(t).resize();
                        });
                    }

                });*/

                t.on('click', "tbody tr[data-toggle=event]", function() {
                    var nTr = this;

                    function closeRow() {
                        $('> td > *', $(nTr).next('tr')).slideUp(function() {
                            t.fnClose(nTr);
                        });
                    }
                    if (t.fnIsOpen(nTr)) {
                        closeRow();
                    }
                    else {
                        var e = $(this).data('event-name');
                        var arg = $(this).data('event-argument');
                        var container = $(this).data('event-container');
                        var close = $(this).data('event-close');
                        var nDetailsRow = t.fnOpen(nTr, "<div class='" + container + "' style='display: none;'><div class='tscAreaLoading'><div class='tsLoading-icon-large'></div></div></div>", 'tsTable-hiddenContainer');
                        $('> td > *', nDetailsRow).slideDown().trigger(e, [arg]);
                        $(t).resize();

                        if (close) {
                            $(nTr).next('tr').on('click', close, function() {
                                closeRow();
                            });
                        }

                    }



                });

                // Toggles hidden row when pressing on button
                if (t.hasClass("tsTable-hiddenRows")) {
                    t.on('click', "tbody tr td input.toggleHiddenRows", function (e) {
                        var nDetailsRow = "";
                        e.stopPropagation();
                        var nTr = $(this).parents('tr')[0];
                        if (t.fnIsOpen(nTr)) {
                            var buttonShow = $('.tsTable-detailedTable').attr('data-buttonShow');
                            this.value = buttonShow;
                            t.fnClose(nTr);
                        }
                        else {
                            var buttonHide = $('.tsTable-detailedTable').attr('data-buttonHide');
                            this.value = buttonHide;
                            nDetailsRow = t.fnOpen(nTr, fnFormatDetails(t, nTr), 'details');
                            $('.details .container', nDetailsRow).show();
                        }
                    });
                }

			};

            $('.tsTable-datatable').each(function() {

                init.apply(this);

            });


            $(".tsTable-placeHolder").each(function() {

                if ($(this).data('init')) {

                    var loader = $("<div />").css('text-align', 'center').append($("<div />", { "class": "tsLoading-icon-large" }));
                    $(this).before(loader);
                    var $table = $("<table />", { "class": "tsTable tsTable-datatable tsTable-horizontal", "data-hash": $(this).data('hash'), "data-search-text": $(this).data('search-text') });
                    $(this).after($table).remove();
                    var $this = $(this);
                    require([$this.data('init')], function(obj) {
                        $table.append($("<thead />").append($("<tr />").append($.map(obj.getHeaders(), function(item) { return $("<th />").text(item); })), $("<tbody />")));
                        init.call($table.get(0), obj.getData());
                        loader.remove();
                    });
                }

            });

		}


		$('.tsTable-select').each(function() {
            var tsTableSelect = this;
			var $this = $(this);
            var dropdown;

            // Create a dropdown and fill it with options from the data-options attribute
            if ($('.tsTable-withDropdown').length > 0) {
                var dropdownOptions = $('.tsTable-withDropdown').data('options');
                var dropdownPlaceholder = $('.tsTable-withDropdown').data('dropdown-placeholder') || "Choose company";
                dropdown = $('<select class="tseSelectDropdown" data-placeholder="' + dropdownPlaceholder + '"></select>');

                $.each(dropdownOptions, function(index) {
                    var o = new Option(dropdownOptions[index]);
                    dropdown.append(o);
                });
            }

			var selector = "> table, > .tsTable-datatable-wrapper";
			$(this).prepend(
				$("<button />", { 'data-toggle': 'collapse', 'data-target': '.tsTable-menu-select', 'data-collapse-id': 'tableselect' }).addClass('tsCollapse-trigger tsTable-toggle-button').append(
					$("<i />").addClass('tsIcon-Menu')
				)
			);

			$(selector, this).first().before(
				$("<div />", { 'class': 'tsTable-menu tsTable-menu-select' }).append(
					$("<div />", { 'class': 'tsTable-menu-inner' }).append(
                        $(('.tsTable-withDropdown').length > 0) ? dropdown : '', $("<ul class='tsTable-datatable-filterTabs' />").append(
							$.map($(selector, this), function(item, index) {
                                if ($(item).find(".tsTable").data("dropdown-filter") !== true) {
                                    return $("<li />").toggleClass('active', index === 0).append(
                                        $("<a />", { href: "" , "data-table" : index }).text($(item).find('caption').text()).click(function(e) {
                                            e.preventDefault();
                                            $(selector, $this).hide().eq($(this).data('table')).show();
                                            $(this).parent('li').addClass('active').siblings('li').removeClass('active');
                                        })
                                    );
                                }
							})
						)
					)
				)
			);

            if ($this.data("select-dropdown") === true) {
                var _this = this;
                var filterTabs = $(".tsTable-datatable-filterTabs", tsTableSelect);
                $(".tsTable-menu-select", tsTableSelect).addClass("tsTable-menu-selectDropdown");

                var dropdownFilter = $("<select />", { 'class': 'tseSelectDropdown--small', 'data-placeholder': $this.data("select-placeholder"), 'data-dropdown-filter': 'true' }).append(
                        $.map($(selector, this), function(item, index) {
                            if ($(item).find(".tsTable").data("dropdown-filter") === true) {
                                return $("<option />", { 'value': index }).text($(item).find('caption').text());
                            }
                        })
                    ).on('change', function() {
                        var value = $(this).val();
                        $.map($(selector, _this), function() {
                            $(selector, _this).hide().eq(value).show();
                            $(this).parent('li').addClass('active').siblings('li').removeClass('active');
                        });
                    });

                dropdownFilter.insertBefore(filterTabs);

                var buttons = $('tbody tr a.tsBtn');
                $.each(buttons, function() {
                    var parentRow = $(this).closest('tr');
                    $(this).attr("href", parentRow.data('button-link'));
                });

            }

            $(document).trigger('init-collapse');

            // Initiate dropdown, move search in the DOM and remove empty elements with styling that .tsTable-multi doesn't use
            if ($('.tsTable-withDropdown').length > 0) {
                dropdown.initDropdown({wrapper: "tseDropdown--small"});
                $(".tsTable-datatable-search").prependTo(".tsTable-menu-select .tsTable-menu-inner");

                $('.tsTable-datatable-top', '.tsTable-multi').remove();
                $('.tsCollapse-button-wrapper', '.tsTable-multi').remove();

                fnShowSearch();

                $('.tsTable-datatable-filterTabs li', '.tsTable-multi').click(function() {
                    fnShowSearch();
                });
            }

            // Reload table from a JSON source
            $(".tsTable-withDropdown .tseDropdown-listItem").click(function() {
                var selectedItem = $(this).html();
                var jsonFile = selectedItem + ".json";

                $('.tsTable-datatable', '.tsTable-multi').each(function() {
                    var t = $(this).dataTable();
                    setTimeout(function() {
                        t.fnReloadAjax('data/' + jsonFile, function() {
                            //console.log('done');
                        } );
                    }, 0);
                });

            });

			$(selector, this).hide().eq(0).show();
		});
		
	});
	
});

