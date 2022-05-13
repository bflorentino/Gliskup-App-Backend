const fs = require('fs/promises');
const {randomUUID} = require('crypto')

exports.saveImage = async (arrayBuffer, directory) => {

    const img = Buffer.from(arrayBuffer)
    const newFileName = `${randomUUID()}.jpg`
    await fs.writeFile( `${process.cwd()}/public/${directory}/${newFileName}`, img)

    return newFileName
}