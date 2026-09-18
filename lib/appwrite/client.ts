import { Client, Account, Databases, Storage } from 'appwrite';
import { appwriteConfig } from './config';

export const appwriteClient = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);