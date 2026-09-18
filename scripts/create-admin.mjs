import { Client, Users, Databases, ID, Query } from 'node-appwrite';

const required = ['NEXT_PUBLIC_APPWRITE_ENDPOINT','NEXT_PUBLIC_APPWRITE_PROJECT_ID','NEXT_PUBLIC_APPWRITE_DATABASE_ID','NEXT_PUBLIC_APPWRITE_COLLECTION_PROFILES','APPWRITE_API_KEY'];
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);
const [, , email, password, name='System Admin'] = process.argv;
if (!email || !password) throw new Error('Usage: node scripts/create-admin.mjs admin@example.com StrongPassword "System Admin"');
const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
const users = new Users(client); const db = new Databases(client);
const user = await users.create(ID.unique(), email, password, name);
await db.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROFILES, ID.unique(), { userId:user.$id, name, email, role:'admin', departmentId:null, position:'Administrator', status:'active' });
console.log(`Admin created: ${email}`);
