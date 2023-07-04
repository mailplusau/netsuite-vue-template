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
        let targetHeight = iFrameID.contentWindow.document.body.scrollHeight + 10;
        iFrameID.height = "";
        iFrameID.height = height || targetHeight + "px";
    }
}

function setMPTheme() {
    let styles = `
        div#body {
            background-color: #cfe0ce !important;
        }
        
        ul#NS_MENU_ID0, ul#NS_MENU_ID0 > .ns-menuitem > a {
            background-color: #cfe0ce !important;
        }
        
        ul.pagination.b-pagination, ul.nav.nav-tabs {
            display: flex !important;
            padding-left: 0 !important;
            list-style: none !important;
            margin: 0 !important;
        }
    `

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
}

function getCurrentNetSuiteUrl() {
    return location.href
}