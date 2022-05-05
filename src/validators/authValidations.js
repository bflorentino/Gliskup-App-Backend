const validator = require('validator')

exports.validateSignUp = (body) => {

    if (body.name === "") return "Name is required"
    if (body.lastName === "") return "Last Name is required" 
    if (!validator.isEmail(body.email)) return "Not a valid email"
    if(body.email === "") return "Email is required"
    if(body.phone !== "" && !validator.isMobilePhone(body.phone)) return "Invalid phone number"
    if(body.user === "") return "User Name is required" 
    if(body.password === "") return "Password is required" 
    if(body.password.length < 6) return "Passwords must be at least 6 chars"

    return true
} 