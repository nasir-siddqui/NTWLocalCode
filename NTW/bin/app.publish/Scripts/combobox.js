(function ($) {
	$.widget("custom.combobox", {

		options: {
			regexPrepend: "",
			regexAppend: ""
		},
		_create: function() {
			this.wrapper = $( "<span>" )
			  .addClass( "custom-combobox" )
			  .insertAfter( this.element );
 
			this.element.hide();
			this._createAutocomplete();
			this._createShowAllButton();
		},
 
		_createAutocomplete: function() {
			var selected = this.element.children( ":selected" ),
			  value = selected.val() ? selected.text() : "";
 
			var inputName = this.element.attr('name') + "AutoCompleteTextField";

			this.input = $( "<input>" )
			  .appendTo( this.wrapper )
			  .val( value )
			  .addClass("tseInput custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
              .attr('name', inputName)
			  .autocomplete({
				delay: 0,
				minLength: 0,
				source: $.proxy(this, "_source")
			  })
			  .focus(function () {
			  	$(this).autocomplete("search", "");
			  });

			if (!!this.element.attr('disabled')) {
			    this.input.attr("disabled", true);
			}

		    var inputRef = this.input;
		    $("<i>")
		        .appendTo(this.wrapper)
		        .addClass("combobox-arrow")
		        .click(function() {
		            inputRef.first().trigger("focus");
		        });

		    if (this.element.attr('data-val-required') != null) {
		        this.input.attr('data-val', true);
		        this.input.attr('data-val-required', this.element.attr('data-val-required'));

                /* Find the validation error message element and replace data-valmsg-for to the input textbox. */
		        $(this.wrapper).next("[data-valmsg-for='" + this.element.attr('name') + "']").attr('data-valmsg-for', inputName);

		        $.validator.unobtrusive.parseDynamicContent('form');
		    }
 
		    this._on(this.input, {
				autocompleteselect: function( event, ui ) {
					ui.item.option.selected = true;
					this._trigger( "select", event, {
						item: ui.item.option
					});
					this.element.trigger("select");
				    this.element.trigger("change");
				},
 
				autocompletechange: "_removeIfInvalid"
			});
		},
 
		_createShowAllButton: function() {
			var input = this.input,
			  wasOpen = false;
		},
 
		_source: function( request, response ) {
			var matcher = new RegExp(this.options.regexPrepend + $.ui.autocomplete.escapeRegex(request.term) + this.options.regexAppend, "i");
			response( this.element.children( "option" ).map(function() {
				var text = $( this ).text();
				if ( this.value && ( !request.term || matcher.test(text) ) )
					return {
						label: text,
						value: text,
						option: this
					};
			}) );
		},
 
		_removeIfInvalid: function( event, ui ) {
 
			// Selected an item, nothing to do
			if ( ui.item ) {
				return;
			}
 
			// Search for a match (case-insensitive)
			var value = this.input.val(),
			  valueLowerCase = value.toLowerCase(),
			  valid = false;

		    var elementVar = this.element;
			this.element.children( "option" ).each(function() {
				if ( $( this ).text().toLowerCase() === valueLowerCase ) {
				    this.selected = valid = true;
				    elementVar.trigger("change");
					return false;
				}
			});
 
			// Found a match, nothing to do
			if ( valid ) {
				return;
			}
 
			// Remove invalid value
			this.input.val( "" );
			this.element.val( "" );
			this.input.autocomplete("instance").term = "";
			elementVar.trigger("change");
		},
 
		_destroy: function() {
			this.wrapper.remove();
			this.element.show();
		}
	});

})(jQuery);

$(function () {
    $(".combobox-autocomplete").each(function() {
        var regexPrepend = "";

        var searchFromStartAttr = $(this).attr('search-from-start');
        if (typeof searchFromStartAttr !== typeof undefined && searchFromStartAttr !== false) {
            regexPrepend = "^";
        }

        $(this).combobox({
            regexPrepend: regexPrepend + "(",
            regexAppend: ")"
        });
    });
});