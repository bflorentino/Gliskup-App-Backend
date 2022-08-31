const jwt = require('jsonwebtoken');
const {secretForToken} = require('../../config/config')

module.exports = getToken = (user) => {
 
    const token = jwt.sign({
        user
    }, secretForToken, 
        {expiresIn: '96h'}
     );

    return token;
}