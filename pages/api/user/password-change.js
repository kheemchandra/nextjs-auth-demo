import { getSession } from "next-auth/client";

import { connectToDB } from "../../../lib/db";
import { matchPassword, hashPassword } from '../../../lib/auth';

export default async function handler(req, res){
  if(req.method !== 'PATCH'){
    return;
  }
  
  const session = await getSession({ req });
  
  if(!session || !session.user?.email){
    res.status(401).json({message: 'User is not authenticated!'});
    return ;
  }

  const email = session.user.email;

  const { newPassword, oldPassword } = req.body;

  if(!newPassword || newPassword.trim().length < 7 || !oldPassword || oldPassword.trim().length < 7){
    res.status(422).json({message: 'Passwords should be at least 7 characters long!'});
    return ;
  }

  let client;
  try{
    client = await connectToDB();
  }catch(error){
    res.status(500).json({message: 'Couldn\'t connect to database!'});
    return;
  }

  try{ 
    const usersCollection = client.db().collection('users');
    
    const user = await usersCollection.findOne({email: email});
    
    if(!user){
      res.status(401).json({message: 'User is not authenticated!'});
      return ;
    }

    const oldHashedPassword = user.password;
    const isValid = await matchPassword(oldPassword, oldHashedPassword);
    
    if(!isValid){
      res.status(401).json({message: 'Incorrect old password!'});
      return ;
    }

    const newHashedPassword = await hashPassword(newPassword);

    await usersCollection.updateOne({email: email}, {
      $set: {
        password: newHashedPassword
      }
    }) 
    
    res.status(200).json({message: 'Your password updated successfully!'});
  }catch(error){
    res.status(500).json({message: 'Your password was not changed!'});
  }

  client.close();

}