const bcrypt = require('bcryptjs');

exports.hashing = async (saltPsw) => {
    
    const hashedPassword = await bcrypt.hash(saltPsw, 10);
    return hashedPassword
}

exports.compareHash = (bodyPassword, userPassword) => {
    return bcrypt.compareSync(bodyPassword, userPassword)
}