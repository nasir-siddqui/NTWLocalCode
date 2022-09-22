 /* global highestElement:true, mediaqueriesMin:true, productlistAlignment:true */

 $(function () {
  if($('[data-widget="responsivetabs"]').length >0) {
    var setWidthAndHeight = function (element) {
      var items = element.find('.tsResponsiveTabs-Anchor');
      var lItems = element.find('.tsResponsiveTabs-Tab');
      var list = element.find('.tsResponsiveTabs-Nav');
      var heightest = highestElement(items);

      lItems.outerWidth(100 / lItems.length + '%');
      list.height(heightest-1);
      lItems.height(heightest);
    };

    var animate = $('body').hasClass('lt-ie9') || mediaqueriesMin('mqLarge') ? 'default' : 'slide';
    $('[data-widget="responsivetabs"]').responsiveTabs({
      rotate: false,
      startCollapsed: 'accordion',
      collapsible: 'accordion',
      setHash: true,
      animation: animate,
      load: function () {
        //Also do this on resize
        setWidthAndHeight($(this));
      },
      activate: function() {
        productlistAlignment();
        if ($('[data-widget="ratingchart"]').length) {
          $('[data-widget="ratingchart"]').calculateChartHeight();
        }
      },
      classes: {
        stateDefault: 'default',
        stateActive: 'is-active',
        stateDisabled: 'is-disabled',
        tab: 'tsResponsiveTabs-Tab',
        anchor: 'tsResponsiveTabs-Anchor',
        panel: 'tsResponsiveTabs-Panel',
        accordionTitle: 'tsResponsiveTabs-Title',
        tabNav: 'tsResponsiveTabs-Nav',
        tabContainer: 'tsResponsiveTabs'
      }
    });
    $(window).resize(function() {
      if(!$('body').hasClass('lt-ie9')) {
        if(this.resizeTO) {
          clearTimeout(this.resizeTO);
        } 
        this.resizeTO = setTimeout(function() {
          $(this).trigger('resizeTabs');
        }, 500);
      }
    });

    $(window).bind('resizeTabs', function() {
      if(mediaqueriesMin('mqLarge')) {
        $('[data-widget="responsivetabs"]').each(function() {
          setWidthAndHeight($(this));
        });
      }
    });
  }
});