import React from "react";

const useMessageEvent = (fn: (this: Window, ev: MessageEvent<any>) => any): void => {
  React.useEffect(() => {
    window.addEventListener('message', fn);
    return () => window.removeEventListener('message', fn);
  }, []);
}

interface AuthStorage {
  getAccessToken: () => any,
  setAccessToken: (access: any) => void,
  clearAccessToken: () => void,
  getRefreshToken: () => any,
  setRefreshToken: (refresh: any) => void,
  clearRefreshToken: () => void,
  getRole: () => any,
  setRole: (role: any) => void,
  clearRole: () => void,
  clearAll: () => void,
}

interface Credentials {
  username: string,
  password: string,
}

const authContext = React.createContext<{
  user: any,
  role: any,
  setRole: (newRole: any) => void,
  onLogin: (credentials: any) => Promise<void>,
  onLogout: () => void,
  authenticated: boolean,
  authenticating: boolean,
} | null>(null);

interface Props {
  login: (credentials: Credentials) => Promise<{ access: any, refresh: any }>,
  authorize: () => Promise<{ user: any, role: any }>,
  authStorage: AuthStorage,
  children: React.ReactNode,
}

const AuthProvider = ({ login, authorize, authStorage, children }: Props) => {
  const [user, setUser] = React.useState<any>();
  const [role, setRole] = React.useState<string | null>(() => authStorage.getRole());
  const [authenticating, setAuthenticating] = React.useState<boolean>(false);
  const [authenticated, setAuthenticated] = React.useState<boolean>(() => authStorage.getAccessToken());

  useMessageEvent((e: any) => {
    switch (e.data.type) {
      case  "FORCE_LOG_OUT":
        handleLogout();
        return;
    }
  });

  // Will be triggered after login (when authenticated becomes true)
  React.useEffect(() => {
    if (!authenticated) return;
    const handleAuthorization = async (): Promise<void> => {
      try {
        const { user, role } = await authorize();
        setUser(user);
        updateRole(role);
      } catch (err: any) {
        console.log(err);
      }
    }
    (async () => await handleAuthorization())();
  }, [authenticated]);

  const handleLogin = async (credentials: Credentials) => {
    setAuthenticating(true);
    try {
      const { access, refresh } = await login(credentials);
      authStorage.setAccessToken(access);
      authStorage.setRefreshToken(refresh);
      setAuthenticated(true);
    } catch (error) {
      console.log(error);
    } finally {
      setAuthenticating(false);
    }
  }

  const handleLogout = () => {
    authStorage.clearAll();
    setAuthenticated(false);
  }

  const updateRole = (newRole: string) => {
    authStorage.setRole(newRole);
    setRole(newRole);
  }

  const value = {
    user: user,
    role: role,
    setRole: updateRole,
    onLogin: handleLogin,
    onLogout: handleLogout,
    authenticated: authenticated,
    authenticating: authenticating,
  };

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
}

const useAuth = () => {
  return React.useContext(authContext);
}

export { AuthProvider, useAuth };
