/**
 * @author Tim Nguyen
 * @description NetSuite Experimentation - Test Page.
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @created 27/06/2023
 */

let modules = {};

const moduleNames = ['error', 'runtime', 'search', 'record', 'url', 'format', 'email', 'currentRecord'];

// eslint-disable-next-line no-undef
define(moduleNames.map(item => 'N/' + item), (...args) => {
        for (let [index, moduleName] of moduleNames.entries())
            modules[moduleName] = args[index];

        function pageInit() {
            console.log('Client script init.');

            let baseUrl = window.location.href.split('?')[0];
            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });

            const paramsBuilder = new URLSearchParams({
                script: params['script'], deploy: params['deploy'],
                requestData: JSON.stringify({operation: 'getIframeContents'}),
            });

            fetch(baseUrl + '?' + paramsBuilder.toString(), {
                method: 'get'
            })
                .then(res => res.json())
                .then(jsonData => {
                    console.log(jsonData);
                    let iFrameID = document.getElementById('mainContentIframe');
                    iFrameID.srcdoc = jsonData;
                })
                .catch(err => {
                    console.log(err);
                });
        }

        return { pageInit };
    }
);

// eslint-disable-next-line no-unused-vars
function _getClientModules() {
    return modules;
}

function iframeLoaded(height) {
    let iFrameID = document.getElementById('mainContentIframe');
    if(iFrameID) {
        // here you can make the height, I delete it first, then I make it again
        let targetHeight = iFrameID.contentWindow.document.body.scrollHeight + 100;
        iFrameID.height = "";
        iFrameID.height = height || targetHeight + "px";
    }
}