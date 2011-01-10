function test() {
    window.x = 10;
};
test();

chrome.extension.sendRequest({ping: 1}, function(response) {
    console.log(response.count);
});
