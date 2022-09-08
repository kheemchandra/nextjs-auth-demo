import { connectToDB } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res){
  if(req.method === 'POST'){
    const data = req.body;
    const { email, password } = data;

    if(!email.includes('@') || !password || password.trim().length < 7){
      res.status(422).json({message: 'Invalid email or password. Password should contain atleast 7 characters!'});
      return;
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
      const sameUser = await usersCollection.findOne({email: email});
      if(sameUser){
        res.status(409).json({message: 'This email id is already in use!'});
        return;
      }
      const hashedPassword = await hashPassword(password);
      const result = await usersCollection.insertOne({email, password: hashedPassword});
      res.status(201).json({message: 'User created successfully'});
    }catch(error){
      res.status(500).json({message: 'Your registration failed!'});
    }
    
    client.close();

  }
}

// export default handler;