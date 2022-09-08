import { getSession, useSession } from 'next-auth/client';

import UserProfile from '../components/profile/user-profile';

function ProfilePage() { 

  return <UserProfile />;
}

export async function getServerSideProps(context){
  const session = await getSession(context); 

  if(!session){
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }

  return {
    props: {
      session: session
    }
  }
}

export default ProfilePage;
