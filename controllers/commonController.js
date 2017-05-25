const express = require('express');


function CommonController() {

    this.welcome = ((req, res) => {
        res.render('welcome.hbs');
    });

}

module.exports = CommonController;