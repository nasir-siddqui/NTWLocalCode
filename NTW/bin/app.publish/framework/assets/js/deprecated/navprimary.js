// This widget needs collapse.js to be loaded and executed

function foldOutSlideOut(element) {
    element.slideDown(300,function() {
//        element.removeClass('is-collapsed').addClass('is-expanded');
    });
}

// Replaced 2013-08-29
// function foldOutSlideUp(element, callback) {
//     element.slideUp(300,function() {
//         element.removeClass('is-expanded').addClass('is-collapsed', function() {
//             console.log("doing this");
//             element.remove();
//             if (typeof(callback) == 'function') {
//                 callback();
//             }
//         });
//     });
// }    

// function foldOutSlideUp(element) {
//     element.slideUp(300,function() {
// //        element.removeClass('is-expanded').addClass('is-collapsed', function() {
//             $(this).remove();
// //        });
//     });
// console.log("slide up foldout, changed class to is-collapsed, and should have removed the foldout");
// }    


function foldOutSlideUp(element, callback) {
    element.slideUp(300,function() {
//        element.removeClass('is-expanded').addClass('is-collapsed', function() {
            $(this).remove();
            if (typeof(callback) == 'function') {
                callback();
            }
//        });
    });
}    




$(document).ready(function() {
    
//    function navprimary() {
        if ($('.tsNavPrimaryHover-TopLevel').length > 0) {
            // If .tsNavPrimaryHover-TopLevel exists, set an index on all children
            // The index is used to identify which menu item that opened up the foldout
            var topLevelItems = $('.tsNavPrimaryHover-TopLevel').children();
            dataIndex = 1;
            topLevelItems.each(function() {
                $(this).attr('data-collapseindex', dataIndex);
                dataIndex ++;
            })
        }    
//    }
    
    $('body').on('click', '[data-widget-control=navPrimary-trigger]', function() {
        if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
            
        
            var header = $('.tsHeader[role=banner]'),
                campaign = header.find('[data-container=navPrimary-campaign]'),
                collapses = $(this).parents('[data-widget=collapse]'),
                thisCollapse = $(collapses[0]),
                collapseIndex = thisCollapse.data('collapseindex'),
                foldoutIndex = header.find('.tsNavPrimaryHoverFoldOut').data('foldoutindex'),
                inners = $(collapses[0]).find('[data-widget-collapse=inner]'),
                thisInner = $(inners[0]),
                newItem = $('<div />'),
                foldOut;
        
            function appendFoldOut() {
                newItem.addClass("tsNavPrimaryHoverFoldOut");
                newItem.addClass("is-collapsed");
                newItem.attr('data-foldoutindex', collapseIndex);
                newItem.append('<div class="tsWrapInner"><ul class="tsNavPrimaryHover-SubLevel tsNavPrimaryHoverFoldOut-Inner">' + thisInner.html() + '<li class="tsNavPrimaryHoverCampaign">' + $(campaign[0]).html() + '</li></ul></div>');
                newItem.append('<div class="tsNavPrimaryHoverFoldOut-Close"<div class="tsWrapInner"><span class="tsNavPrimaryHoverFoldOut-CloseButton" data-widget-control="collapse-close">' + $(collapses[0]).data('widget-closetext') +'<i class="tsIcon-FoldOutCloseButton">x</i></span></div></div>')

                header.append(newItem);
            
                foldOutSlideOut($('.tsNavPrimaryHoverFoldOut'));
            }
            
            
            if ($('.tsNavPrimaryHoverFoldOut').length > 0) {
                if ($('.tsNavPrimaryHoverFoldOut').data('foldoutindex') !== collapseIndex) {
                    foldOutSlideUp($('.tsNavPrimaryHoverFoldOut'), function(appendNow) {
                        appendFoldOut();


// toggleCollapse($(this).closest('[data-widget=collapse]'));



                    });
                    if ($('[data-collapseindex="' + foldoutIndex + '"]').hasClass="is-expanded") {
                        toggleCollapse($('[data-collapseindex="' + foldoutIndex + '"]'));
                    }
                } else {
                    foldOutSlideUp($('.tsNavPrimaryHoverFoldOut'));
                }
            } else {
                appendFoldOut();
            } // endif
            
        } // endif            
    
    });
    
    

    // Slide up the Foldout using the close button
    $('body').on('click', '.tsNavPrimaryHoverFoldOut-CloseButton', function() {
        var foldoutIndex = $(this).parents('.tsNavPrimaryHoverFoldOut').data('foldoutindex');
        foldOutSlideUp($('.tsNavPrimaryHoverFoldOut'));
        toggleCollapse($('[data-collapseindex="' + foldoutIndex + '"]'));
    });





/*
    $('body').on('mouseleave', '.tsHeader', function() {
//        console.log($(this).attr('class'));
//        console.log($(this).closest('.tsHeader').find('.tsNavPrimaryHoverFoldOut').attr('class'));
        var foldoutIndex = $(this).find('.tsNavPrimaryHoverFoldOut').data('foldoutindex');
        myTimer = setTimeout(function() {
            $(this).mouseenter( function() {
                console.log("stop!");
//                return false;
//                $('.tsNavPrimaryHoverFoldOut').stop(true, true, true).slideDown();
                clearTimeout(myTimer);
            });
            foldOutSlideUp($('.tsNavPrimaryHoverFoldOut'));
            console.log("try to toggle " + foldoutIndex);
            toggleCollapse($('[data-collapseindex="' + foldoutIndex + '"]'));            
        }, 700);
    })
*/

    (function($){
       $.fn.lazybind = function(event, fn, timeout, abort){
            var timer = null;
            $(this).bind(event, function(){
                timer = setTimeout(fn, timeout);
            });
            if(abort == undefined){
                return;
            }
            $(this).bind(abort, function(){
                if(timer != null){
                    clearTimeout(timer);
                }
            });
        };
    })(jQuery);


// Closes foldout on mouse out

    // 
    // $('.tsHeader').lazybind(
    //     'mouseleave',
    //     function(){
    //         
    //         if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
    //         var foldoutIndex = $('.tsNavPrimaryHoverFoldOut').data('foldoutindex');
    //             console.log("foldoutIndex: " + foldoutIndex);
    //         if (foldoutIndex != null) {
    //  console.log("allright");
    //             foldOutSlideUp($('.tsNavPrimaryHoverFoldOut'), function() {
    //                 if ($('[data-collapseindex="' + foldoutIndex + '"]').hasClass="is-expanded") {
    //                     toggleCollapse($('[data-collapseindex="' + foldoutIndex + '"]'));                    
    //                 }
    //             });
    //         }
    //     }
    //     },
    //     540,
    //     'mouseenter');
    // 


/*
(function($){
   $.fn.lazybind = function(event, fn, timeout, abort){
        var timer = null;
        $(this).bind(event, function(){
            timer = setTimeout(fn, timeout);
        });
        if(abort == undefined){
            return;
        }
        $(this).bind(abort, function(){
            if(timer != null){
                clearTimeout(timer);
            }
        });
    };
})(jQuery);


$('#tooltip').lazybind(
    'mouseout',
    function(){
        $('#tooltip').hide();
    },
    540,
    'mouseover');

*/    

//     $('body').on('mouseenter', '.tsHeader', function() {
//         var foldoutIndex = $(this).find('.tsNavPrimaryHoverFoldOut').data('foldoutindex');
//         console.log("I'm back!");
// //        clearTimeout($(this).data('timer'));
// //setTimeout(function() {
//     $(this).find('.tsNavPrimaryHoverFoldOut').stop(true,true);
//     foldOutSlideOut($('.tsNavPrimaryHoverFoldOut'));
// //}, 700);
//         //});
// //        $(this).find('.tsNavPrimaryHoverFoldOut').stop(true,true);
//         
// /*
// $('.hover-items').each(function(idx, el){
//   $(el).mouseenter(function() {
//     clearTimeout($(el).data('timer'));
//     $('#target_div').slideDown(300)
//       .unbind()
//       .mouseleave(function() {
//         var closure = function(){$('#target_div').slideUp(300)};
//         $(el).data('timer', setTimeout(closure,2000));
//     });
//   });
// });
// */        
//         
//         
//         
//         
//     });


});
    
