const jwt = require('jsonwebtoken');

module.exports = getToken = (user) => {
 
    const token = jwt.sign({
        user
    }, 'a52345jl@ljadf6lk608nln78*&sdfasd532&#.5dfa#@sdsgtfg', 
        {expiresIn: '96h'}
     );

    return token;
}