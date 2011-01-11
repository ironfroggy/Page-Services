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

window.addEventListener('ping', function() {
    PSE.ping();
}, false, true);

$(document.body).append('<script type="text/javascript">'+
'var PSE={ping:function(){var ev=document.createEvent("Events");ev.initEvent("ping", false, true);window.dispatchEvent(ev);}};'+
'</script>');
