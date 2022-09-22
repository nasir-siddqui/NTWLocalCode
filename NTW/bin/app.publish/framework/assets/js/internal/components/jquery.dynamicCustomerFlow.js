/*global define, Implementations*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'service/adamApi', 'helpers/serviceErrorHandling', 'elements/jquery.dropdown'], factory);
    } else if (window.jQuery && typeof dwr !== "undefined") {
        factory(window.jQuery, dwr.engine._getObject("com.teliasonera.agora.corp.order.flow.api.AdamService-1.0.0.SNAPSHOT"), window.ErrorHandler);
    }

})(function($, adamApi, errorHandler) {

    $.fn.serviceErrendFlow = function() {
        $(this).each(function(){

            var identifier, action, proposal;
            var questions = [];


            var drawAndInitAllDropdowns = function(selectElement) {
                selectElement.initDropdown();  
            };

            var displayError = function(errorMessage){
                var message = errorMessage;
                if (message === undefined || message === ""){
                    message = "Ett fel uppstod."
                }
                $(".tsDynamicCustomerFlow-loadingBlock").remove();
                var stepBlock = $("<div />").appendTo(".tsDynamicCustomerFlow-content").addClass("tsInlineFeedback").show();
                stepBlock.attr("data-id", "error");
                $("<div />").addClass("tsInlineFeedback-error").text(errorMessage).appendTo(stepBlock);
            };

            var addServiceErrendStep = function(responseEvent){
                $(".tsDynamicCustomerFlow-loadingBlock").remove();
                removeProposal();
                if (responseEvent.proposals !== undefined && responseEvent.proposals.length > 0){
                    addServiceProposalBlock(responseEvent.proposals[0]);
                } else {
                    addServiceQuestionBlock(responseEvent);
                }
            };

            var addServiceQuestionBlock = function(responseEvent){
                addQuestion(responseEvent.question);
                var stepBlock = $("<div />").appendTo(".tsDynamicCustomerFlow-content").addClass("tsDynamicCustomerFlow-block");
                stepBlock.attr("data-id", responseEvent.question.name);

                // Title
                var titleElement = $("<h3 />").text(responseEvent.question.text);
                $("<div />").appendTo(stepBlock).addClass("tsDynamicCustomerFlow-intro").append(titleElement);

                var isSelectComponent = responseEvent.question.alternatives.length > 0;
                var formElement;
                if (isSelectComponent){
                    formElement = createSelectComponent(responseEvent);
                } else {
                    formElement = $("<input />").addClass("tseInput").attr("name", responseEvent.question.name);
                }

                // Submit button
                var submitButton = $("<input />").attr("type", "submit").val("Nästa").addClass("tseSubmit").addClass("tseSubmit--turq");
                submitButton.click(function(){
                    var answerValue = stepBlock.find("span.tseDropdown-selected").attr("data-value");
                    if (isSelectComponent){
                        var answerValue = stepBlock.find("span.tseDropdown-selected").attr("data-value");
                    } else {
                        var answerValue = stepBlock.find("input[name='"+responseEvent.question.name+"']").val();
                    }
                    var questionName = stepBlock.attr("data-id");
                    answerServiceErrendFlow(responseEvent, answerValue, questionName);
                });

                stepBlock.append(formElement);
                stepBlock.append(submitButton);

                if (isSelectComponent){
                    drawAndInitAllDropdowns(formElement);
                }
            };

            var createSelectComponent = function(responseEvent){
                var selectElement = $("<select />").addClass("tseSelectDropdown");
                for(var i=0; i<responseEvent.question.alternatives.length; i++){
                    var alternativeValue = responseEvent.question.alternatives[i].text;
                    $("<option />").val(alternativeValue).text(alternativeValue).appendTo(selectElement);    
                    if (i === 1){
                        selectElement.attr("data-placeholder", "Välj");
                    }
                }
                return selectElement;
            };

            var addServiceProposalBlock = function(responseProposal){
                proposal = responseProposal;
                var stepBlock = $("<div />").appendTo(".tsDynamicCustomerFlow-content").addClass("tsDynamicCustomerFlow-block");
                stepBlock.attr("data-id", proposal.name);

                // Title
                var titleElement = $("<h3 />").text("Förslag:");
                $("<div />").appendTo(stepBlock).addClass("tsDynamicCustomerFlow-intro").append(titleElement);

                // Step block
                var link = $("<a />").attr("href", proposal.linkURL).text(proposal.text);
                stepBlock.append($("<p />").append(link));
            };

            var answerServiceErrendFlow = function(responseEvent, answerValue, questionName){
                $(".tsDynamicCustomerFlow-content").append("<div class='tsDynamicCustomerFlow-loadingBlock'><div class='tsLoading-icon'></div></div>");
                removeTrailingQuestions(questionName);
                removeProposal();
                removeFeedback();
                if (answerValue === ""){
                    displayError("Ange ett svarsalternativ.");
                    return; 
                }

                var answer = {
                    text: answerValue
                };
                var answeredQuestion = getQuestion(questionName);
                answeredQuestion.answered = true;
                answeredQuestion.answer = answer;
                action.questions = [
                    answeredQuestion
                ];


                //adamApi.ask(identifier, action, {callback: addServiceErrendStep, errorHandler: displayError});
                var callbackFunctions = errorHandler.serviceCallbacks(addServiceErrendStep, displayError);
                adamApi.ask(identifier, action, callbackFunctions);
            };

            var initServiceErrendFlow = function(){
                var uniqueIdVal = $(".tsDynamicCustomerFlow-form").find("input[name='uniqueId']").val();
                var flowIdVal = $(".tsDynamicCustomerFlow-form").find("input[name='flowId']").val();


                identifier = {
                    uniqueId:uniqueIdVal,
                    flowId:flowIdVal
                };
                  
                action = {
                    mainProduct:flowIdVal,
                    questions:[]
                };

                //adamApi.ask(identifier, action, {callback: addServiceErrendStep, errorHandler: displayError});
                var callbackFunctions = errorHandler.serviceCallbacks(addServiceErrendStep, displayError);
                adamApi.ask(identifier, action, callbackFunctions);
            };


            var getQuestion = function(questionName){
                for(var i=0; i<questions.length; i++){
                    if (questions[i].name === questionName){
                        return questions[i];
                    }
                }
            };

            var addQuestion = function(question){
                for(var i=0; i<questions.length; i++){
                    if (questions[i].name === question.name){
                        questions[i] = question;
                        removeTrailingQuestions(question.name);
                        return;
                    }
                }
                questions[questions.length] = question;
            };

            var removeTrailingQuestions = function(questionName){
                var removedQuestions = [];
                for(var i=0; i<questions.length; i++){
                    if (questions[i].name === questionName){
                        removedQuestions = questions.splice(i+1);
                        break;
                    }
                }
                //alert("Removing list" + removedQuestions.length);
                for(var i=0; i<removedQuestions.length; i++){
                    $(".tsDynamicCustomerFlow-content .tsDynamicCustomerFlow-block[data-id='"+removedQuestions[i].name+"']").remove();
                }
            };

            var removeProposal = function(){
                if (proposal !== undefined){
                    $(".tsDynamicCustomerFlow-content .tsDynamicCustomerFlow-block[data-id='"+proposal.name+"']").remove();
                    proposal = undefined;
                }
            };

            var removeFeedback = function(){
                $(".tsDynamicCustomerFlow-content .tsInlineFeedback[data-id='error']").remove();
            };

            initServiceErrendFlow();
        });
    };

});