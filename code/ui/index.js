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

    menu.add("Open", (actionRequest, sample, currentState, action)  => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.add("1", (actionRequest, sample, currentState, action)  => { 
        if (!actionRequest) return;
        log(action);
        return sample.disabled | sample.checkBox;
    });
    menu.add("Save", (actionRequest, sample, currentState, action) => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.add("Save As", (actionRequest, sample, currentState, action) => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.add("Status bar", (actionRequest, sample, currentState, action) => { 
        if (!actionRequest) return;
        log(action);
    });
    menu.add("Option bar", (actionRequest, sample, currentState, action) => { 
        log(action);
    });
    menu.add("flex.html", (actionRequest, sample, currentState, action)  => { 
        if (!actionRequest) return;
        window.open(action, "_blank");
    });
    menu.add("styles.html", (actionRequest, sample, currentState, action)  => { 
        if (!actionRequest) return;
        window.open(action, "_blank");
    });

    window.onkeyup = event => {
        if (event.key == "Alt") {
            menu.activate();
            event.preventDefault();
        } //if
    } //window.onkeydown

};
