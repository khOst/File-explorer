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

/**
 * Fetches data from JSON file
 * @param {String} url Reference to JSON file
 * @returns {Object} Promise
 */
function getData(url) {
    return fetch(url)
        .then(responseObj =>
            responseObj.json());
}

/**
 * Appends tree of files to DOM
 * @param data Array of files and folders
 */
function buildTree(data) {
    const tree = document.getElementById('tree');
    const treeFragment = document.createDocumentFragment();

    buildTreeLevel(data, treeFragment);
    tree.appendChild(treeFragment);
}

/**
 * Initialises menu
 */
function initMenu() {
    contextListener();
    clickListener();
    bindKeyupListener();
    resizeListener();
}



