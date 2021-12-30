const sanitizeHtml = require('sanitize-html');

module.exports = {
    notAllowedAll : (data) => {
        return sanitizeHtml(data, {allowedTags:[], allowedAttributes:{}});
    },
    allowedDefault : (data) => {
        return sanitizeHtml(data);
    },
};