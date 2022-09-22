/*global define*/
    
define([], function() {
    return {
        ask: function(identifier, action, callback){
            var mockedDelayFn = function(){
                var returnEvent = {
                    question:{
                        name: "q1",
                        text: "Fråga nr 1",
                        answered: false,
                        alternatives:[
                            {
                                text: "Svarsalternativ nummer ett, lorem ipsum dolor sit"
                            },
                            {
                                text: "Svar nr 2"
                            }
                        ],
                    }
                };
                if (action.questions.length > 0){
                    if (action.questions[0].name === "q1"){
                        returnEvent.question.name = "q2";
                        returnEvent.question.text = "Fråga nr 2";
                    } else if (action.questions[0].name === "q2"){
                        returnEvent.question.name = "q3";
                        returnEvent.question.text = "Fråga nr 3";
                        returnEvent.question.alternatives = [];
                    } else {
                        returnEvent.proposals = [
                            {
                                name:"proposal1",
                                text:"Lorem ipsum",
                                linkURL: "http://www.google.se"
                            }
                        ];
                    }
                }

                var callbackSuccess = callback;
                var callbackError = function(){
                    alert("An error occurred.");
                };
                if (typeof callback === "object"){
                    callbackSuccess = callback.callback;
                    callbackError = callback.errorHandler;
                }
                callbackError("AGORA_ERROR_COMMON_ERRORWITHPARAMETER");

                //callbackSuccess(returnEvent);
            };
            setTimeout(
                mockedDelayFn,
                500
            );
        }
    };

});
