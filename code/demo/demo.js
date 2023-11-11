/*
HTML Menu

Copyright (c) 2023 by Sergey A Kryukov
http://www.SAKryukov.org
http://www.codeproject.com/Members/SAKryukov
*/

"use strict";

window.onload = () => {
    
    const elements = {
        menu: document.querySelector("header menu"),
        main: document.querySelector("main section"),
        clear: document.querySelector("footer button"),
    }; //elements

    elements.clear.onclick = () => {
        while (elements.main.firstChild)
            elements.main.removeChild(elements.main.firstChild);
    }; //elements.clear.onclick

    const log = value => {
        const item = document.createElement("span");
        item.innerHTML = `&ldquo;${value}&rdquo; `;
        elements.main.appendChild(item);
    }; //log

    const menu = new menuGenerator(elements.menu, { hide: false, reset: false });

    // if (!actionRequest) the added handler should return true (enable), false (disable) or nothing (undefined)
    // if undefined, menu state is not changed;
    // return of true or false overrides menu item handle enable or disable
    // handler returns menu item handle
    menu.subscribe("Open", (actionRequest, action)  => { 
        if (!actionRequest) return true;
        log(action);
    });

    menu.subscribe("1", (actionRequest, action)  => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.subscribe("Save", (actionRequest, action) => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.subscribe("Save As", (actionRequest, action) => { 
        if (!actionRequest) return false;
        log(action);
    });

    (() => { //commandSet:
        // commandSet and menu.subscribeCommandSet is an alternative way of subscribing
        // it is a convenient way to subscribe to more then one menu, for example,
        // main menu + context menu
        const commandSet = new Map();
        const statusBarName = "Status Bar";
        const toolboxName = "Toolbox";
        commandSet.set(statusBarName, (actionRequest, action) => {
            if (!actionRequest) return;
            log(action);
        });
        commandSet.set(toolboxName, (actionRequest, action) => {
            if (!actionRequest) return;
            log(action);
        });
        commandSet.set("buttons.html", (actionRequest, action) => {
            if (!actionRequest) return;
            window.open(action, "_blank");
        });
        commandSet.set("flex.html", (actionRequest, action) => {
            if (!actionRequest) return;
            window.open(action, "_blank");
        });
        menu.subscribeCommandSet(commandSet);
        const menuItemStatusBar = commandSet.get(statusBarName).menuItemHandle;
        const menuItemOptionBar = commandSet.get(toolboxName).menuItemHandle;
        menuItemStatusBar.setCheckBox();
        menuItemOptionBar.setCheckBox();
    })(); //commandSet

    window.onkeyup = event => {
        if (event.key == "Alt") {
            menu.activate();
            event.preventDefault();
        } //if
    } //window.onkeydown

};
