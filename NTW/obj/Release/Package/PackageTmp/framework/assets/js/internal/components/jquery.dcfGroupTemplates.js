(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'service/DCFServiceApi', 'helpers/serviceErrorHandling', 'helpers/common', 'modules/jquery.editable'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($, api, errorHandler, common) {


    $.fn.manageDCFGroupTemplates = function(options) {

        options = $.extend({
            deleteMethod: "deleteUserLevelGroupTemplate",
            saveMethod: "saveUserLevelGroupTemplate"
        }, options);

        var editSuccess = function(data) {

            $(this).trigger('save');

        };

        var editError = function(message) {

        };

        var deleteSuccess = function(data) {

            $(this).trigger('reset').click(deleteClickHandler).closest('form').each(function() {
                $(this).find('span[data-editable-name]').each(function() {
                    $(this).empty();
                    if ($(this).data('editable-type') === 'dropdown') {
                        $(this).text($.grep($(this).data('editable-values'), function(item) { return item.key === ""; })[0].value);
                        $(this).closest('li').find('.tseDropdown').dropdownVal("");
                    } else {
                        $(this).closest('li').find('input').attr('value', '');
                    }
                });
                $(this).find('[data-id=confirm]').addClass('tsHidden');
            });

        };

        var deleteError = function(message) {

        };

        var deleteClickHandler = function(e) {

            e.preventDefault();

            var callbacks = errorHandler.serviceCallbacksWithContext(this, deleteSuccess, deleteError);

            api[options.deleteMethod].call(null, common.orgnr, [ $(this).closest('form').data('id') ], callbacks);

        };

        return this.each(function() {

            $("form[data-widget=editable] button[name=delete]", this).click(deleteClickHandler);

            $("form[data-widget=editable] button[name=delete_cancel]", this).click(function(e) {
                e.preventDefault();
                $(this).closest("[data-id=confirm]").addClass('tsHidden');
            });

            $("form[data-widget=editable] button[name=delete_button]", this).click(function(e) {
                e.preventDefault();
                $(this).closest('form').find('[data-id=confirm]').removeClass('tsHidden');
            });

            $("form[data-widget=editable]", this).submit(function(e) {
                e.preventDefault();
                
                var context = this;
                var callbacks = errorHandler.serviceCallbacksWithContext(this, editSuccess, editError);

                var groups = {
                    Group: [
                        {
                            id: $(this).data('id'),
                            Attribute: $.map($(this).data('fields'), function(item) {
                                var ret = {
                                    id: item.id
                                };
                                if (item.type === 'text') {
                                    ret.value = $("input[name='" + item.name + "']", context).val();
                                } else if (item.type === 'select') {
                                    ret.value = $("[data-name='" + item.name + "']").dropdownVal();
                                }
                                return ret;
                            })
                        }
                    ]
                };

                api[options.saveMethod].call(null, common.orgnr, JSON.stringify(groups), callbacks);

            }).on('editable', function(e, editable) {

                $("button[name=delete], button[name=delete_button]", this).attr('disabled', editable);

            });

            $("form[data-widget=editable] button[type=reset]", this).click(function(e) {
                $(this).closest('form').find('button[type=submit][name=save]').trigger('reset');
            });

        });

    };

    $(function() {


        $("[data-widget=manageDCFGroupTemplates]").each(function() {

            var options = {};
            if ($(this).data('delete-method')) {
                options.deleteMethod = $(this).data('delete-method');
            }
            if ($(this).data('save-method')) {
                options.saveMethod = $(this).data('save-method');
            }
            $(this).manageDCFGroupTemplates(options);

        });

    });


});
