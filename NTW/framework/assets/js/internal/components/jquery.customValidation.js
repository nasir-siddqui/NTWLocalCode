/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.validate.min'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {


    $.validator.addMethod("personnummer", function(value) {
        var info = value.match(/((\d)(\d)(\d)(\d))((\d)(\d))((\d)(\d))\-(\d)(\d)(\d)(\d)/);
        if (info) {
            // check that the date is ok
            var year = parseInt(info[1], 10);
            var month = parseInt(info[6], 10) - 1;
            var day = parseInt(info[9], 10);

            var d = new Date(year, month, day);
            if (!(d.getFullYear() === year && d.getMonth() === month && d.getDate() === day)) {
                return false;
            }

            // check that the numbers are valid
            var numbers = $.map($.grep(info, function(item, index) { return index > 3 && index !== 6 && index !== 9; }), function(item) { return parseInt(item, 10); });
            
            var checksum = 0;
            $.each(numbers, function(index, item) {
                var sum = item * (index % 2 === 0 ? 2 : 1);
                checksum += sum > 9 ? 1 + sum - 10 : sum;
            });
            return checksum % 10 === 0;

        }
        return false;
    });

    $.fn.customValidation = function() {

        return this.each(function() {

            var $form = $(this);

            var options = {
                rules: {},
                messages: {}
            };

            if ($(this).data('validate-container')) {
                options.errorLabelContainer = $($(this).data('validate-container'), this);
            }

            if ($(this).data('validate-element')) {
                options.errorElement = $(this).data('validate-element');
            }

            var status = { };

            var checkStatus = function() {
                
                var errors = $.grep(Object.keys(status), function(item) { return !status[item]; });
                $("input[type=submit]", $form).attr('disabled', errors.length > 0);

            };

            var inputs = $("[data-rules]", this).each(function() {

                var $this = $(this);
                var name = $this.attr('name');
                options.rules[name] = { };
                options.messages[name] = { };
                
                // set the initial status as failed, perhaps this needs to be updated
                status[name] = false;

                var rules = $(this).data('rules').split(" ");
                $.each(rules, function(index, item) {
                    var message = $this.data('message-' + item) || $this.attr('title');
                    options.rules[name][item] = true;
                    options.messages[name][item] = message;
                });

            });

            $(this).validate(options);

            // inputs.keyup(function(e) {
            //     console.log(this, inputs, inputs.filter('.valid'));
            // });

            // hijack the highlight and unhighlight functions
            var validator = $(this).data('validator');
            var _highlight = validator.settings.highlight;
            var _unhighlight = validator.settings.highlight;
            validator.settings.highlight = function() { _highlight.apply(this, arguments); status[arguments[0].name] = false; checkStatus(); };
            validator.settings.unhighlight = function() { _unhighlight.apply(this, arguments); status[arguments[0].name] = true; checkStatus(); };

            // check the initial status
            checkStatus();

            window.validator = validator;

        });

    };

    $("[data-toggle=validate]").customValidation();

});