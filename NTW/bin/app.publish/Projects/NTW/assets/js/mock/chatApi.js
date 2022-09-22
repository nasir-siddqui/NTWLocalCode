(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        window.ChatApi = factory(window.jQuery);
    }

})(function($) {
    
    return {

        getChat: function(id, param) {

            var data = {

                // Attachments is dependent of http://hanghai.got.telia.se:8080/browse/AGORA-1240
                replies: [
                    { 'SenderYou': 'false', 'Name': 'Stefan Liv', 'Date': '2014-01-27 20:13', 'Text': 'Banh mi labore High Life, occaecat semiotics roof party polaroid. Banh mi labore High Life, occaecat semiotics roof party polaroid. Banh mi labore High Life, occaecat semiotics roof party polaroid.'},
                    { 'SenderYou': 'true', 'Name': 'Esa Keskinen', 'Date': '2014-01-28 13:10', 'Text': 'Banh mi labore High Life, occaecat semiotics. Banh mi High Life, occaecat semiotics roof party polaroid. Banh mi labore High Life, occaecat semiotics roof party polaroid.'}
                ]

            };

            // simulate error on id = 1
            if (id === 10) {
                param.errorHandler("ERROR_FETCHING_CHAT");
                return;
            }

            // simulate call
            setTimeout(function() {
                param.callback(data);
            }, 1000);


        },

        saveMessage: function(message, param) {

            var date = new Date();
            var month = date.getMonth()+1;
            if (month < 10) {
                month = "0" + month;
            }
            var now = date.getFullYear() + "-" + month + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

            var data = {
                SenderYou: 'true',
                Name: 'Esa Keskinen',
                Date: now,
                Text: message
            };

            if (!message.length) {
                param.errorHandler("ERROR_FETCHING_CHAT");
                return;
            }

            param.callback(data);
        }

    };

});