'use strict'
var querystring = require("querystring");
var requestmodel = require('request');
var baidu = function (){
    this.cookiejar = requestmodel.jar();
    this.request = requestmodel.defaults({jar:this.cookiejar});
};
//初始请求参数
baidu.prototype.reqparam={
    INDEX : 'http://www.baidu.com',
    APIHOST:'https://passport.baidu.com/v2/api/?',
    ucookie:function(){return {url:this.INDEX}},
    utoken:function(){return {url:this.APIHOST+'getapi&tpl=pp&apiver=v3&class=login'}},
    ucheck:function(token,username){
        var data={
            token:token,
            tpl:'mn',
            apiver:'v3',
            tt:Date.parse(new Date()),
            username:username,
            isphone:false
        };
        return {url:this.APIHOST+'logincheck&'+querystring.stringify(data)};
    },
    ulogin:function(token,username,password){
        var data = {
            username: username,
            password: password,
            u: 'https://passport.baidu.com',
            tt:Date.parse(new Date()),
            tpl: 'pp',
            token: token,
            staticpage: 'https://passport.baidu.com/static/passpc-account/html/v3Jump.html',
            isPhone: 'false',
            charset : 'utf-8',
            callback: 'parent.bd__pcbs__ra48vi'
        };
        var headers = {
            'cookie': this.cookiejar,
            'Accept': 'text/html, application/xhtml+xml, */*',
            'Referer': 'http://www.baidu.com/?tn=95313076_hao_pg',
            'Accept-Language': 'en-US,en;q=0.8,zh-Hans-CN;q=0.5,zh-Hans;q=0.3',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Length': querystring.stringify(data).length,
            'Connection': 'Keep-Alive'
        };
        return {url:this.APIHOST+'login',data:data,headers:headers}
    }
};

baidu.prototype.login = function(username,password,next){
    var _this =this;
    if(username == undefined || password == undefined ){
        next(false,"用户名活密码不能为空");
    }
    _this.request(_this.reqparam.ucookie(), function(err, res, body) {
        if(!err) {
            console.log("获取Cookie响应: " + res.statusCode);
            //获取到的cookie在res中
            //_this.BAIDUID=/BAIDUID([0-9A-Za-z:=]+);/.exec(res.headers["set-cookie"])[0];
            console.log("获取Cookie结果: " + res.headers["set-cookie"]);
            //发送获取token请求//发送获取token请求
            _this.request(_this.reqparam.utoken(),function(err,res,body){
                if(!err) {
                    console.log("获取Token响应: " + res.statusCode);
                    body = body.toString().replace(/'/g, '"');
                    var json = JSON.parse(body);
                    //var token = json["data"]["token"];
                    var token = json["data"]["token"];
                    //获取到Token
                    console.log("获取Token结果: " + token);

                    _this.request(_this.reqparam.ucheck(token,username),function(err,res,body){
                        if(!err){
                            console.log("登陆Check响应: " + res.statusCode);
                            console.log("登陆Check结果: " + body);
                            var paramlogin = _this.reqparam.ulogin(token,username,password);
                            _this.request.post({
                                url: paramlogin.url,
                                form: paramlogin.data,
                                headers:paramlogin.headers
                            }, function (err, res, body) {
                                if (!err) {
                                    console.log("登陆Login响应: " + res.statusCode);
                                    //var BDUSS=/BDUSS([0-9A-Za-z:~=]+);/.exec(res.headers["set-cookie"])[0];
                                    console.log("登陆Login结果: " + res.headers["set-cookie"]);
                                    console.log(_this.cookiejar.getCookieString("http://www.baidu.com"));
                                    next(token,_this.cookiejar);
                                } else {
                                    next(false,err);
                                }
                            });
                        }else{
                            next(false,err);
                        }
                    });
                }else{
                    next(false,err);
                }
            });
        }else{
            next(false,err);
        }
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        next(false,e);
    });
};

exports.baidu = baidu;
