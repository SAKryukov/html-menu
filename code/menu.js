"use strict";

function menuGenerator (container, options) {

    if (!container) return;
    if (container.constructor != HTMLMenuElement) return;

    class MenuSubscriptionFailure extends Error {
        constructor(message) { super(message); }
    } //class MenuSubscriptionFailure

    const row = [];
    let isCurrentVisible = false, hideAfterAction = false, resetAfterAction = false, current;

    if (options && options.constructor == Object) {
        hideAfterAction = options.hide;
        resetAfterAction = options.reset;
    } //if

    const actionMap = new Map();
    const elementMap = new Map();

    const menuItemButtonState = {
        none: 0,
        checkBox: 1,
        checkBoxChecked: 2,
        radioButton: 3,
        radioButtonChecked: 4,
    };
    Object.freeze(menuItemButtonState);

    function menuItemProxy(menuItem) {
        const setBox = (newButton, indicator) => {
            if (!indicator) indicator = "";
            const menuItemData = elementMap.get(menuItem);
            const saveValue = menuItem.value;
            if (menuItemData.button != menuItemButtonState.none || newButton == menuItemButtonState.none)
                menuItem.textContent = menuItem.textContent.substring(definitionSet.check.checkbox.length);
            menuItemData.button = newButton;
            menuItem.textContent = indicator + menuItem.textContent;
            menuItem.value = saveValue;
        }; //setBox
        this.changeText = text => {
            const saveValue = menuItem.value;
            menuItem.textContent = text;
            menuItem.value = saveValue;
        }; //this.changeText
        this.setCheckBox = () => {
            setBox(menuItemButtonState.checkBox, definitionSet.check.checkbox);
        }; //this.setCheckBox
        this.setCheckedCheckBox = () => {
            setBox(menuItemButtonState.checkBoxChecked, definitionSet.check.checkedCheckbox);
        }; //this.setCheckedCheckBox
        this.setRadioButton = () => {
            setBox(menuItemButtonState.radioButton, definitionSet.check.radioButton);
        }; //setRadioButton
        this.setCheckedRadioButton = () => {
            setBox(menuItemButtonState.radioButtonChecked, definitionSet.check.checkedRadioButton);
        }; //setCheckedRadioButton
        this.clearBoxesButtons = () => {
            setBox(menuItemButtonState.none);
        }; //this.clearBoxesButtons
        this.enable = () => {
            menuItem.disabled = false;
        }; //enable
        this.disable = () => {
            menuItem.disabled = true;
        }; //disable
        this.toString = function() {
            const methodNames = [];
            for (let index in this)
                if (this[index].constructor == Function)
                    methodNames.push(index + definitionSet.check.menuItemProxyBrackets);
            return definitionSet.check.menuItemProxyHint(methodNames);
        }; //this.toString
    }; // menuItemProxy
    this.subscribe = function(value, action) {
        const actionMapData = actionMap.get(value);
        if (!actionMapData)
            throw new MenuSubscriptionFailure(
                definitionSet.exceptions.menuItemSubscriptionFailure(value));
        actionMapData.action = action;
        return new menuItemProxy(actionMapData.menuItem);
    } //this.subscribe
    this.activate = function() {
        if (row.left < 1) return;
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
            checkbox: String.fromCodePoint(0x2610, 0x2009), //Ballot Box
            checkedCheckbox: String.fromCodePoint(0x2611, 0x2009), //Ballot Box with Check
            radioButton: String.fromCodePoint(0x2B58, 0x2009), //Heavy Circle
            checkedRadioButton: String.fromCodePoint(0x2B57, 0x2009), //Heavy Circle with Circle Inside
            menuItemProxyHint: hint => `Use: ${hint.join(", ")},`,
            menuItemProxyBrackets: "()",
        },
        exceptions: {
            menuItemSubscriptionFailure: value => `
                Menu item "${value}" subscription failed:
                menu item (HTML option) with this value does not exist`, //sic!
        },
    } //const definitionSet
    Object.freeze(definitionSet);

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
        const action = actionMap.get(event.detail.action).action;
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
        const elementValue = elementMap.get(element);
        for (let menuItem of elementValue.menuItems) {
            const action = actionMap.get(menuItem.value).action;
            if (!action) continue;
            const result = action(false, menuItem.value);
            if (result == null) continue;
            menuItem.disabled = !result;
        } //loop
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
                select: rowCell.select,
                menuItems: [],
            };
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
                elementMap.set(option, { xPosition: xPosition, yPosition: yPosition, optionValue: optionValue, button: menuItemButtonState.none });
                actionMap.set(optionValue, { menuItem: option, action: null });
                data.menuItems.push(option);
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
