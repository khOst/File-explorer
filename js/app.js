'use strict';

const API_URL = './api/files.json';

init();

/**
 * Runs the app
 */
function init() {
    getData(API_URL)
        .then(JSONData => buildTree(JSONData))
        .then(() => initMenu())
        .catch(error => console.log('Failed to fetch.', error));
}