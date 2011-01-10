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
