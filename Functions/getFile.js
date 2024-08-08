const { readdirSync, lstatSync } = require('fs')
const { resolve } = require('path')
const path = require('path')

function loadFiles(dir) {

    const fileArr = []

    readdirSync(dir).forEach( (fileOrFolder) => {

        const fullPath = path.join(dir, fileOrFolder)

        if (lstatSync(fullPath).isDirectory()) {

            readdirSync(fullPath).forEach( (file) => {

                if(file.endsWith('.js')) fileArr.push(path.resolve(path.join(fullPath, file)))

            })

        } else if (fileOrFolder.endsWith('.js')) {

            fileArr.push(fullPath)

        }

    })    
    return fileArr
}

module.exports = { loadFiles }