'use strict'
var iconv = require('iconv-lite');
var express = require('express');
var BaiduApi = require('../BaiduApi');
var PcsApi = require('../PcsApi');
var router = express.Router();

/* GET home page. */



router.all('/', function(req, res , next) {
    console.log("你进的是根路径，跳转到文件列表");
    res.redirect("/list");
});

router.all('/login',function(req,res,next){
    if(req.param("vcode")==undefined){
        console.log("开始登陆[username:"+req.param("username")+",password="+req.param("password")+"]");
        var username = req.param("username");
        var password = req.param("password");
        var baidu =  new BaiduApi.baidu();
        baidu.login(username,password,function(token,cookiejar){
            if(!token){
                console.log("登录失败，跳转登陆页面");
                res.render('index',{pagetype:'login',title:"登陆"});
            }else{
                var cks = cookiejar.getCookieString("https://passport.baidu.com");
                req.session.token = token;
                req.session.cks = cks;
                res.redirect("/main");
                //res.render('index', {pagetype:'list',title:"登陆",data:token+"/n"+cookiejar });
            }
        });
        /*
        var pcs = new Pcs.pcs(username,password);
        //pcs.init();
        pcs.check(function(result) {
            if(result["data"]["codeString"]==""){
                //无需验证码，开始登陆
                pcs.login(function(result){
                    console.log("lilingang李林刚");
                    res.render('index', { result: result });
                });
            }
        });*/
        //req.session.username='llg';
        //res.redirect("/");
    }else{

    }
});

router.all('/main',function(req,res,next) {
    console.log("已经登陆：token="+req.session.token);
    /*
    var pcs =  new PcsApi.pcs(req.session.cks);
    pcs.list(function(code,result){
        if(!code){
            res.render('index', {pagetype:'list',title:"文件列表",data:result});
        }else{
            res.render('index', {pagetype:'list',title:"文件列表",data:result});
        }
    });*/
    res.render('index', {pagetype:'normal',title:"文件列表",data:"已经登陆"});
});

router.all('/filelist',function(req,res,next) {
    console.log("网盘请求：token="+req.session.token);
    var pcs =  new PcsApi.pcs(req.session.cks);
    pcs.list(function(code,result){
        if(!code){
            res.render('index', {pagetype:'list',title:"文件列表",data:result});
        }else{
            //res.render('index', {pagetype:'list',title:"文件列表",data:result});
            var data = JSON.parse(result);
            console.log("李林刚"+JSON.stringify(data["list"]));
            res.writeHead(200, {'Content-Type': 'application/Json'});
            res.end(data["list"].toString());
        }
    });
});

router.all('/test',function(req,res,next) {
    console.log("测试请求");
    var str= "\u79bb\u7ebf\u4e0b\u8f7d";
    console.log(str);
    str = iconv.decode("\u79bb\u7ebf\u4e0b\u8f7d","gb2312");
    console.log(str);
    str = iconv.encode("\u79bb\u7ebf\u4e0b\u8f7d","gb2312");
    console.log(str);
    res.render('index', {pagetype:'list',title:"测试完成",data:"测试结果：。。。。\u79bb\u7ebf\u4e0b\u8f7d"});
});

module.exports = router;
