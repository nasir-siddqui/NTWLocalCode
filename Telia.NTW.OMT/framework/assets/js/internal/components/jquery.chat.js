(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'modules/collapser', 'service/chatApi', 'helpers/serviceErrorHandling', 'modules/jquery.addFile'], factory);
    } else {
        factory(window.jQuery, window.Collapser, window.ChatApi, window.ErrorHandling);
    }

})(function($, Collapser, api, errorHandler) {


    $.fn.chat = function() {

        var _this = this;

        // displays an error in the area
        var displayError = function(message) {
        };

        // displays the priceinformation in the area
        var displayChat = function(data) {

            // create the fetched data
            $(this).empty().append(
                $("<ul />", { "class": "tscList tscList--gutter tsPaddingBottom--doubleGutter" }).append(
                    $.map(data.replies, function(reply, i) {
                        var senderYou = "";
                        var close = "";
                        if (reply.SenderYou === "true") {
                            senderYou = " fontColor-purple";
                        }
                        if (i === 0) {
                            close = $("<span />", { "class": "tsClose tsSecondaryLink"}).text("Close");
                        }
                        return $("<li />", { "class": "tsBorderBottom tsPaddingBottom row"}).append(
                            close,
                            $("<div />", { "class": "col-md-3" }).append(
                                $("<div />", { "class": "tscIconHeadline tscIconHeadline--small" }).append(
                                    $("<div />", { "class": "tscIconBackground" }).append(
                                        $("<i />", { "class": "tsIcon-Mobile" })
                                    ),
                                    $("<h3 />", { "class": "h3" + senderYou }).text(reply.Name).append(
                                        $("<span />", { "class": "tscLabel" }).text(reply.Date)
                                    )
                                )
                            ),
                            $("<div />", { "class": "col-md-8"}).text(reply.Text)
                        );
                    }),
                    $("<li />", { "class": "row"}).append(
                        $("<div />", { "class": "tscForm-row tscForm-row--halfGutter"}).append(
                            $("<h3 />", { "class": "h2 col-md-3"}).text("Create a reply"),
                            $("<form />", { "class": "col-md-8 tscForm--appendItem", "data-widget": "addFile", "data-file-container": ".tscForm-appendArea", "data-file-input": ".tscHiddenInput"}).append(
                                $("<textarea />", { "class": "tseTextarea"}),
                                $("<div />", { "class": "tscForm-appendArea"}).append(
                                    $("<div />", { "class": "tscIconLink tscIconLink--turq"}).append(
                                        $("<input />", { "class": "tscHiddenInput", type: "file", "tabindex": "-1"}),
                                        $("<div />", { "class": "tscIconBackground"}).append(
                                            $("<i />", { "class": "tsIcon-Add"})
                                        ),
                                        $("<span />", {"class": "tscLabel"}).text("Add a document")
                                    )
                                ),
                                $("<input />", { "class": "tseSubmit tseSubmit--turq", type: "submit", "value": "Reply" }).click(reply)
                            )
                        )
                    )
                )
            ).hide().slideDown();
            _this.resize();
            _this.find("[data-widget*='addFile']").addFile();
        
        };


        // Add a message
        var addMessage = function(message) {
            var thisContext = this;
            var li = $("<li />", { "class": "tsBorderBottom tsPaddingBottom row"}).append(
                        $("<div />", { "class": "col-md-3" }).append(
                            $("<div />", { "class": "tscIconHeadline tscIconHeadline--small" }).append(
                                $("<div />", { "class": "tscIconBackground" }).append(
                                    $("<i />", { "class": "tsIcon-Mobile" })
                                ),
                                $("<h3 />", { "class": "h3 fontColor-purple" }).text(message.Name).append(
                                    $("<span />", { "class": "tscLabel" }).text(message.Date)
                                )
                            )
                        ),
                        $("<div />", { "class": "col-md-8"}).text(message.Text)
                    );
            li.insertBefore(thisContext);
        };


        var reply = function(e) {
            e.preventDefault();
            var form = $(this).closest("form");
            var li = form.closest("li");
            var message = form.find("textarea").val();
            form.find("textarea").val('');
            var cb = errorHandler.serviceCallbacksWithContext(li, addMessage, displayError);
            api.saveMessage(message, cb);

        };


        return this.each(function() {

            $(this).on('chat', function(e, arg) {

                var cb = errorHandler.serviceCallbacksWithContext(e.target, displayChat, displayError, [arg]);
                api.getChat(arg, cb);

            });

        });

    };

    $("[data-toggle='chat']").each(function() {
        $(this).chat();
    });

});