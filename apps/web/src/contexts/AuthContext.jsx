
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (pb.authStore.isValid && pb.authStore.model) {
        setCurrentUser(pb.authStore.model);
      } else {
        setCurrentUser(null);
      }
      setInitialLoading(false);
    };

    checkAuth();

    // Optional: listen to auth store changes if needed, but manual updates usually suffice
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginParent = async (email, password) => {
    const authData = await pb.collection('parents').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const loginAdmin = async (email, password) => {
    const authData = await pb.collection('admins').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const signupParent = async (data) => {
    const record = await pb.collection('parents').create({
      ...data,
      enrollmentStatus: 'Pending',
      emailVisibility: true,
    }, { $autoCancel: false });
    return record;
  };

  const requestPasswordReset = async (email, collection = 'parents') => {
    await pb.collection(collection).requestPasswordReset(email, { $autoCancel: false });
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.collectionName === 'admins';
  const isParent = currentUser?.collectionName === 'parents';

  const value = {
    currentUser,
    initialLoading,
    loginParent,
    loginAdmin,
    signupParent,
    requestPasswordReset,
    logout,
    isAuthenticated: pb.authStore.isValid && currentUser !== null,
    isAdmin,
    isParent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
