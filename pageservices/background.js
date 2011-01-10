chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    function tabDoneNotify() {
        var notification = webkitNotifications.createNotification(
            "icon.png",
            "Tab is done",
            changeInfo.status);
        notification.show();
    }

    function injectJS() {
        chrome.tabs.executeScript(tabId, {file: "injection.js"});
    }

    console.log(changeInfo.status);

    if (changeInfo.status === "complete") {
        injectJS();
    }
});

var count = 0;
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        console.log("ping received");

        if (request.ping) {
            count = count + 1;
            sendResponse({count: count});
        }
    }
);
var PSE = {};
