// Temporary until new media breakpoint is added globally
var mqXlarge = mqXlarge || '64em',
    mqLtXlarge = mqLtXlarge || '63.99em';
$(function() {
    var _pls, PricelistWidget = {
        settings: {
            priceList: $('.tsPriceList'),
            priceListSections: $('.tsPriceList-Section'),
            priceListInner: $('.tsPriceList-Section-inner'),
            priceListOuter: $('.tsPriceList-Section-outer'),
            contentContainer: $('.tsPriceList-Content'),
            contentInnerContainer: $('.tsPriceList-Content-Inner'),
            contentSections: $('.tsPriceList-Content-Section'),
            contentPlaceholder: $('#tsPriceList-Content-Placeholder'),
            contentMobile: $('.tsPriceList-Mobile-Content'),
            contentMiddleCls: 'tsPriceList-Content-middle',
            nSectionsTablet: 3,
            gtIe9: !$("body").hasClass("lt-ie9") //change to lt-ie10 when available
        },
        init: function() {
            _pls = this.settings;

            this.bindActions();
            this.updateView(true);
        },
        //Initiate all UI-events
        bindActions: function() {
            var me = this;

            _pls.priceListSections.find('li > a[href^=#]').click(function(e) {
                var $this = $(this),
                    contentId = $this.attr('href');

                e.preventDefault();

                //Disable multiple clicks...
                if ($(':animated').length) {
                    return false;
                }
                if (mediaqueriesMax('mqLtMedium') && _pls.gtIe9) {
                    me.expandMobile($this, contentId);
                } else if (mediaqueriesMax('mqLtXlarge') && _pls.gtIe9) {
                    me.expandTablet($this, contentId);
                } else {
                    _pls.contentPlaceholder.slideUp(function() {
                        me.expandDesktop($this, contentId);
                    })
                }
            });
            if (!_pls.gtIe9) {
                return;
            }
            //Collapse all on section change on mobile
            this.settings.priceList.on('click touchstart', '[data-widget-collapse=trigger]', function(e) {
                var $outer = $(this).parents('.tsPriceList-Section-outer');
                $outer.find('.tsPriceList-Mobile-Content').slideUp();
                PricelistWidget.removeIsExpandedAll($outer);
            });

            $(window).bind('resizeEnd', function() {
                me.updateView();
            });
        },
        //Removes all instances of the is expanded class
        removeIsExpandedAll: function($container) {
            var $ct = $container || _pls.priceListInner;
            $ct.find('.tsPriceList-isExpanded').removeClass('tsPriceList-isExpanded');
        },
        toggleCollapseStatus: function($href, isExpanded) {
            $href.toggleClass('tsPriceList-isExpanded', typeof isExpanded !== 'undefined' ?
                isExpanded : $href.hasClass('tsPriceList-isExpanded'));
        },
        isExpanded: function($href) {
            return $href instanceof jQuery && $href.hasClass('tsPriceList-isExpanded');
        },
        //Run on every window change to check if media breakpoints has changed
        updateView: function(isInitial) {
            var n = _pls.nSectionsTablet,
                gtIe9 = _pls.gtIe9;
            if (mediaqueriesMax('mqLtMedium') && gtIe9) {
                //First into mobile
                if (!_pls.mobileLast || isInitial) {
                    _pls.priceListInner.height('auto');
                    _pls.priceListSections.removeClass('active');
                }
                _pls.mobileLast = true;
            } else {
                if (_pls.mobileLast || isInitial) {
                    _pls.priceListInner.height(highestElement(_pls.priceListInner));
                }
                if (mediaqueriesMax('mqLtXlarge') && gtIe9) {
                    if (!_pls.tabletLast && !_pls.mobileLast || isInitial) {
                        PricelistWidget.movePriceContent();
                    }
                    _pls.mobileLast = false;
                    _pls.tabletLast = true;
                } else {
                    if (_pls.tabletLast) {
                        //Move content container from tablet position to bottom in desktop
                        _pls.contentPlaceholder.hide();
                        $('#tsPriceList-Content-Home').html($('.tsPriceList-Content').detach());
                    }
                    _pls.mobileLast = false;
                    _pls.tabletLast = false;
                }
            }
        },
        //Move the content container to allow placement in between rows (tablet view)
        movePriceContent: function() {
            var me = this,
                sections = me.settings.priceListSections,
                contentContainer = me.settings.contentContainer,
                activeSection = me.settings.priceListSections.siblings('.active');

            me.getLastSectionInRow(sections, activeSection).after(contentContainer);

            if (sections.parent().children().last().is(contentContainer)) {
                _pls.contentInnerContainer.removeClass('tsPriceList-Content-middle');
                _pls.contentPlaceholder.slideUp();
            } else {
                _pls.contentInnerContainer.addClass('tsPriceList-Content-middle');
                _pls.contentPlaceholder.slideDown();
            }
        },
        expandDesktop: function($collapseTrigger, contentId, beforeSlideFn) {
            _pls.contentInnerContainer.slideUp(function() {
                _pls.contentSections.hide();
                _pls.priceListSections.removeClass('active');
                //Not expanded
                if (!PricelistWidget.isExpanded($collapseTrigger)) {
                    $collapseTrigger.parents('.tsPriceList-Section').addClass('active');
                    $(contentId).show();
                    _pls.contentInnerContainer.slideDown(function() {
                        PricelistWidget.scrollToHeadline($collapseTrigger);
                    });
                    PricelistWidget.removeIsExpandedAll();
                    PricelistWidget.toggleCollapseStatus($collapseTrigger, true);
                    beforeSlideFn && beforeSlideFn();
                } else {
                    _pls.contentPlaceholder.slideDown();
                    PricelistWidget.toggleCollapseStatus($collapseTrigger, false);
                }
            });
        },
        expandTablet: function($collapseTrigger, contentId) {
            var me = this;
            var $currSection = $collapseTrigger.parents('.tsPriceList-Section');

            me.expandDesktop($collapseTrigger, contentId, function() {
                me.movePriceContent($currSection);
            });
        },
        expandMobile: function($collapseTrigger, contentId) {
            var $mobileContainer = $collapseTrigger.parents('ul').find('.tsPriceList-Mobile-Content');
            var $li = $collapseTrigger.parents('li');

            $mobileContainer.slideUp(null, function() {
                if (!PricelistWidget.isExpanded($collapseTrigger)) {
                    $li.after($mobileContainer.detach());
                    $mobileContainer.html($(contentId).html()).slideDown();
                    PricelistWidget.removeIsExpandedAll($collapseTrigger.parents('ul'));
                    PricelistWidget.toggleCollapseStatus($collapseTrigger, true);
                } else {
                    PricelistWidget.toggleCollapseStatus($collapseTrigger, false);
                }
            });
        },
        scrollToHeadline: function($collapseTrigger, completeFn) {
            if (!PricelistWidget.isScrolledIntoView(_pls.contentInnerContainer)) {
                var offset = $collapseTrigger.parents('.tsPriceList-Section-inner')
                    .find('.tsPriceListBigHeader > h2')
                    .offset();
                if (!offset) {
                    return;
                }
                $('html,body').animate({
                    scrollTop: offset.top
                }, {
                    complete: completeFn
                });
            }
        },
        isScrolledIntoView: function(elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        getLastSectionInRow: function($sections, $activeSection, setMiddleClass) {
            var index = $activeSection.index(),
                lastIndex = this.settings.priceListSections.size() - 1,
                lastIndexInRow = Math.min(this.getLastIndexInRow(index, 3), lastIndex);
            if (setMiddleClass && lastIndexInRow < lastIndex) {
                $activeSection.find('.tsPriceList-Content-Inner').addClass(this.contentMiddleCls);
            }
            return this.settings.priceListSections.eq(lastIndexInRow);
        },
        getLastIndexInRow: function(index, rowSize) {
            return index - index % rowSize + rowSize - 1;
        }
    };
    PricelistWidget.init();
});