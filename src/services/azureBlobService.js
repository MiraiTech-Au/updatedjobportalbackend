import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config()

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('test');

export const uploadImage = async (file) => {
  const uniqueFileName = uuidv4() + '-' + file.originalname;
  const blobClient = containerClient.getBlockBlobClient(uniqueFileName);
  await blobClient.uploadFile(file.path);
  return blobClient.url;
};
export const uploadDoc = async (file) => {
  const uniqueFileName = uuidv4() + '-' + file.originalname;
  const blobClient = containerClient.getBlockBlobClient(uniqueFileName);
  await blobClient.uploadFile(file.path);
  return blobClient.url;
};

export const isImageFile = (file) => {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return imageMimeTypes.includes(file.mimetype);
};

export const isDocumentFile = (file) => {
  const documentMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return documentMimeTypes.includes(file.mimetype);
};

// exports.getFile = async (blobUrl) => {
//   // Logic to get the file from Azure Blob Storage using the URL
//   // Can involve generating a SAS token for direct client download or streaming the file
// };
export const getFile = async (blobUrl) => {
    // Returning the direct URL of the file
    return { url: blobUrl };
}