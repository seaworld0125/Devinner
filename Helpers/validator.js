const sanitizeHtml = require('sanitize-html');

module.exports = {
    notAllowedAllHtml : (data) => {
        return sanitizeHtml(data, {allowedTags:[], allowedAttributes:{}});
    },
    allowedDefaultHtml : (data) => {
        return sanitizeHtml(data);
    },
};