'use strict'
var iconv = require('iconv-lite');
var querystring = require("querystring");
var requestmodel = require('request');
//var tough = require('./node_modules/request/node_modules/tough-cookie');
//var Cookie = tough.Cookie;
var pcs = function (cks){
    this.ckstr = cks;
    this.request = requestmodel;
    //this.cookiejar = requestmodel.jar(jar);
    //cookiejar.getCookieString("https://passport.baidu.com");
    /*
    var domain1 = "http://passport.baidu.com";
    var domain2 = "http://www.baidu.com";
    var domain3 = "http://baidu.com";

    this.cookiejar = requestmodel.jar();
    //这里待整理**********************************************************************************************************

    for(var i=0;i< cks.length;i++){
        var c = requestmodel.cookie(cks[i]["key"]+"="+cks[i]["value"]);
        //var domain = cks[i]["domain"]="passport.baidu.com"?"https://passport.baidu.com":"http://www.baidu.com"
        var str = String.valueOf(cks[i].toString());
        this.cookiejar.setCookie(c,domain1);
    }
    this.request = requestmodel.defaults({jar:this.cookiejar});*/
};

pcs.prototype.reqparam= {
    PANHOST: 'http://pan.baidu.com/api/',
    ulist:function(dir){return {url:this.PANHOST+'list?dir='+dir}}
};

pcs.prototype.filelist = function(dir,next){
    var _this=this;
    console.log(_this.reqparam.ulist(dir).url);
    _this.request({
            url:_this.reqparam.ulist(dir).url,
            method: 'GET',
            headers:{
                cookie:_this.ckstr
            }
        }, function (err, res, body) {
            if (!err) {
                console.log("网盘Pan结果: " + res.statusCode);
                //body = iconv.decode(body,'utf-8')
                console.log(body);
                next(true,body);
            } else {
                next(false,err);
            }
    });
};


pcs.prototype.init = function(next){
    var _this=this;
    console.log(_this.reqparam.ulist().url);
    _this.request({
        url:_this.reqparam.ulist().url,
        method: 'GET',
        headers:{
            cookie:_this.ckstr
        }
    }, function (err, res, body) {
        if (!err) {
            console.log("网盘Pan结果: " + res.statusCode);
            //body = iconv.decode(body,'utf-8')
            console.log(body);
            next(true,body);
        } else {
            next(false,err);
        }
    });
};

exports.pcs = pcs;
