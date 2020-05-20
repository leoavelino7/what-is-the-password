"use strict";

var TERMINAL = TERMINAL || {
    config: {},
    view: {},
    controller: {}
};

(function initConfig() {
    this.input = document.getElementsByName('command');
    this.output = document.querySelector('#terminal');
    this.passwords = [
        'hacker',
        'admin'
    ];
    this.chosenPassword = null;
    this.attempts = 0;
    this.attemptsLimit = 5;
    this.isAllowed = false;
    this.isLockTerminal = false;
    this.messageTerminal = 'root/>_: ';
}).call(TERMINAL.config);

(function initView(config) {
    this.printTerminal = (message, time) => {
        let elementTagP = document.createElement('p'),
            text = document.createTextNode(config.messageTerminal.concat(message));

        elementTagP.appendChild(text);
        setTimeout(() => config.output.appendChild(elementTagP), time);
    };
}).call(TERMINAL.view, TERMINAL.config);

(function initController(config, view) {
    this.choosePassword = () => {
        let i = Math.floor(Math.random() * config.passwords.length);
        config.chosenPassword = config.passwords[i];
    };

    this.checkAccess = (password) => config.chosenPassword === password;

    this.upAttempts = () => config.attempts++;

    this.lockTerminal = () => {
        if(!config.isLockTerminal){
            config.isLockTerminal = !config.isAllowed && config.attempts >= config.attemptsLimit;
        };
        return config.isLockTerminal;
    };

    this.removeElementInput = () => config.input[0].remove();
    
    this.checkTerminal = () => {
        let currentInputValue = config.input[0].value;
        view.printTerminal(currentInputValue, 1000);
        
        config.isAllowed = this.checkAccess(currentInputValue);
        view.printTerminal(config.isAllowed ? 'Access allowed' : 'Wrong password', 1000);
        
        config.input[0].value = '';
        this.upAttempts();
        if(this.lockTerminal()){
            view.printTerminal('Restart the server', 1000);
        };
        if(config.isAllowed || config.isLockTerminal) this.removeElementInput();
    };
    this.choosePassword();
}).call(TERMINAL.controller, TERMINAL.config, TERMINAL.view);

const elementTagForm = document.querySelector('#container');
elementTagForm.addEventListener('submit', (event) => {
    event.preventDefault();
    TERMINAL.controller.checkTerminal();
});
