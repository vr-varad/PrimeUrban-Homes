import { useState } from 'react';
import { RiEyeFill, RiEyeCloseFill } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      alert('Passwords do not match');
      setConfirmPassword('')
      setPassword('')
      return;
    }
    await axios.post(`/api/user/reset-password/${userId}/${token}`, { password })
      .then(() => {
        alert('Password reset successful');
        navigate('/sign-in')

      })
      .catch(() => {
        alert('Password reset failed');
        setPassword('');
        setConfirmPassword('');
      });

    
  };

  return (
    <div className='p-3 max-w-lg mx-auto my-10 flex flex-col justify-center items-center gap-7 text-xl'>
      <h1 className='text-2xl font-semibold'>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <div className='flex gap-4 items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className='p-3 border rounded-lg w-96'
              required
            />
            <span onClick={handleShowPasswordToggle}>
              {!showPassword ? <RiEyeCloseFill size={30} /> : <RiEyeFill size={30} />}
            </span>
          </div>
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className='p-3 border rounded-lg w-96'
            required
          />
        </div>
        <button type="submit" className=' p-3 my-10 border bg-green-400 hover:bg-green-900 rounded-lg w-96'>Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
