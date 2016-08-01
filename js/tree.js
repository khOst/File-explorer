'use strict';

/**
 * Recursively builds file structure
 * @param data Array of files and folders
 * @param parentElement Node, data appends to
 */
function buildTreeLevel(data, parentElement) {
    data.forEach(dataElement => {
        const node = createTreeItem(dataElement);

        parentElement.appendChild(node);
        if (dataElement.children) {
            buildTreeLevel(dataElement.children, node.lastElementChild); //TODO ul shold be last child in li.children
        }
    });
}

/**
 * Takes object and returns a node
 * @param {Object} dataElement
 * @returns {Node} A node represents an dataElement of a tree
 */
function createTreeItem(dataElement) {
    const li = document.createElement('li');
    const span = document.createElement('span');

    span.classList.add('tree-item');

    if (dataElement.type === 'folder') {
        const input = document.createElement('input');
        const ul = document.createElement('ul');

        input.setAttribute('type', 'checkbox');
        input.setAttribute('checked', 'checked');
        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(ul);
    } else {
        li.appendChild(span);
    }

    if (!dataElement.name) {
        dataElement.name = prompt('Please, enter name (not empty).', 'index');
        
        if (!dataElement.name) {
            return null;
        }
    }
    span.innerHTML = dataElement.name;
    return li;
}