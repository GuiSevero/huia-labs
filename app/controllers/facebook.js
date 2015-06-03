var crypto = require("crypto");
var config = require("../config");

exports.get_index = function(req, res){
    res.render('facebook/index');
}

exports.get_challenge = function(req, res) {

    if (req.query['hub.verify_token'] == config.facebook.verify_token)
        res.send(req.query['hub.challenge']);
    else
        res.send(400);
};

exports.post_callback = function(req, res) {

    payload = JSON.stringify(req.body);

    var request_sign = req.get("X-Hub-Signature");
    var expected_sign = "sha1=" + crypto.createHmac('sha1', config.facebook.app_secret).update(payload).digest('hex');

    /*
    * Verificação de segurança da assinatura do payload com o app_secret
    */

    if(request_sign !== expected_sign){
      res.send(400);
      return;
    } 

    var update = new FacebookUpdate({
        body: req.body,
        facebook_signature: request_sign,
        app_signature: expected_sign
    });

    update.save(function(err) {
        if (err)
            res.send(500)
        else
            res.send(201)
    });

};
