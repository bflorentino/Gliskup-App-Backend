const fs = require('fs/promises');
const {randomUUID} = require('crypto')

exports.saveImage = async (arrayBuffer, fileName) => {

    const img = Buffer.from(arrayBuffer)
    const newFileName = `${randomUUID()}.jpg`
    await fs.writeFile( `${process.cwd()}/public/profilePics/${newFileName}`, img)

    return `profilePic/${newFileName}`
}