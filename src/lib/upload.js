import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = async (file) => {

    if (!file) {
        return null
    }
    const storage = getStorage();
    const date = new Date();
    const storageRef = ref(storage, `images/${file.name + date}`);

    return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // console.log(error.message);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    resolve(downloadURL);
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    });
};

export default upload