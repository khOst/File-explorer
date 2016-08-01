'use strict';

/**
 * Removes the node and all of its children
 * @param node Node to be removed
 */
function removeItem(node) {
    node.parentNode.remove();
}

/**
 * Adds the file to DOM.
 * If clicked on a file node, appends file to its parent.
 * If clicked on a folder node, appends file inside of it.
 * @param node Reference node
 */
function addFile(node) {
    const newElement = {
        'type': 'file',
        'path': 'path/to/file'
    };
    const li = createTreeItem(newElement);

    if (!li) {
        return false;
    }
    if (node.parentElement.children.length === 1) {
        node.parentElement.parentElement.appendChild(li);
    } else {
        node.parentElement.lastElementChild.appendChild(li);
    }
}

/**
 * Adds the folder to DOM.
 * If clicked on a file node, appends folder to its parent.
 * If clicked on a folder node, appends folder inside of it.
 * @param node Reference node
 */
function addFolder(node) {
    const newElement = {
        'type': 'folder',
        'path': 'path/to/folder',
        'children': []
    };
    const li = createTreeItem(newElement);

    if (!li) {
        return false;
    }

    if (node.parentElement.children.length === 1) {
        node.parentElement.parentElement.appendChild(li);
    } else {
        node.parentElement.lastElementChild.appendChild(li);
    }
}