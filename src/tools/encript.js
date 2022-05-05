const bcrypt = require('bcryptjs');

exports.hashing = async (saltPassword) => {
    
    const hashedPassword = await bcrypt.hash(saltPassword, 10);
    return hashedPassword
}

exports.compareHash = (bodyPassword, userPassword) => {
    return bcrypt.compareSync(bodyPassword, userPassword)
}