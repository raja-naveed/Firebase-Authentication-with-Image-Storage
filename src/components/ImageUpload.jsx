import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  updateMetadata,
  getMetadata,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage, auth } from "../firebase"; // Make sure to import your Firebase storage reference and authentication object

function ImageUpload() {
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);

  const handleClick = () => {
    if (img !== null) {
      const imageId = v4(); // Generate a unique ID for the image
      const imgRef = ref(storage, `files/${imageId}`);

      // Upload the selected image to Firebase Storage
      uploadBytes(imgRef, img).then((snapshot) => {
        console.log("Image uploaded:", snapshot);

        // Update the image's metadata to include the user's UID
        const user = auth.currentUser;
        if (user) {
          const metadata = {
            customMetadata: {
              uploadedBy: user.uid,
            },
          };
          updateMetadata(imgRef, metadata).then(() => {
            console.log("Image metadata updated with user UID:", user.uid);

            // Get the download URL for the uploaded image
            getDownloadURL(imgRef).then((url) => {
              setImgUrl((data) => [...data, url]);
            });
          });
        }
      });
    }
  };

  useEffect(() => {
    // List all images in the "files" folder in Firebase Storage
    listAll(ref(storage, "files"))
      .then((imgs) => {
        const urls = [];
        const user = auth.currentUser;

        imgs.items.forEach((item) => {
          // Get image metadata to check if it was uploaded by the current user
          getMetadata(item).then((metadata) => {
            if (user && metadata.customMetadata.uploadedBy === user.uid) {
              getDownloadURL(item).then((url) => {
                urls.push(url);
                setImgUrl(urls);
              });
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error listing images:", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold">Image Upload</h1>
        </div>
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select an Image
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImg(e.target.files[0])} // Assuming setImg is correctly passed as a prop
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-6">
          <button
            onClick={handleClick}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Upload
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {imgUrl.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Image ${index}`}
                className="rounded-lg max-h-96 mx-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
