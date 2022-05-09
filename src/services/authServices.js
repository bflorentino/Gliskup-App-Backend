const getConnection = require('../db/connection');
const collections = require('../types/types') 
const {hashing, compareHash} = require('../tools/encript')
const serverRes = require('../response/response');
const getToken = require('../tools/token');
const { validateSignUp } = require('../validators/authValidations');

exports.addUserDb = async (user) => {
    
    const { client, db } = await getConnection()
    const res = new serverRes()

    try{
        await client.connect();
        const validationBody = validateSignUp(user)
        
        if(validationBody === true){
            const users = db.collection(collections.users);
            user.password = await hashing(user.password)
    
            if(await validateNotEmailAndUserExists(user.email, user.user, users)){
                await users.insertOne(user)
                token = authFirstTime(user)
                res.message = "Your account has been added"
                
                res.data = { user: user.user, 
                            name: user.name, 
                            lastName: user.lastName,  
                            email: user.email, token
                        }
            }else{
                res.message = "This user or email already exists"
                res.success = false
                res.errorStatus = 400
            }
        }else{
            res.message = validationBody
            res.success = false
            res.errorStatus = 400
        }
        
    }catch(e){
        res.success = false;
        res.errorStatus = 500
    }
    finally{
        await client.close()
    }
    return res
}

const validateNotEmailAndUserExists = async ( email, user, collection ) => {
    
    const userField = "user";
    const emailField = "email"

    const distinctUsers = await collection.distinct(userField)
    const distinctEmail = await collection.distinct(emailField)

    return !distinctEmail.includes(email) && !distinctUsers.includes(user) 
}

const authFirstTime = (user) => {

    const token = getToken({user : user.user, email: user.email})
    return token
}

exports.loginDb = async(user) => {

    const { client, db } = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        const userDb = await users.findOne({user: user.user})

        if(userDb && compareHash(user.password, userDb.password)){
            res.data = { user: userDb.user,
                        name: userDb.name, 
                        lastName: userDb.lastName,
                        email: userDb.email,
                        profilePicture: userDb.profilePic,
                        token: getToken({ user: userDb.user, email: userDb.email  })
                    }
        }else{
            res.message = "User or password are incorrect"
            res.success = false;
            res.errorStatus = 404
        }
    }catch(e){
        res.success = false;
        res.errorStatus = 500
    }finally{
        await client.close();
    }
    return res;
}

exports.setAvatarProfilePicDb = async (picObject) => {
    
    const { client, db } = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        const filter = {user: picObject.user};

        const updateUser = {
            $set : {
                profilePic: picObject.profilePic
            }
        }
        await users.updateOne(filter, updateUser);
        res.data = picObject.profilePic
        res.message = "Your profile pic has been setted"
    }
    catch(e) {
       res.success = false;
        res.errorStatus = 500;
    }
    finally {
        await client.close();
    }

    return res;
}