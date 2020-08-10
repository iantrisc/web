// eslint-disable-next-line import/extensions
import 'regenerator-runtime/runtime.js';

import { useState, useEffect } from 'react';

import API from '../constants/Api';

/**
 * Hook for the current user's session.
 *
 * @param {*} defaultValue The session's default value.
 */
export function useSession(defaultValue = false) {
  const [session, setSession] = useState(defaultValue);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API}/users/session`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok && response.status === 200) {
          const json = await response.json();

          setSession(json);
        } else {
          // the user is not logged.
          setSession({ email: '', name: '', type: 'notLogged' });
        }
      } catch (err) {
        console.log(err);
        setSession({ err });
      }
    }

    fetchData();
  }, []);

  return session;
}

export default useSession;
