define(['require'], function(require) {
   
    console.log('DWRWRAPPER: init');

    var apis = {};
    var maxCalls = 10;
    var queue = [];
    var calls = 0;

    var addToQueue = function(obj) {
        queue.push(obj);
        console.log("DWRWRAPPER: Queue:", obj, queue.length);
        makeCall();
    };

    var makeCall = function() {
        if (!queue.length)
            return;
        if (calls >= maxCalls) {
            console.log("DWRWRAPPER: Calls larger than:", maxCalls);
            return;
        }
        var obj = queue.pop();
        calls++;
        console.log("DWRWRAPPER: MakeCall:", obj, calls);
        var args = obj.args.slice();
        args.push({ callback: function(data) {
            obj.callback.callback(data);
            calls--;
            makeCall();
        }, errorHandler: function(message) {
            obj.callback.errorHandler(message);
            calls--;
            makeCall();
        }});
        obj.api[obj.method].apply(obj.api, args);
    };

    return {

        $call: function(api, method) {

            var args = [].slice.call(arguments).splice(2);
            var callback = args.pop();

            if (!apis[api]) {
                require(["service/" + api], function(apiObject) {
                    apis[api] = apiObject;
                    addToQueue({ api: apiObject, method: method, args: args, callback: callback });
                });
            } else {
                addToQueue({ api: apis[api], method: method, args: args, callback: callback });
            }

        }

    };

});