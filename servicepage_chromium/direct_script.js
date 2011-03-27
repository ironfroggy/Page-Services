var PSE = {
    _requestCallbacks: {},
    _nextCallbackID: 0,
    _sendRequest: function(data, callback) {
       document.body.setAttribute("data-__PSE_DATA", JSON.stringify({data:data, callback_id:PSE._nextCallbackID}));
       PSE._requestCallbacks[PSE._nextCallbackID] = callback;
       PSE._nextCallbackID = PSE._nextCallbackID + 1;
       var ev=document.createEvent("Events");
       ev.initEvent("pseRequest", false, true);
       window.dispatchEvent(ev);
    },

    registerService: function(service, url, cb) {
        PSE._sendRequest({do: "registerService", service:service, url:url}, cb);
    },
    requestService: function(service, cb) {
        PSE._sendRequest({do: "requestService", service:service}, cb);
    },
    callService: function(service, method, data, cb) {
        PSE._sendRequest({do: "callService", service:service, method:method, data:data}, cb);
    }
};

window.addEventListener("pseResponse", function(ev) {
   var response = JSON.parse(document.body.getAttribute("data-__PSE_DATA"));
   var callback_id = document.body.getAttribute("data-__PSE_CALLBACK_ID");
   PSE._requestCallbacks[callback_id](response);
   delete PSE._requestCallbacks[callback_id];
});
