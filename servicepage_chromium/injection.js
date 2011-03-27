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

window.addEventListener("message", function(ev) {
    var data = JSON.parse(ev.data);
    console.log(data)
    if (data.do == "inject_direct_script") {
        $('body').append('<script type="text/javascript">'+
            data.data+
        '</script>');
    }
});

chrome.extension.sendRequest(
    {
        data: {
            do: "get_direct_script"
        }
    },
    function(resp) { 
        $('body').append('<p>injected...</p>');
    }
);

