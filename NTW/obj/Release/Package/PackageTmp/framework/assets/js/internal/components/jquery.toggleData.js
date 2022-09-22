/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'modules/jquery.loadVideo', 'elements/jquery.dropdown', 'imagesloaded/imagesloaded'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    // Toggle data using ajax
    $.fn.toggleData = function(options) {

        var defaults = {
            jsonFile: 'test/json-data.php',
            secondJsonFile: '',
            dataType: 'guide',
            ul: '.tsSpotlight-list--grids',
            listItems: '.tsSpotlight-item',
            secondaryListItems: '',
            dataContainer: '',
            newItem: 'tsGuide',
            toggleType: 'fade',
            slideSpeed: 400,
            duration: 350,
            scrollToSpeed: 800,
            selectPlaceholder: 'Välj ditt alternativ'
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            var dataContainer = $(options.dataContainer, $(this));
            var area =  $('<div class="tsExpandableArea tsBorderTop"></div>');

            var listLength = "";
            $.each($(options.listItems, _this), function() {
                listLength = $(this).index();

                // Move to freemarker/php
                $(this).attr('data-list-id', $(this).index());
            });

            $(options.listItems, _this).on("click", function(e) {
                var thisLi = $(this);
                var id = thisLi.attr("data-id") || "0";
                var newItem = "." + options.newItem;
                var removeThisData = false;

                if (thisLi.hasClass("toggled")) {
                    removeThisData = true;
                }

                $(options.secondaryListItems, _this).removeClass("toggled");
                $(options.listItems, _this).removeClass("toggled");
                thisLi.toggleClass("toggled");
                var thisLiIndex = thisLi.index();
                var lastItem = "";
                var lastSibling = "";
                e.preventDefault();

                if (removeThisData === false) {
                    $.getJSON(options.jsonFile + "?id=" + id, function(result) {

                        var guideListItem;
                        // Create the guide
                        if (dataContainer.length) {
                            guideListItem = $('<div class="' + options.newItem + '"><div class="tsGuideContainer"><h1 class="h1 tsGuide-headline">' + result.headline + '</h1><a class="tsSecondaryLink tsGuide-close">Stäng</a></div></div>');
                        }
                        else {
                            guideListItem = $('<li class="' + options.newItem + '"><div class="tsGuideContainer"><h1 class="h1 tsGuide-headline">' + result.headline + '</h1><a class="tsSecondaryLink tsGuide-close">Stäng</a></div></li>');
                        }
                        var divContainer = $('<div class="tsWizardWrapper"></div>');
                        var dropdown = $('<select class="tseSelectDropdown" data-placeholder="' + options.selectPlaceholder + '"></select>');

                        var steps = [];
                        var tabsSteps = [];

                        if (result.tabs) {
                            var tabs = result.tabs;
                            var tabsTitle = [];

                            $.each(tabs, function() {
                                tabsTitle.push(this.tabTitle);
                                tabsSteps.push(this.steps);
                                var tabsOption = $('<option value="' + this.tabTitle + '">' + this.tabTitle + '</option>');
                                dropdown.append(tabsOption);
                            });

                            guideListItem.children('.tsGuideContainer').prepend(dropdown);

                        }
                        else {
                            steps = result.steps;
                        }


                        function createSteps(tabIndex) {
                            var divContainerIsEmpty = false;
                            if (result.itemtype === "MultiSectionSupportGuide") {
                                if (divContainer.html().length === 0) {
                                    divContainerIsEmpty = true;
                                }
                                divContainer.empty();
                            }

                            var sortedList = [$('<ol class="tsWizard tsBodyText"></ol>')];

                            if (tabIndex > -1) {
                                steps = tabsSteps[tabIndex];
                            }

                            var stepsLength = steps.length;

                            // Divide into lists of steps and divs with non steps
                            $.each(steps, function(i, item) {
                                var stepListItem = "";
                                var youtubeId = item.youtubeId;
                                var videoContainer = '<div class="tsVideoContainer" data-widget="loadVideo" data-youtubeId="' + youtubeId + '"><div class="tsLoading-icon-large"></div></div>';
                                var image = '<img src="' + item.image + '">';

                                if (item.isNotStep === "true") {
                                    var ingress = $('<div class="tsGuide-ingress">' + item.html + '</div>');
                                    var nonStep = $('<div class="tsGuide-nonStep">' + item.html + '</div>');

                                    if (item.image) {
                                        ingress.append(image);
                                        nonStep.append(image);
                                    }

                                    if (youtubeId) {
                                        ingress.prepend(videoContainer);
                                        nonStep.prepend(videoContainer);
                                    }
                                    
                                    // Add to list
                                    if (i > 0) {
                                        sortedList.push(nonStep);
                                        if (i !== (stepsLength-1)) {
                                            sortedList.push($('<ol class="tsWizard tsBodyText"></ol>'));
                                        }
                                    }
                                    else {
                                        divContainer.append(ingress);
                                    }

                                }
                                else {
                                    stepListItem = $('<li class="tsWizard-Item">' + item.html + '</li>');

                                    if (item.image) {
                                        stepListItem.append(image);
                                    }
                                    if (youtubeId) {
                                        stepListItem.prepend(videoContainer);
                                    }

                                    sortedList[sortedList.length-1].append(stepListItem);
                                }
                            });

                            $.each(sortedList, function(i) {
                                divContainer.append(sortedList[i]);
                            });

                            // Append the steps to the guide
                            if (result.itemtype === "MultiSectionSupportGuide") {
                                guideListItem.children('.tsGuideContainer').append(divContainer);
                                if (divContainerIsEmpty === true) {
                                    divContainer.hide().slideDown(options.slideSpeed, function() {
                                        $(this).imagesLoaded().always(function() {
                                            resize();
                                        });
                                    });
                                }
                                $(_this).loadVideo();
                            }
                            else {
                                guideListItem.children('.tsGuideContainer').append(divContainer);
                            }


                        }

                        // Insert guide into list and slide open
                        function initData() {

                            if (dataContainer.length) {
                                dataContainer.parent('div').show();
                                area.empty();
                                area.append(guideListItem);
                                dataContainer.append(area).hide();
                                dataContainer.slideDown(options.slideSpeed, function() {
                                    $(_this).loadVideo();
                                });
                            }
                            else {
                                guideListItem.insertAfter($(options.ul + ">li[data-list-id='" + lastItem + "']")).hide().slideDown(options.slideSpeed, function() {
                                    $(_this).loadVideo();
                                    scrollToData(guideListItem);
                                    resize();
                                });
                            }

                            if (result.itemtype === "MultiSectionSupportGuide") {
                                dropdown.initDropdown();
                                $(".tseDropdown-listItem", _this).click(function() {
                                    var tabIndex = $(this).index();
                                    createSteps(tabIndex);
                                });
                            }

                            $(".tsGuide-close").click(function() {
                                removeData();
                            });

                        }

                        if (result.itemtype !== "MultiSectionSupportGuide") {
                            createSteps();
                        }

                        // Remove open guides and open a new one
                        if ($(newItem).length > 0) {
                            $(newItem, _this).slideUp(200, function() {
                                $(this).remove();
                                lastItem = checkLastItem();
                                if ($(options.ul + ">li[data-list-id='" + lastItem + "']").length === 0) {
                                    lastItem = lastItem - 1;
                                }

                                initData();
                            });
                        }
                        // First time opening a guide
                        else {
                            lastItem = checkLastItem();
                            initData();
                        }

                    });
                }

                // Close guide and remove it
                function removeData() {
                    if (dataContainer.length) {
                        dataContainer.parent('div').slideUp(options.slideSpeed, function() {
                            dataContainer.empty();
                            $(options.secondaryListItems, _this).removeClass("toggled");
                            $(options.listItems, _this).removeClass("toggled");
                        });
                    }
                    else {
                        $(newItem, _this).slideUp(options.slideSpeed, function() {
                            $(this).remove();
                            $(options.secondaryListItems, _this).removeClass("toggled");
                            $(options.listItems, _this).removeClass("toggled");
                            resize();
                        }); 
                    }
                }
                
                // Check where a new row starts
                function checkLastItem() {
                    thisLi.siblings().each(function() {
                       if (thisLi.offset().top === $(this).offset().top) {
                            thisLiIndex = thisLi.index();
                            lastSibling = $(this).index();
                       }
                    });

                    if (thisLiIndex > lastSibling) {
                        if (thisLi.data("list-id") !== thisLiIndex) {
                            thisLiIndex = thisLiIndex - 1;
                        }
                        return thisLiIndex || 0;
                    }
                    else {
                        return lastSibling || 0;
                    }
                }

                // Scroll to opened guide
                function scrollToData(guideListItem) {
                    var destination = "";

                    if ($(window).width() > 688) {
                        destination = guideListItem.offset().top - 43;
                    }
                    else {
                        destination = guideListItem.offset().top;
                    }

                    $('html, body').animate({
                        scrollTop: destination
                    }, options.scrollToSpeed);
                }

                // Resize to the containers height
                function resize() {
                    $(_this).trigger('resized');
                }

            });

            // FAQ
            $(options.secondaryListItems, _this).on('click', function(e) {
                var removeThisData = false;
                e.preventDefault();
                var thisLi = $(this);
                if (thisLi.hasClass('toggled')) {
                    removeThisData = true;
                }
                var id = thisLi.attr('data-id') || '0';

                function showData() {
                    if (options.toggleType === 'fade') {
                        dataContainer.parent('div').fadeOut(options.duration, function() {
                            appendData();
                        });
                    }
                    else if (options.toggleType === 'slide') {
                        dataContainer.parent('div').slideUp(options.duration, function() {
                            appendData();
                        });
                    }

                    
                    function appendData() {
                        dataContainer.empty();
                        $.getJSON(options.secondJsonFile + "?id=" + id, function(result) {
                            $(options.listItems, _this).removeClass("toggled");
                            $(options.secondaryListItems, _this).removeClass("toggled");
                            thisLi.addClass('toggled');
                            var question = $('<h4 class="h4">' + result.question + '</h4>');
                            var answer = $('<p>' + result.answer + '</p>');
                            var close = $('<span class="tsExpandable-close tsSecondaryLink" data-toggle="collapse" data-collapse-type="fade" data-collapse-duration="200">Stäng</a>').on('click', function() {
                                clearData();
                            });
                            area.empty();
                            area.append(close, question, answer);

                            if (options.toggleType === 'fade') {
                                dataContainer.append(area);
                                dataContainer.parent('div').hide().fadeIn(options.duration);
                            }
                            else if (options.toggleType === 'slide') {
                                dataContainer.append(area);
                                dataContainer.parent('div').hide().slideDown(options.duration);
                            }
                        });
                    }

                }

                function clearData() {
                    $(options.listItems, _this).removeClass("toggled");
                    $(options.secondaryListItems, _this).removeClass("toggled");
                    if (options.toggleType === 'fade') {
                        dataContainer.parent('div').fadeOut(options.duration, function() {
                            dataContainer.empty();
                        });
                    }
                    else if (options.toggleType === 'slide') {
                        dataContainer.parent('div').slideUp(options.duration, function() {
                            dataContainer.empty();
                        });
                    }
                }

                if (removeThisData === false) {
                    showData();
                }
                else {
                    clearData();
                }

            });

            
        });
        
    };

    $("[data-widget*=toggleData]").each(function() {

        var options = {
            jsonFile: $(this).data("json-file"),
            secondJsonFile: $(this).data("second-json-file"),
            dataType: $(this).data("type"),
            listItems: $(this).data("toggle-list-items"),
            secondaryListItems: $(this).data("second-toggle-list-items"),
            dataContainer: $(this).data("data-container"),
            toggleType: $(this).data("toggle-type"),
            duration: $(this).data("toggle-duration")
        };

        $(this).toggleData(options);
    });

});