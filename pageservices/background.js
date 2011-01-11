chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    function tabDoneNotify() {
        var notification = webkitNotifications.createNotification(
            "icon.png",
            "Tab is done",
            changeInfo.status);
        notification.show();
    }

    function injectJS() {
        chrome.tabs.executeScript(tabId, {file: "jquery-1.4.4.min.js"});
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

        if (request.data.ping) {
            count = count + 1;
            sendResponse({count: count});
        }

        if (request.data.do) {
            pse_methods[request.data.do](request, sendResponse);
        }
    }
);

pse_methods = {
    registerService: function(request, sendResponse) {
        sendResponse({status: "registered"});
    },
    requestService: function(request, sendResponse) {
        sendResponse({status: "found"});
    },
    callService: function(request, sendResponse) {
        sendResponse({status: "method not found"});
    }
};
