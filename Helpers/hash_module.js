const crypto = require('crypto');

module.exports = {
    makeSalt : () => new Promise((resolve, rejects) => {
        crypto.randomBytes(64, (err, buf) => {
            if(err) rejects(err);
            resolve(buf.toString('base64'));
        });
    }),
    makeHashedPassword : (salt, password) => new Promise(async (resolve, rejects) => {
        crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if(err) rejects(err);
            resolve(key.toString('base64'));
        });
    })
}