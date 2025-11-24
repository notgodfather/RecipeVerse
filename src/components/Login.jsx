import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User:', result.user);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default Login;
