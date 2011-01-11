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
    console.log(JSON.parse($(document.body).attr('data-__PSE_DATA')));
    PSE.ping();
}, false, true);

$(document.body).append('<script type="text/javascript">'+
'var PSE={'+
'_sendRequest:function(data){document.body.setAttribute("data-__PSE_DATA", JSON.stringify(data));var ev=document.createEvent("Events");ev.initEvent("pseRequest", false, true);window.dispatchEvent(ev);}'+
'};'+
'</script>');
