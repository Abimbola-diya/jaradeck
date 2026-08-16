import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(
    () => sessionStorage.getItem('jaradeck_role') || 'worker'
  );

  const setRole = (r) => {
    sessionStorage.setItem('jaradeck_role', r);
    setRoleState(r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
