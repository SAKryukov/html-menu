"use strict";

window.onload = () => {
    
    const elements = {
        menu: document.querySelector("header menu"),
        main: document.querySelector("main section"),
        footer: document.querySelector("footer"),
    }; //elements

    const log = value => {
        const item = document.createElement("span");
        item.innerHTML = `&ldquo;${value}&rdquo; `;
        elements.main.appendChild(item);
    }; //log

    const menu = new menuGenerator(elements.menu, { hide: false, reset: false });

    const menuItemClear = menu.subscribe("Clear", (actionRequest) => {
        if (!actionRequest) return elements.main.firstChild != null;
        while (elements.main.firstChild)
            elements.main.removeChild(elements.main.firstChild);
    });
    menuItemClear.disable();

    (() => { //themes:
        const setTheme = menuItemHandle => {
            for (let theme of [menuItemThemeLight, menuItemThemeDark, menuItemThemeSystemDefault])
                if (theme != menuItemHandle)
                    theme.setRadioButton();
            menuItemHandle.setCheckedRadioButton();
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
