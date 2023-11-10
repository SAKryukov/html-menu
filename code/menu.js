"use strict";

function menuGenerator (container, options) {

    if (!container) return;
    if (container.constructor != HTMLMenuElement) return;

    const row = [];
    let isCurrentVisible = false, hideAfterAction = false, resetAfterAction = false, current;

    if (options && options.constructor == Object) {
        hideAfterAction = options.hide;
        resetAfterAction = options.reset;
    } //if

    const actionMap = new Map();
    const elementMap = new Map();

    const menuItemState = {
        none: 1,
        checkBox: 2,
        checkBoxChecked: 3,
        radioButton: 4,
        radioButtonChecked: 5,
        disabled: 0xF0,
    };
    Object.freeze(menuItemState);
    this.subscribe = function(value, action) {
        actionMap.set(value, action);
    } //this.subscribe
    this.activate = function() {
        if (row.left < 1) return;``
        if (current)
            select(current, true);
        else
            select(row[0].element, true);
    } //this.activate
   
    const definitionSet = {
        selectionIndicator: "selected",
        events: {
            optionClick: "optionClick",
        },
        keyboard: {
            left: "ArrowLeft",
            right: "ArrowRight",
            up: "ArrowUp",
            down: "ArrowDown",
            home: "Home",
            end: "End",
            escape: "Escape",
            enter: "Enter",
            edit: "F2",
            findNext: "F3",    
        },
        elements: {
            header: "header",
            select: "select",
        },
        states: {
            show: "inline",
            hide: "none",
            positionAbsolute: "absolute",
        },
        check: {
            checkbox: String.fromCodePoint(0x2610) + " ",
            checkedCheckbox: String.fromCodePoint(0x2611) + " ",
            radioButton: String.fromCodePoint(0x25CE) + " ",
            checkedRadioButton: String.fromCodePoint(0x25C9) + " ",
        },
    } //const definitionSet

    const reset = () => {
        if (!resetAfterAction) return;
        if (row.length < 1) return;
        for (let element of row) {
            if (element.select)
                element.select.selectedIndex = 0;
        } //loop
        current = row[0].element;
    }; //reset

    container.addEventListener(definitionSet.events.optionClick, event => {
        if (!event.detail.action) return;
        const action = actionMap.get(event.detail.action);
        if (action)
            action(true, event.detail.action);
        if (hideAfterAction && current) 
            select(current, false);
        reset();
    }); //container.optionClick
    container.addEventListener(definitionSet.keyboard.escape, () => {
        select(current, false);
        reset();
    }); //container.escape
    const leftRightHandler = (event, right) => {
        let xPosition = event.detail.xPosition;
        if (right) {
            if (xPosition < row.length - 1)
                xPosition++;
            else
                xPosition = 0;
        } else {
            if (xPosition > 0)
                xPosition--;
            else
                xPosition = row.length - 1;
        } //if
        select(current, false);
        select(row[xPosition].select, true);
    }; //leftRightHandler
    container.addEventListener(definitionSet.keyboard.left, event => {
        leftRightHandler(event, false);
    }); //container.optionClick
    container.addEventListener(definitionSet.keyboard.right, event => {
        leftRightHandler(event, true);
    }); //container.optionClick

    const updateStates = element => {
        /*
        const elementValue = elementMap.get(element);
        const menuItems = [];
        for (let [key, value] of elementMap) {
            if (key.constructor == HTMLOptionElement) {
                if (elementValue.xPosition == value.xPosition)
                    menuItems.push({ menuItem: key, menuItemValue: value });
            } //if
        } //loop
        for (let menuItemData of menuItems) {
            const action = actionMap.get(menuItemData.menuItem.text);
            if (!action) continue;
            const result = action(false, menuItemData.menuItemValue.optionValue);
            if (!result) return;
            if ((result & menuItemState.disabled) > 0)
                menuItemData.menuItem.disabled = true;
            if ((result & 0x0F) == menuItemState.checkBox || menuItemData.menuItem.dataset.checkable)
                menuItemData.menuItem.textContent = definitionSet.check.checkbox + menuItemData.menuItem.value;
            if ((result & 0x0F) == menuItemState.checkBoxChecked)
                menuItemData.menuItem.textContent = definitionSet.check.checkedCheckbox + menuItemData.menuItem.value;
            if ((result & 0x0F) == menuItemState.radioButton)
                menuItemData.menuItem.textContent = definitionSet.check.radioButton + menuItemData.menuItem.value;
            if ((result & 0x0F) == menuItemState.radioButtonChecked)
                menuItemData.menuItem.textContent = definitionSet.check.checkedRadioButton + menuItemData.menuItem.value;
        } //loop
        */
    }; //updateStates

    const select = (element, doSelect) => {
        if (!element) return;
        const eventData = elementMap.get(element);
        if (doSelect)
            eventData.header.classList.add(definitionSet.selectionIndicator);
        else 
            eventData.header.classList.remove(definitionSet.selectionIndicator);
        eventData.select.style.display = doSelect
            ? definitionSet.states.show : definitionSet.states.hide;
        if (!doSelect) return;
        eventData.select.size = eventData.optionSize;
        if (doSelect)
            current = element;
        setTimeout(() => eventData.select.focus());
        if (doSelect)
            updateStates(element);
        isCurrentVisible = doSelect;
    }; //select
    
    (() => { //main loop
        for (let child of container.children) {
            const rowCell = {
                element: child,
                header: child.querySelector(definitionSet.elements.header),
                select: child.querySelector(definitionSet.elements.select),
            };
            if (rowCell.element == null || rowCell.header == null || rowCell.select == null )
                continue;
            const data = {
                xPosition: row.length,
                element: rowCell.element,
                header: rowCell.header,
                select: rowCell.select};
            row.push(rowCell);
            rowCell.select.style.position = definitionSet.states.positionAbsolute;
            elementMap.set(rowCell.element, data);
            elementMap.set(rowCell.header, data);
            elementMap.set(rowCell.select, data);
            rowCell.select.onkeydown = event => {
                switch (event.key) {
                    case definitionSet.keyboard.enter:
                        const clickData = { action: event.target.options[event.target.selectedIndex].value };
                        container.dispatchEvent(
                            new CustomEvent(definitionSet.events.optionClick, { detail: clickData }));
                        break;
                    case definitionSet.keyboard.up:
                        if (event.target.selectedIndex < 1) {
                            event.target.selectedIndex = event.target.options.length - 1;
                            event.preventDefault();
                        } //if
                        break;
                    case definitionSet.keyboard.down:
                        if (event.target.selectedIndex >= event.target.options.length - 1) {
                            event.target.selectedIndex = 0;
                            event.preventDefault();
                        } //if
                        break;
                    default:
                        const data = elementMap.get(event.target);
                        data.target = event.target;
                        container.dispatchEvent(
                            new CustomEvent(event.key, { detail: data }));
                } //switch
            }; //rowCell.select.onkeydown
            rowCell.select.onblur = event => {
                const data = elementMap.get(event.target);
                select(data.element, false);
            } //rowCell.select.onblur            
            let optionIndex = 0, optionSize = 0;    
            const optionHandler = event => {
                const data = elementMap.get(event.target);
                data.action = event.target.value;
                setTimeout(() => {
                    container.dispatchEvent(
                        new CustomEvent(
                            definitionSet.events.optionClick,
                            { detail: data }));    
                });
            }; //optionHandler
            const setupOption = (option, xPosition, yPosition, optionValue) => {
                /*
                if (option.dataset.checked)
                    option.textContent = definitionSet.check.checkedCheckbox + option.textContent;
                else if (option.dataset.checkable)
                    option.textContent = definitionSet.check.checkbox + option.textContent;
                else if (option.dataset.checkPlaceholder)
                    option.textContent = definitionSet.check.placeholderCheckbox + option.textContent;
                else if (option.dataset.radio)
                    option.textContent = definitionSet.check.radioButton + option.textContent;
                else if (option.dataset.checkedRadio)
                    option.textContent = definitionSet.check.checkedRadioButton + option.textContent;
                */
                elementMap.set(option, { xPosition: xPosition, yPosition: yPosition, optionValue: optionValue });
                option.onpointerdown = optionHandler;
            }; //setupOption           
            for (let option of rowCell.select.children) {
                if (option.constructor == HTMLOptionElement)
                    setupOption(option, row.length - 1, optionIndex++, option.value);
                else if (option.constructor == HTMLOptGroupElement)
                    for (let subOption of option.children) {
                        setupOption(subOption, row.length - 1, optionIndex++, subOption.value);
                        optionSize++;
                    } //loop
                optionSize++;    
            } //loop
            data.optionSize = optionSize;
            rowCell.header.onpointerdown = event => {
                const element = elementMap.get(event.target).element;
                if (element == current && !isCurrentVisible) return;
                select(current, false);
                select(element, true);
            } //rowCell.header.onpointerdown
        } //loop
    })(); //main loop

    if (row.length > 0) {
        container.tabIndex = 0;
        container.onfocus = () => {
            if (current)
                select(current, true)
            else
                select(row[0].element, true)
        }; //container.onfocus    
    }; //if

};
