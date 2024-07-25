const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: "dppxrgwdn", 
    api_key: "546156376428478", 
    api_secret: "fSKN5D3WbndHPfphAHoL9wyZS2A" // Click 'View Credentials' below to copy your API secret
});

const uploadFile = async (localPath, folderName) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            folder: folderName
        }).catch((error)=>{console.log(error)});
        
        return uploadResult;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadFile
}