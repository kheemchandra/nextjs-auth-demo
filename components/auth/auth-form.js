import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

import { signIn } from 'next-auth/client';

import classes from './auth-form.module.css';

function AuthForm() { 
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event){
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;

      const userData = {email: enteredEmail, password: enteredPassword};

    // optional: form validation
    if(!isLogin){      
      try{
        const response = await fetch('/api/auth/signup', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        }); 
        const result = await response.json(); 
        if(!response.ok){ 
          throw new Error(result.message || 'Something went wrong!');
        }     
        console.log(result.message); 
      }catch(error){
        console.log('Error: ', error.message);
      }      

    }else{
      try{ 
        const response = await signIn('credentials', {
          ...userData,
          redirect: false
        })  
        if(!response.ok){
          throw new Error('Invalid email or password!');
        } 
        console.log('Successfully logged in!'); 
        router.replace('/profile');
      }catch(error){
        console.log('Error: ', error.message);
      }

    }


  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
