const fs = require('fs/promises');
const {randomUUID} = require('crypto')

exports.saveImage = async (arrayBuffer, directory) => {

    const img = Buffer.from(arrayBuffer)
    const newFileName = `${randomUUID()}.jpg`
    await fs.writeFile( `${process.cwd()}/public/${directory}/${newFileName}`, img)

    return newFileName
}

exports.deleteImage = async (path, directory) => {

    const splittedPath = path.split("/");
    try{
        await fs.unlink(`${process.cwd()}/public/${directory}/${splittedPath[splittedPath.length - 1]}`)
        return true
    }catch(error){
        return false
    }
}