const functions = require('firebase-functions')
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(functions.config().sendgrid.key);

/**
 * [decodeContent a small util to convert encoded HTML to native String]
 * @param  {Base64 String} encodedHtml []
 * @return {String}  [decoded HTML]
 */
function decodeContent(encodedHtml) {
    return decodeURIComponent(Buffer.from(encodedHtml, 'base64').toString());
}

/**
 * [sendMail description]
 * @return {[type]} [description]
 */
module.exports = function sendMail({recipients, from, subject, content}) {
  const mail = new helper.Mail();
  const fromEmail = new helper.Email(from);
  const replyTo = new helper.Email("support@newscart.co");

  mail.setFrom(fromEmail);
  mail.setReplyTo(replyTo);
  mail.setSubject(subject);

  const personalization = new helper.Personalization();
  recipients.forEach(recipient => {
    let recipientEmail = new helper.Email(recipient)
    personalization.addTo(recipientEmail);
  });
  mail.addPersonalization(personalization);

  const decodedTemplate = new helper.Content("text/html", decodeContent(content));
  mail.addContent(decodedTemplate);

  const sendgridRequest = sg.emptyRequest({method: 'POST', path: '/v3/mail/send', body: mail.toJSON()});
  return sg.API(sendgridRequest);
}