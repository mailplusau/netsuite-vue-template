/**
 * @author Tim Nguyen
 * @description NetSuite Experimentation - Test Page
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @created 27/06/2023
 */

// This should be the same file as the one built by webpack. Make sure this matches the filename in package.json
let htmlTemplateFile = 'mp_cl_test_page_tn_v2_vue.html';
const clientScriptFilename = 'mp_cl_test_page_tn_v2_vue.js';
const defaultTitle = 'Test Page';

let NS_MODULES = {};


define(['N/ui/serverWidget', 'N/render', 'N/search', 'N/file', 'N/log', 'N/record', 'N/email', 'N/runtime', 'N/https', 'N/task', 'N/format', 'N/url'],
    (serverWidget, render, search, file, log, record, email, runtime, https, task, format, url) => {
    NS_MODULES = {serverWidget, render, search, file, log, record, email, runtime, https, task, format, url};
    
    const onRequest = ({request, response}) => {
        if (request.method === "GET") {

            if (!_handleGETRequests(request.parameters['requestData'], response)){
                // Render the page using either inline form or standalone page
                // _getStandalonePage(response)
                _getInlineForm(response)
            }

        } else if (request.method === "POST") { // Request method should be POST (?)
            _handlePOSTRequests(JSON.parse(request.body), response);
            // _writeResponseJson(response, {test: 'test response from post', params: request.parameters, body: request.body});
        } else {
            log.debug({
                title: "request method type",
                details: `method : ${request.method}`,
            });
        }

    }

    return {onRequest};
});

// Render the page within a form element of NetSuite. This can cause conflict with NetSuite's stylesheets.
function _getInlineForm(response) {
    let {serverWidget, render, file} = NS_MODULES;
    
    // Create a NetSuite form
    let form = serverWidget.createForm({ title: defaultTitle });

    // Then create form field in which we will render our html template
    let htmlField = form.addField({
        id: "custpage_html",
        label: "html",
        type: serverWidget.FieldType.INLINEHTML,
    });
    
    const pageRenderer = render.create();
    const htmlFileData = _getHtmlTemplate(htmlTemplateFile);
    const htmlFile = file.load({ id: htmlFileData[htmlTemplateFile].id });
    pageRenderer.templateContent = htmlFile.getContents();
    htmlField.defaultValue = pageRenderer.renderAsString();

    // Retrieve client script ID using its file name.
    form.clientScriptFileId = _getHtmlTemplate(clientScriptFilename)[clientScriptFilename].id;

    response.writePage(form);
}

// Render the htmlTemplateFile as a standalone page without any of NetSuite's baggage. However, this also means no
// NetSuite module will be exposed to the Vue app. Thus, an api approach using Axios and structuring this Suitelet as
// a http request handler will be necessary. For reference:
// https://medium.com/@vladimir.aca/how-to-vuetify-your-suitelet-on-netsuite-part-2-axios-http-3e8e731ac07c
function _getStandalonePage(response) {
    let {render, file} = NS_MODULES;

    // Create renderer to render our html template
    const pageRenderer = render.create();

    // Get the id and url of our html template file
    const htmlFileData = _getHtmlTemplate(htmlTemplateFile);

    // Load the  html file and store it in htmlFile
    const htmlFile = file.load({
        id: htmlFileData[htmlTemplateFile].id
    });

    // Load the content of the html file into the renderer
    pageRenderer.templateContent = htmlFile.getContents();

    response.write(pageRenderer.renderAsString());
}

// Search for the ID and URL of a given file name inside the NetSuite file cabinet
function _getHtmlTemplate(htmlPageName) {
    let {search} = NS_MODULES;

    const htmlPageData = {};

    search.create({
        type: 'file',
        filters: ['name', 'is', htmlPageName],
        columns: ['name', 'url']
    }).run().each(resultSet => {
        htmlPageData[resultSet.getValue({ name: 'name' })] = {
            url: resultSet.getValue({ name: 'url' }),
            id: resultSet.id
        };
        return true;
    });

    return htmlPageData;
}


function _handleGETRequests(request, response) {
    if (!request) return false;

    let {log} = NS_MODULES;

    try {
        let {operation, requestParams} = JSON.parse(request);

        if (!operation) throw 'No operation specified.';

        if (!getOperations[operation]) throw `Operation [${operation}] is not supported.`;

        getOperations[operation](response, requestParams);
    } catch (e) {
        log.debug({title: "_handleGETRequests", details: `error: ${e}`});
        _writeResponseJson(response, {error: `${e}`})
    }

    return true;
}

function _handlePOSTRequests({operation, requestParams}, response) {
    let {log} = NS_MODULES;

    try {
        if (!operation) throw 'No operation specified.';

        // _writeResponseJson(response, {source: '_handlePOSTRequests', operation, requestParams});
        postOperations[operation](response, requestParams);
    } catch (e) {
        log.debug({title: "_handlePOSTRequests", details: `error: ${e}`});
        _writeResponseJson(response, {error: `${e}`})
    }
}

function _writeResponseJson(response, body) {
    response.write({ output: JSON.stringify(body) });
    response.addHeader({
        name: 'Content-Type',
        value: 'application/json; charset=utf-8'
    });
}

const getOperations = {

}

const postOperations = {

};

function _parseIsoDatetime(dateString) {
    let dt = dateString.split(/[: T-]/).map(parseFloat);
    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
}

function _parseISODate(dateString) {
    let dt = dateString.split(/[: T-]/).map(parseFloat);
    return new Date(dt[0], dt[1] - 1, dt[2]);
}

function _getLocalTimeFromOffset(localUTCOffset) {
    let today = new Date();
    let serverUTCOffset = today.getTimezoneOffset();

    let localTime = new Date();
    localTime.setTime(today.getTime() + (serverUTCOffset - parseInt(localUTCOffset)) * 60 * 1000);

    return localTime;
}