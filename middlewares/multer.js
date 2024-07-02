// we are creating this file to upload images of our product to local files

//npm i multer
import multer from "multer";
//npm i uuid
import { v4 as uuid } from "uuid"

const storage = multer.diskStorage({
     destination(req, file, cb) {
          cb(null, "uploads");//image file will be saved in uploads folder
     },

     filename(req, file, cb) {
          const id = uuid(); //this will create radom id

          const extName = file.originalname.split(".").pop();
          //this will give extention name of file ex- .png, .jpg etc

          const filename = `${id}.${extName}`;

          cb(null, filename);
     }

});

export const uploadFiles = multer({ storage }).single("image");