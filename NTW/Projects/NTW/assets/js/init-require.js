/*global require,define*/

define('modernizr', [], function() {
    window.Modernizr.addTest('placeholder', function() {
        return window.Modernizr.input.placeholder;
    });
    return window.Modernizr;
});
require(['jquery', 'require', 'angular', 'helpers/common', 'modules/collapser', 'modernizr', 'constants', 'jquery-ui', 'common/extensions', 'modules/jquery.toggleClass', 'modules/header'], function($, require, ng, common, Collapser, Modernizr, constants) {

	// init stuff here
	$(function() {
		// react to timeout for the session
	//	(function() {
	//		var timeout = $('html').data('timeout') || 1800000;
	//		if (!$('body').hasClass('no-redirect') && !common.isTeliaAdmin && timeout) {
	//			var timeoutId;
	//			var startTimeout = function(t) {
	//				console.log("start timeout with", t, "milliseconds");
	//				if (timeoutId) {
	//					clearTimeout(timeoutId);
	//				}
	//				timeoutId = setTimeout(function() {
	//					$.getJSON(constants.lastAccessTimeUrl, function(data) {
	//						var time = data.time || 0;
	//						// check if the last access time is greater than the timeout limit
	//						if (time >= timeout) {
	//							// remove possible listeners for beforeunload
	//							$(window).off('beforeunload');
	//							// do a redirect to the logout/login page
	//							window.location.href = constants.automaticLogoutLink;
	//						} else {
	//							// set a new timeout 
	//							startTimeout(timeout - time);
	//						}
	//					});
	//				}, t);
	//			};
	//			startTimeout(timeout);
	//		}
	//	})();

		var header = $('.header');
		var elements = $('.header').prevAll(":not([class^=mgnl])");
		var main = $('.flexcontainer, .main').first();

		var getHeaderTop = function() {
			// For sticky header
			// var total = 0;

			// For sticky subnav
			var total = 125;

			$.each(elements.get(), function(index, item) { total = total + item.offsetHeight; });
			return total;
		};

		// init the root angular app
		// you can use nested apps if you warp them with the following
		// <div ng-non-bindable data-$injector>
		//     <div data-angular="your-app-name"></div>
		// </div>
		// Add dependencies when required
        require(['local/angularApplications/customTable', 'local/angularApplications/commonDirectives', 'local/angularApplications/modules'], function() {
            var app = ng.module('main', ['customTable', 'commonDirectives', 'modules']);
			ng.bootstrap(document, ['main']);

            // remove this? // christian nagorka
            $("[angular]").each(function() {
                var _this = this;
                var module = 'local/angularApplications/' + $(this).attr('angular');
                // check if the module is already loaded. In that case, assume that it is available
                if (!require.defined(module)) {
                    require([module], function(app) {
                        app.init(_this);
                    });
                }
            });

            $("[data-angular]").each(function() {
                var _this = this;
                var module = 'local/angularApplications/' + $(this).data('angular');
                // check if the module is already loaded. In that case, assume that it is available
                if (!require.defined(module)) {
                    require([module], function(app) {
                        app.init(_this);
                    });
                }
            });

        });


        if(!Modernizr.input.placeholder)
        {
            if($('[data-visual=placeholder]').length > 0)
            {
                $('[data-visual=placeholder]').each(function(){
                    var div = '<div class="textinput-placeholder"></div>',
                    text = '<label>' + $(this).attr('placeholder') + '</label>';
                    $(this).wrap(div);
                    $(this).before(text);

                    if ($(this).attr('value') !== '') {
                        $(this).focus();
                    }
                });
                $('[data-visual=placeholder]').focus(function(){
                    $(this).siblings('label').addClass('visibilityhidden');
                });
                $('[data-visual=placeholder]').blur(function(){
                    if(!$.trim(this.value).length) {
                        $(this).siblings('label').removeClass('visibilityhidden');
                    }
                });
                $('.textinput-placeholder').click(function(){
                    $(this).find('[data-visual=placeholder]').focus();
		});
            }
        }

		if ($('.tsTable').length && $("[ts-custom-table]").length === 0) {
			require(['modules/table']);
		}

		$('.sticky-header .header').bind('change.collapse', function() {
			if ($(this).hasClass('header-fixed')) {
				main.css('padding-top', header.outerHeight());
			}
		});

		if ($('body').hasClass('sticky-header')) {
			var stickySubNav = false;
			var subLevelMenu = $('.toplevel-item.open .sublevel', header).clone();
			$(window).scroll(function() {
				if ($(this).scrollTop() >= getHeaderTop()) {
					if (!header.hasClass('header-fixed')) {

						// For sticky header
						/*header.addClass('header-fixed');
						main.css('padding-top', header.outerHeight());*/

						// For sticky subnavigation
						if ($('.has-subnavigation', header).length > 0) {
							if ($('.subnav-pusher').length < 1 && !stickySubNav) {
								header.append('<div class="subnav-pusher" style="height:46px;"><div class="tsWrapInner"></div></div>');
								$('.subnav-pusher .tsWrapInner', header).append(subLevelMenu);
								stickySubNav = true;
							}
							header.addClass('subnav-fixed');
						}

					}
				} else {
					if (header.hasClass('header-fixed')) {
						header.removeClass('header-fixed');
						main.css('padding-top', '');
					}
					else if (header.hasClass('subnav-fixed')) {
						$('.subnav-pusher', header).remove();
						header.removeClass('subnav-fixed');
						stickySubNav = false;
					}
				}
			});
		}

		$("#organisation-select").change(function() {
			window.location.href = $(this).val();
		});

		if (!Modernizr.backgroundsize) {
			require(['libs/jquery/jquery.backgroundSize'], function() {
				// set the background size.
				// children that changes size need to trigger the "force-update" event
				$(".tsHero-imagecontainer--alt2").css('backgroundSize', 'cover').on('resized', function() {
					$.refreshBackgroundDimensions(this);
				});
			});
		}

		// 360 view pie chart
		if ($(".ts360view").length) {
			require(['modules/jquery.360view']);
		}

		// Show more
		if ($("[data-toggle='showmore'], [data-widget='collapse'][data-widget-type='preview']").length) {
			require(['modules/jquery.showMore']);
		}


		// spotlights
		var spotlights = $('.tsSpotlight-list');
		if (spotlights.length) {
			
			require(['modules/jquery.positionList'], function() {
				spotlights.positionList({ item: '.tsSpotlight-item', target: '.tsSpotlight-links', css: 'padding-top' });
			});

		}

		// position list widget
		var plist = $("[data-widget='position-list']");
		if (plist.length) {
			require(['modules/jquery.positionList']);
		}


		// spotlights-grids
		var spotlightsGrids = $('.tsSpotlight-list--grids');
		if (spotlightsGrids.length) {
			
			require(['modules/jquery.positionList'], function() {
				spotlightsGrids.positionList({ item: '.tsSpotlight-item', target: '.tsSpotlight-container', setHeight: true });
			});

		}


		// inspiration list
		var filtersortlist = $("[data-widget*=filtersortlist]");
		if (filtersortlist.length) {
			require(['modules/jquery.masonryList', 'modules/jquery.filterSort', 'libs/hash/hash'], function() {
				filtersortlist.masonryList(function() {
					$(this).closest('.tsFluidGrid-outer').filterSort({
						filter: function(index, filter) {
							filtersortlist.masonryList('filter', filter);
						},
						sort: function(index, name, order) {
							filtersortlist.masonryList('sort', name, order);
						}
					});
				});
			});
		}

		if ($("[data-iframe]").length) {
			require(['modules/jquery.iframe']);
		}
		
		// search category filter
		var filterlist = $(".tsSearchResults-categoryList");
		if (filterlist.length) {
			require(['modules/jquery.filterSort'], function() {
				filterlist.closest('.tsSearchResults').filterSort();
			});
		}


		// Shortcuts
		var shortcuts = $("[data-widget*=shortcuts]");
		if (shortcuts.length) {
			require(['modules/jquery.toggleManage', 'modules/jquery.manageBookmarks']);
		}

		// file input§
		$("[data-widget*=inputFile]").each(function() {
			var html = $("<div />", { "class": "tseInput-file" }).append(
				$("<div />", { "class": "tseInput-wrapper" }).append(
					$("<input />", { "type": "text", "class": "tseInput" })
				),
				$("<div />", { "class": "tseSubmit-wrapper" }).append(
					$("<button />", { "class": "tseSubmit" }).text("Bläddra")
				)
			);
			$(this).before(html).css('opacity', 0).change(function(e) {
				$(".tseInput", html).val($(this).val());
				console.log(e);
			});
		});


		// Accordian
		var accordion = $(".tsAccordion-list");
		if (accordion.length) {
			require(['modules/jquery.accordionList']);
		}

		
		// Dropdown
		var dropdown = $(".tseSelectDropdown");
		if (dropdown.length) {
			require(['elements/jquery.dropdown'], function() {
				dropdown.initDropdown();
			});

		}

		// Dropdown variation --small
		var dropdownSmall = $(".tseSelectDropdown--small");
		if (dropdownSmall.length) {
			require(['elements/jquery.dropdown'], function() {
				dropdownSmall.initDropdown({wrapper: "tseDropdown--small"});
			});
		}

		// Checkboxes
		var checkbox = $(".tseCheckbox");
		if (checkbox.length) {

			require(['elements/jquery.inputs'], function() {
				checkbox.initCheckbox();

				// Utan denna kodsnutt finns en bugg som gör alla checkboxar ibland blir checked,
				// men det syns inte eftersom de inte har checked-klassen.
				checkbox.each(function () {
					if (!$(this).hasClass("tseCheckbox--checked")) {
						$(this).prop('checked', false);
					}
				});
			});
		}

		// Dynamic customer flow
		var dynamicCustomerFlow = $(".tsDynamicCustomerFlow");
		if (dynamicCustomerFlow.length) {

			require(['modules/jquery.dynamicCustomerFlow'], function() {
				dynamicCustomerFlow.serviceErrendFlow();
			});

		}

		// Invoice email verification
		if ($(".tsInvoiceValidateEmailForm").length) {
			require(['modules/jquery.invoiceEmailValidation']);
		}

		// Shortcuts validation
		// var shortCutsForm = $(".tsShortCuts-add-url");
		// if (shortCutsForm.length) {
		//     require(['modules/jquery.shortcutsValidation'], function() {
		//         shortCutsForm.tsShortcutsValidation();
		//     });

		// }

		// Form validation
		/*var form = $(".tscForm");
		if (form.length) {
			require(['modules/jquery.formValidation'], function() {
				var v = form.tsFormValidation();
				var w = form.data('widget');
				console.log(w);
				if (w && w.match(/clearForm/)) {
					require(['modules/jquery.clearForm'], function() {
						form.clearForm();
						window.v = v;
						var clearFormButton = $("[data-options*=clearFormButton]", form);
						$(clearFormButton).click(function(){
							console.log("blaha");
							v.resetForm();
						});
					});
				}
			});

		}*/

		// Password validation
		var password = $(".tsPassword");
		if (password.length) {
			require(['modules/jquery.passwordValidation'], function() {
				var syncPassword = $("[data-widget*=syncPassword]");
				if (syncPassword.length) {
					require(['modules/jquery.syncPassword', 'modules/jquery.passwordValidation'], function() {
						syncPassword.syncPassword();
						password.passwordValidation();
					});
				} else {
					password.passwordValidation();
				}

			});

		}

		// Password sync
		var syncPassword = $("[data-widget*=syncPassword]");
		if (syncPassword.length) {
			require(['modules/jquery.syncPassword'], function() {
				syncPassword.syncPassword();
			});
		}

		// Multilevel
		var multilevel = $("[data-widget*=multilevel]");
		if (multilevel.length) {
			require(['modules/jquery.multilevel'], function() {
				multilevel.multilevel();
			});

		}

		// Switch
		var switcher = $(".tsSwitch");
		if (switcher.length) {
			require(['modules/jquery.switcher'], function() {
				switcher.switcher();
			});

		}

		// Custom validation
		if ($("[data-toggle=validate]").length) {
			require(['modules/jquery.validation']);
		}

		// Clear form
		/*var clearForm = $("[data-widget*=clearForm]");
		if (clearForm.length) {
			require(['modules/jquery.clearForm'], function() {
				clearForm.clearForm();
			});
		}*/

		// Toggle Data
		var toggleData = $("[data-widget*=toggleData]");
		if (toggleData.length) {
			var jsonFile = toggleData.data("json-file");
			var dataType = toggleData.data("type");
			var dataContainer = toggleData.data("data-container");
			var toggleListItems = toggleData.data("toggle-list-items");
			require(['modules/jquery.toggleData'], function() {
				toggleData.toggleData({ jsonFile: jsonFile, dataType: dataType, dataContainer: dataContainer, listItems: toggleListItems });
			});

		}
		
		// Data filtertabs
		var filterTabs = $("[data-toggle=filtertabs]");
		if (filterTabs.length) {
			require(['modules/jquery.filterTabs'], function() {
				filterTabs.filterTabs();
			});
		}

		// Reload datatables with ajax
		var tableMulti = $(".tsTable-multi");
		if (tableMulti.length) {
			require(['modules/jquery.reloadTable']);
		}
		
		// Support search
		var supportSearch = $("[data-search='supportSearch']");
		if (supportSearch.length) {
			require(['modules/jquery.supportSearch']);
		}

		// Resize
		var resize = $("[data-widget*=resize]");
		if (resize.length) {
			require(['modules/jquery.resize'], function() {
				resize.resize();
			});
		}

		// Add file
		var addFile = $("[data-widget*=addFile]");
		if (addFile.length) {
			require(['modules/jquery.addFile']);
		}

		$('[class^="tseSelect"] select').each(function() {
			$(this).after(
				$("<div />", { "class": "select-placeholder" }).text($('option:selected', this).text())
			).addClass('hidden');
		}).change(function() {
			$(this).next('.select-placeholder').text($('option:selected', this).text());
		});

		// Manage billing accounts
		if ($("[data-widget=manageBillingAccounts]").length) {
			require(['modules/jquery.manageBillingAccounts']);
		}

		// Manage DCF group templates
		if ($("[data-widget=manageDCFGroupTemplates]").length) {
			require(['modules/jquery.dcfGroupTemplates']);
		}

		// Manage role
		if ($("[data-widget*=manageRole]").length) {
			require(['modules/jquery.manageRole']);
		}

		// Render template
		if ($("[data-widget*=renderTemplate]").length) {
			require(['modules/jquery.renderTemplate']);
		}

		// Multilevel
		var editable = $("[data-widget*=editable]");
		if (editable.length) {
			require(['modules/jquery.editable']);
		}

		// Add iframe
		var addIframe = $("[data-widget*=addIframe]");
		if (addIframe.length) {
			var iframeHeight = addIframe.data("iframe-height");
			require(['modules/jquery.addIframe'], function() {
				addIframe.addIframe({ iframeHeight: iframeHeight });
			});
		}

		// Add iframe
		var setFocus = $("[data-widget*=setFocus]");
		if (setFocus.length) {
			var focusTarget = setFocus.data("focus-target");
			require(['modules/jquery.setFocus'], function() {
				setFocus.setFocus({ focusTarget: focusTarget });
			});
		}

		$("[data-id=downloadFile]").each(function () {
			require(['modules/jquery.downloadFile']);
		});

        // When is this used? Should it really be on all pages?
		require(['modules/colorselector']);
		
		//For Selectlist on productdetails page
		$('body').on('click', '[data-widget=selectList-trigger-alt]', function(e){
			e.stopPropagation();
			e.preventDefault();
			var list = $(this).siblings('[data-widget=selectList]');
			var open = list.hasClass('hide');
			$('.tsSelectList').addClass('hide');
			if (open) {
				list.removeClass('hide');
				$(this).addClass("active");
				list.css('margin-left', -list.width()/2);
			} else {
				list.addClass('hide');
				$(this).removeClass("active");
			}
		});
		/*
		window.highestElement = function(elements)
		  {
			  var array = [];
			  $.each(elements,function() {
				  var height = $(this).outerHeight();

				  array.push(height);
			  });
			  var max = Math.max.apply(null, array);
			  return max;
		  };

		require(['libs/misc/chart.min', 'modules/rating', 'mediaqueries']);
		*/

        //$('input, textarea').placeholder();
    
        // LOAD IE8 MODULES
        if ($("body").hasClass('lt-ie9')) {
            require(["poly-checked"]);
        }

	});

	// If user is on WanOverView the init-file for WoV should be loaded
	if ($("#wanoverviewHiddenElement").length || window.location.href.toLowerCase().indexOf("wanoverview") >= 0) {
		require(['../../wov/js/wov-init']);
	}

	// NTW specific

	//if ($('.combobox-autocomplete').length) {
	//	require(['../../../../Scripts/combobox.js'], function () {
	//		$('.combobox-autocomplete').combobox();
	//	});
	//}

//	if ($('.combobox-autocomplete').length) {
//		require(['../../../../Scripts/combobox.js'], function () {
//		});
//	}

	if ($('[data-val-isdatetimeafter]').length) {
		require(['../../../../Scripts/validation.isdatetimeafter.js']);
	}

    if ($('table').length) {
    	require(['../../../../Scripts/deleteConfirmation.js']);
    }

    if ($('form').length) {
    	require(['libs/jquery/jquery.validate.min'], function () {
        	require(['jquery.validate.unobtrusive'], function () {
		        require(['jquery.validate.unobstrusive.advanced'], function() {
		            if ($('.combobox-autocomplete').length) {
		                require(['../../../../Scripts/combobox.js']);
		            }
		        });
	        });
        });
    }

    if ($('[data-datepicker]').length) {
    	require(['../external/libs/jquery/jquery-ui-1.10.4.full.min'], function () {
    		$.datepicker.regional['sv'] = {
    			closeText: 'Stäng',
    			prevText: '&#xAB;Förra',
    			nextText: 'Nästa&#xBB;',
    			currentText: 'Idag',
    			monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
				'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
    			monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
				'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    			dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
    			dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
    			dayNamesMin: ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'],
    			weekHeader: 'V',
    			dateFormat: 'yy-mm-dd',
    			firstDay: 1,
    			isRTL: false,
    			showMonthAfterYear: false,
    			yearSuffix: ''
    		};
    		$.datepicker.setDefaults($.datepicker.regional['sv']);

    		if ($('[analys-datepicker]').length) {
    		    $('[data-datepicker=date]').datepicker({
    		        changeMonth: true,
    		        changeYear: true,
    		        showOtherMonths: true,
                    selectOtherMonths: true
    		    });
    		}
    		else {
    		    $('[data-datepicker=date]').datepicker({

    		    });
    		}

    		if ($('[data-datepicker=time], [data-datepicker=datetime]').length) {
    			require(['../../../../Scripts/jquery-ui-timepicker-addon'], function () {
    				$.timepicker.regional['sv'] = {
    					timeOnlyTitle: 'Tid',
    					timeText: 'Tid',
    					hourText: 'Timme',
    					minuteText: 'Minut',
    					secondText: 'Sekund',
    					millisecText: 'Millisekund',
    					timezoneText: 'Tidzon',
    					currentText: 'Nu',
    					closeText: 'Stäng',
    					timeFormat: 'HH:mm',
    					amNames: ['AM', 'A'],
    					pmNames: ['PM', 'P'],
    					isRTL: false
    				};
    				$.timepicker.setDefaults($.timepicker.regional['sv']);

    				$('[data-datepicker=time]').timepicker({

    				});

    				$('[data-datepicker=datetime]').each(function () {
				        if ($(this).attr('data-val-futuredate') != null) {
                            $(this).datetimepicker({
                                minDate: 0,
                                changeMonth: true,
                                changeYear: true
                            });
                        }

				        $(this).datetimepicker({
				            changeMonth: true,
				            changeYear: true
				        });
				    });
    			});
    		}

    	    // Sets the invalid date error message.
    	    // This should be able to do with $.extend($.validator.messages, {date: "Ogiltigt datum"});
    	    // But it does not work for unknown reason.
    	    // The other possible solution would be to add localization the type error messages in MVC.
    	    // This did not work either for unknown reason.
            // So the below is the workaround :-)
	        $('[data-val-date]').attr('data-val-date', 'Ogiltigt datum');
	    });
    }
});