/**
 * Created by LocalUser on 22/07/2017.
 */
var EmailUtility = {
    sendEmail: function (from, to, subject, html, text) {

        var fs = require('fs');
        var cfg = JSON.parse(fs.readFileSync('./config/MailGun_Cfg.json', 'utf8'));
        var mailgun = require('mailgun-js')({apiKey: cfg.api_key, domain: cfg.domain});
        var data = {
            from: from,
            to: to,
            subject: subject,
            html: html,
            text: text
        };

        mailgun.messages().send(data, function (error, body) {
            console.log(error);
            console.log(body);
        });
    }
};
//EmailUtility.sendEmail('Mailgun Sandbox <postmaster@sandbox433aec60d9004a9cb18cfabce6b66f9e.mailgun.org>','haperkelu@gmail.com','heloo', '<b>ggg</b>', 'ggg');
module.exports = EmailUtility;