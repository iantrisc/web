import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { useSession } from '../hooks/User';
import { UserContext } from '../context/User';
import Dashboard from '../routes/Dashboard';

import Loading from '../components/Loading';

const StyledAdmin = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
`;

export default function Admin() {
  const user = useContext(UserContext);
  const session = useSession();

  useEffect(() => {
    if (user.data === null && session && !('err' in session)) {
      user.setData(session);
    }
  }, [session, user]);

  return (
    <StyledAdmin>
      {user.data !== null ? <Dashboard /> : <Loading />}
    </StyledAdmin>
  );
}
