import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async(filepath, folder ='uploads') => {
    try {


        const rasult = await cloudinary.uploader.upload(filepath, {folder:folder, resource_type:"auto"})
        return rasult;
        
    } catch (error) {
      console.log("cloudinary uploads error", error)
      throw error  
    }
};

export const uploadOptimizedImage = async(filepath, folder= "uploads") => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder:folder,
            transformation: [
                {width:1920, hight:1080, crop:"limit"},
                {quality:'auto'},
                {fetch_format:'auto'}
            ]
        })
        return result;
    } catch (error) {
        console.log("cloudinary optimization error", error);
        throw error;
    }
}

export const deleteFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
      console.log("cloudinary file delete failed,", error);
      throw error  
    }
};

export const getTransformedUrl = (publicId, width, hight) => {
    return cloudinary.url(publicId, {
        width:width,
        hight:hight,
        crop:'fill',
        quality:'auto',
        fetch_format:'auto'
    })
}