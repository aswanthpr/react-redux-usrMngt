  import multer ,{StorageEngine} from "multer";

  const storage:StorageEngine = multer.memoryStorage();
  const upload = multer({storage});
  export default upload;
  