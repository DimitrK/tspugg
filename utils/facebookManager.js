var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var url = require('url');
var config = require('../config/config.json');

function makeRequest(urlOptions) {
    return request(url.format(urlOptions))
        .catch(Promise.TimeoutError, function (e) {
//            app.get("logger").error(module.filename + '::Connection Timed out for FB Graph API: ' + e);
            throw e;
        })
        .then(function (response) {
//            logger.info(module.filename + '::Fb graph API reached. ' + body);
            var fbError = (response && 'data' in response && typeof response.data.error !== 'undefined') ? response.data.error : undefined;

            if (!fbError && response.statusCode == 200) {
//                logger.info(module.filename + '::Successfully made request:');
//                logger.info(module.filename + '::Response:' + JSON.stringify(body));
            }
            if (response.statusCode != 200) {
//                logger.error(module.filename + '::Bad status code from FB Graph api:' + response.statusCode);
//                logger.error(module.filename + '::Status text from FB Graph api:' + response.statusText);
            }
            if (fbError) {
//                logger.error(module.filename + '::Error reaching FB Graph api for token: ' + urlOptions.query.access_token);
//                logger.error(module.filename + '::Error:' + err);
            }
            return response;
        });

}

function verifyToken(token) {
    var urlOptions = {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        pathname: '/debug_token',
        query: {
            input_token: token,
            access_token: config.fb_token
        }
    };

    return makeRequest(urlOptions);
}

function getUser(token) {
    var urlOptions = {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        pathname: '/me',
        query: {
            fields: 'id, email, name, verified',
            access_token: token
        }
    };

    return makeRequest(urlOptions);
}

function buildUserPhotoUrl(fbUserId) {
    var fbUrl = 'http://graph.facebook.com/' + fbUserId + '/picture?type=large';
    return fbUrl;
}

module.exports = {
    verifyToken: verifyToken,
    getUser: getUser,
    buildUserPhotoUrl: buildUserPhotoUrl
};
