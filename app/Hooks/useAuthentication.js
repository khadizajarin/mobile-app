import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

const useAuthentication = (app) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [app]);

  return { user, auth };
};

export default useAuthentication;