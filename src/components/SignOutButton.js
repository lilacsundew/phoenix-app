import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './SignOutButton.css';

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button className="sign-out-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

export default SignOutButton; 