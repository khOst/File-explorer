'use strict';

/**
 * First-level functions getData, buildTree, initMenu
 */

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
 * @param dataObject Array of files and folders
 */
function buildTree(dataObject) {
    const tree = document.getElementById('tree');
    const treeFragment = document.createDocumentFragment();

    buildTreeLevel(dataObject, treeFragment);
    tree.appendChild(treeFragment);
}

/**
 * Initialise our application's code.
 */
function initMenu() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
}

//////////////////////////////////////////////
///////////////// Explorer ///////////////////
//////////////////////////////////////////////
/**
 * Recursively builds file structure
 * @param dataObject Array of files and folders
 * @param parentElement Node, dataObject appends to
 */
function buildTreeLevel(dataObject, parentElement) {
    dataObject.forEach(dataElement => {
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

    while (!dataElement.name) {
        dataElement.name = prompt('Please, enter name (not empty).', 'index');
    }
    span.innerHTML = dataElement.name;
    return li;
}

//////////////////////////////////////////////
///////////////// MENU ///////////////////////
//////////////////////////////////////////////
/**
 * Variables.
 */
const menu = document.getElementById('menu');
const menuLinkClassName = 'menu-link';
const menuActiveClassName = 'menu-active';
const itemClassName = 'tree-item';
const itemActiveClassName = 'item-active';

let itemInContext;
let menuState = 0;

/**
 * Function to check if we clicked inside an element with a particular class
 * name.
 *
 * @param {Object} e The event
 * @param {String} className The class name to check against
 * @return {Boolean}
 */
function clickInsideElement(e, className) {
    let el = e.srcElement || e.target;

    if (el.classList.contains(className)) {
        return el;
    } else {
        while (el = el.parentNode) {
            if (el.classList && el.classList.contains(className)) {
                return el;
            }
        }
    }

    return false;
}

/**
 * Get's exact position of event.
 *
 * @param {Object} e The event passed in
 * @return {Object} Returns the x and y position
 */
function getPosition(e) {
    let posx = 0;
    let posy = 0;

    if (!e) e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
        x: posx,
        y: posy
    }
}

/**
 * Listens for contextmenu events.
 */
function contextListener() {
    document.addEventListener('contextmenu', function (e) {
        toggleMenuOff();
        itemInContext = clickInsideElement(e, itemClassName);

        if (itemInContext) {
            e.preventDefault();
            toggleMenuOn();
            positionMenu(e);
        } else {
            itemInContext = null;
        }
    });
}

/**
 * Listens for click events.
 */
function clickListener() {
    document.addEventListener('click', function (e) {
        const clickedElIsLink = clickInsideElement(e, menuLinkClassName);

        if (clickedElIsLink) {
            e.preventDefault();
            menuItemListener(clickedElIsLink);
        } else {
            const button = e.which || e.button;

            if (button === 1) {
                toggleMenuOff();
            }
        }
    });
}

/**
 * Listens for keyup events
 */
function keyupListener() {
    window.onkeyup = function (e) {
        if (e.keyCode === 27) {
            toggleMenuOff();
        }
    }
}

/**
 * Window resize event listener
 */
function resizeListener() {
    window.onresize = function () {
        toggleMenuOff();
    };
}

/**
 * Turns the custom context menu on
 */
function toggleMenuOn() {
    if (menuState !== 1) {
        menuState = 1;
        menu.classList.add(menuActiveClassName);
        itemInContext.classList.add(itemActiveClassName);
    }
}

/**
 * Turns the custom context menu off
 */
function toggleMenuOff() {
    if (menuState !== 0) {
        menuState = 0;
        menu.classList.remove(menuActiveClassName);

        if (itemInContext) {
            itemInContext.classList.remove(itemActiveClassName);
        }
    }
}

/**
 * Positions the menu properly
 * @param {Object} e The event
 */
function positionMenu(e) {
    const menuWidth = menu.offsetWidth + 4;
    const menuHeight = menu.offsetHeight + 4;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const clickCoords = getPosition(e);
    const clickCoordsX = clickCoords.x;
    const clickCoordsY = clickCoords.y;

    if ((windowWidth - clickCoordsX) < menuWidth) {
        menu.style.left = windowWidth - menuWidth + 'px';
    } else {
        menu.style.left = clickCoordsX + 'px';
    }

    if ((windowHeight - clickCoordsY) < menuHeight) {
        menu.style.top = windowHeight - menuHeight + 'px';
    } else {
        menu.style.top = clickCoordsY + 'px';
    }
}

/**
 * Changes files tree based on clicked link in context menu
 * @param {HTMLElement} link The link that was clicked
 */
function menuItemListener(link) {
    const action = link.getAttribute('data-action');
    switch (action) {
        case 'remove':
            removeItem(itemInContext);
            break;
        case 'add-file':
            addFile(itemInContext);
            break;
        case 'add-folder':
            addFolder(itemInContext);
            break;
    }
    toggleMenuOff();
}

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
        'name': '',
        'path': '/client/package.json'
    };
    const li = createTreeItem(newElement);

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
        'name': '',
        'path': '/client/package.json',
        'children': []
    };
    const li = createTreeItem(newElement);

    if (node.parentElement.children.length === 1) {
        node.parentElement.parentElement.appendChild(li);
    } else {
        node.parentElement.lastElementChild.appendChild(li);
    }
}
