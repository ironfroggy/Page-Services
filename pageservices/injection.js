function test() {
    window.x = 10;
};
test();

var PSE = {};

PSE.ping = function() {
    chrome.extension.sendRequest({ping: 1}, function(response) {
        console.log(response.count);
    });
};

window.addEventListener('pseRequest', function(ev) {
    var pse_request_params = JSON.parse($(document.body).attr('data-__PSE_DATA'));
    var data = pse_request_params.data;
    var callback_id = pse_request_params.callback_id;

    chrome.extension.sendRequest({data:data}, function(resp) {

        $(document.body).attr('data-__PSE_CALLBACK_ID', callback_id);
        $(document.body).attr('data-__PSE_DATA', JSON.stringify(resp));
        var ev = document.createEvent("Events");
        ev.initEvent("pseResponse", false, true);
        window.dispatchEvent(ev);

    });
}, false, true);

$(document.body).append('<script type="text/javascript">'+
'var PSE={'+
'_requestCallbacks: {},'+
'_nextCallbackID: 0,'+
'_sendRequest: function(data, callback) {'+
'   document.body.setAttribute("data-__PSE_DATA", JSON.stringify({data:data, callback_id:PSE._nextCallbackID}));'+
'   PSE._requestCallbacks[PSE._nextCallbackID] = callback;'+
'   PSE._nextCallbackID = PSE._nextCallbackID + 1;'+
'   var ev=document.createEvent("Events");'+
'   ev.initEvent("pseRequest", false, true);'+
'   window.dispatchEvent(ev);'+
'},'+

'registerService: function(service, url, cb) { PSE._sendRequest({do: "registerService", service:service, url:url}, cb); },'+
'requestService: function(service, cb) { PSE._sendRequest({do: "requestService", service:service}, cb); },'+
'callService: function(service, method, data, cb) { PSE._sendRequest({do: "callService", service:service, method:method, data:data}, cb); },'+

'};'+
'window.addEventListener("pseResponse", function(ev) {'+
'   var response = JSON.parse(document.body.getAttribute("data-__PSE_DATA"));'+
'   var callback_id = document.body.getAttribute("data-__PSE_CALLBACK_ID");'+
'   PSE._requestCallbacks[callback_id](response);'+
'   delete PSE._requestCallbacks[callback_id];'+
'});'+
'</script>');
