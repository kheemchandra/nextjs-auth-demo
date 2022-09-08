import Link from 'next/link'; 
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client'; 

import classes from './main-navigation.module.css';

function MainNavigation() { 
  const router = useRouter();

  const [ session, loading ] = useSession(); 

  async function logoutHandler(){
    const data = await signOut({redirect: false, callbackUrl: '/auth'}); 
    
    await router.push(data.url);
  }
  
  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && <li>
            <Link href='/auth'>Login</Link>
          </li>}
          {session && <li>
            <Link href='/profile'>Profile</Link>
          </li>}
          {session && <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
