const express = require('express');


function CommonController() {

    this.errorHandler = ((err, message, res) => {
        res.status(500).send();
    });

    this.databaseErrorHandler = ((err, message, res) => {
        res.status(500).send();
    });
    this.onSucces = (()=> {

    });
}

module.exports = CommonController;