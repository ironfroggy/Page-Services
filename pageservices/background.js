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

        if (request.data.do) {
            pse_methods[request.data.do](request, sendResponse);
        }
    }
);

var services = {
    'shorturl': {
        'shorten': function(params, cb) {
            cb({url: params.url+"?shorter=false"});
        }
    },
    'ping': {
        'ping': function(params, cb) {
            cb({pong: true});
        }
    }
};

var pse_methods = {
    registerService: function(request, sendResponse) {
        sendResponse({status: "registered"});
    },
    requestService: function(request, sendResponse) {
        sendResponse({status: "found"});
    },
    callService: function(request, sendResponse) {
        services[request.data.service][request.data.method](request.data.data, function(response) {
            sendResponse(response);
        });
    }
};

