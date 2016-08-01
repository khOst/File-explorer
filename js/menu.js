'use strict';

const menu = document.getElementById('menu');
const menuLinkClassName = 'menu-link';
const menuActiveClassName = 'menu-active';
const itemActiveClassName = 'item-active';

let itemInContext;
let menuState = 0;

/**
 * Listens for contextmenu events
 */
function contextListener() {
    document.addEventListener('contextmenu', function (e) {
        toggleMenuOff();
        itemInContext = clickInsideElement(e, 'tree-item');

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
 * Listens for click events
 */
function clickListener() {
    document.addEventListener('click', function (event) {
        const clickedElIsLink = clickInsideElement(event, menuLinkClassName);

        if (clickedElIsLink) {
            event.preventDefault();
            menuItemListener(clickedElIsLink);
        } else {
            const button = event.which || event.button;

            if (button === 1) {
                toggleMenuOff();
            }
        }
    });
}

/**
 * Listens for keyup events
 */
function bindKeyupListener() {
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
    const clickCoordinates = getPosition(e);
    const clickCoordinatesX = clickCoordinates.x;
    const clickCoordinatesY = clickCoordinates.y;

    if ((windowWidth - clickCoordinatesX) < menuWidth) {
        menu.style.left = windowWidth - menuWidth + 'px';
    } else {
        menu.style.left = clickCoordinatesX + 'px';
    }

    if ((windowHeight - clickCoordinatesY) < menuHeight) {
        menu.style.top = windowHeight - menuHeight + 'px';
    } else {
        menu.style.top = clickCoordinatesY + 'px';
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
