import { MongoClient } from 'mongodb';

export async function connectToDB(){
  const client = MongoClient.connect('mongodb+srv://kheem:kheem@cluster0.ldo1rpm.mongodb.net/auth-demo-test?retryWrites=true&w=majority');
  return client;
}