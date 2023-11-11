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
        main: document.querySelector("main"),
        console: document.querySelector("main section"),
        footer: document.querySelector("footer"),
        notePanel: document.querySelector("textarea"),
    }; //elements

    const mainDefault = window.getComputedStyle(elements.main);
    const notePanelDefault = window.getComputedStyle(elements.main);
    const footerDefault = window.getComputedStyle(elements.footer);

    const log = value => {
        const item = document.createElement("span");
        item.innerHTML = `&ldquo;${value}&rdquo; `;
        elements.console.appendChild(item);
    }; //log

    const menu = new menuGenerator(elements.menu, { hide: false, reset: false });

    const menuItemClear = menu.subscribe("Clear", (actionRequest) => {
        if (!actionRequest) return elements.console.firstChild != null;
        while (elements.console.firstChild)
            elements.console.removeChild(elements.console.firstChild);
    });
    menuItemClear.disable();

    (() => { //themes:
        const setTheme = menuItemHandle => {
            for (let theme of [menuItemThemeLight, menuItemThemeDark, menuItemThemeSystemDefault])
                if (theme != menuItemHandle)
                    theme.setRadioButton();
            menuItemHandle.setCheckedRadioButton();
            if (menuItemHandle == menuItemThemeDark) {
                elements.main.style.backgroundColor = "black";
                elements.main.style.color = "lightGray";
                elements.notePanel.style.backgroundColor = "darkGray";
                elements.notePanel.style.color = "yellow";
                elements.notePanel.style.borderColor = "gray";
                elements.footer.style.color = "white";
                elements.footer.style.backgroundColor = "darkGreen";
            } else {
                elements.main.style = mainDefault;
                elements.notePanel.style = notePanelDefault;
                elements.footer.style = footerDefault;
            } //if
        } //setTheme
        const menuItemThemeLight = menu.subscribe("Light", (actionRequest, action) => {
            if (!actionRequest) return true;
            log(action);
            setTheme(menuItemThemeLight);
        });
        const menuItemThemeDark = menu.subscribe("Dark", (actionRequest, action) => {
            if (!actionRequest) return true;
            log(action);
            setTheme(menuItemThemeDark);
        });
        const menuItemThemeSystemDefault = menu.subscribe("System Default", (actionRequest, action) => {
            if (!actionRequest) return true;
            log(action);
            setTheme(menuItemThemeSystemDefault);
        });
        menuItemThemeLight.setRadioButton();
        menuItemThemeDark.setRadioButton();
        menuItemThemeSystemDefault.setCheckedRadioButton();
    })(); //themes

    (() => { //view:
        const invert = (handle, state) => {
            if (state) handle.setCheckedCheckBox(); else handle.setCheckBox();
        }; //invert
        let statusBarChecked = true, notesPanelChecked = true;
        const menuItemStatusBar = menu.subscribe("Status Bar", (actionRequest, action) => {
            if (!actionRequest) return true;
            statusBarChecked = !statusBarChecked;
            invert(menuItemStatusBar, statusBarChecked);
            elements.footer.style.display = statusBarChecked ? "block" : "none";
        });
        const menuItemNotesPanel = menu.subscribe("Notes Panel", (actionRequest, action) => {
            if (!actionRequest) return true;
            notesPanelChecked = !notesPanelChecked;
            invert(menuItemNotesPanel, notesPanelChecked);
            elements.notePanel.style.display = notesPanelChecked ? "block" : "none";
        });
        menuItemStatusBar.setCheckedCheckBox();
        menuItemNotesPanel.setCheckedCheckBox();
    })(); //view

    window.onkeyup = event => {
        if (event.key == "`") {
            menu.activate();
            event.preventDefault();
        } //if
    } //window.onkeydown

};
