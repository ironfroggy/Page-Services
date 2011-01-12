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
        console.log("request to background:", request);
        if (request.data.do) {
            pse_methods[request.data.do](request, sender, sendResponse);
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
    registerService: function(request, sender, sendResponse) {
        sendResponse({status: "registered"});
    },
    requestService: function(request, sender, sendResponse) {
        console.log(sender, "requested service", request.data.service);
        chrome.pageAction.show(sender.tab.id);
        addServiceIFrame(request.data.service);
        sendResponse({status: "found"});
    },
    callService: function(request, sender, sendResponse) {
        services[request.data.service][request.data.method](request.data.data, function(response) {
            sendResponse(response);
        });
    }
};

var service_urls = {
    "echo": "/echo.html"
};
function addServiceIFrame(service) {
    var iframe = getServiceIFrame(service);
    if (iframe === undefined) {
        $(document.body).append('<iframe src="' + service_urls[service] + '" id="service_frame-' + service + '" />');
        //window.setTimeout(0, function(){
        //    iframe = getServiceIFrame(service);
        //    iframe.contentWindow.postMessage({do: "pse_init"}, "*");
        //});
    }
};
function getServiceIFrame(service) {
    return $('#service_frame-'+service)[0];
};

var pse_service_callback_id = 0;
var pse_service_callbacks = {};
window.addEventListener("message", function(ev) {
    var data = JSON.parse(ev.data);
    console.log(data);
    if (data.do === "provideService") {
        if (typeof services[data.service] === "undefined") {
            services[data.service] = {};
        }
        services[data.service][data.method] = function(params, cb) {
            getServiceIFrame(data.service).contentWindow.postMessage(JSON.stringify({do: "pse_call", method: data.method, params: params, callback_id: pse_service_callback_id}), "*");
            pse_service_callbacks[pse_service_callback_id] = function(params) {
                cb(params);
            }
            pse_service_callback_id = pse_service_callback_id + 1;
        }
    } else if (data.do === "return") {
        pse_service_callbacks[data.callback_id](data.params);
        delete pse_service_callbacks[data.callback_id];
    }
}, false);
