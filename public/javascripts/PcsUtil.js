function getFileInfo(file,key){
    return JSON.stringify(file[key]).replace(/"/g, '')
}
