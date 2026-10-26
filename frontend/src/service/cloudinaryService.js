import axios from 'axios';

//* the function that will upload the file it receives from the frontend to cloudinary
export const uploadImageToCloudinary = async (file, preset) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset); 

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/darbw0um8/image/upload`, 
      
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    attempt++;
    console.error(`Attempt ${attempt} failed:`, error.message);
    if (attempt >= maxAttempts) {
      throw new Error('Image upload failed after multiple attempts.');
    }
  }
}
};
