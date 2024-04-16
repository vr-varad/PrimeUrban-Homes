import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux'
import {signInFailure,signInStart,signInSuccess} from '../redux/user/userslice'
import OAuth from '../components/OAuth';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";



const SignIn = () => {
  const [formData, setFormdata] = useState({});
  const {loading,error} = useSelector((state)=>state.user)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(e){
    setFormdata({...formData,[e.target.id]:e.target.value})
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart())
      console.log(4)
      const response = await axios.post('/api/auth/signin', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(2)
      if(response){
        console.log(1)
        dispatch(signInSuccess(response.data))
        dispatch(signInFailure(null))

        navigate('/')
      }

      console.log(error)
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5  ">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <div className='flex justify-between items-center'>
        <input
          type={!showPassword ? "password":"text"}
          placeholder="Password"
          className="border p-3 rounded-lg w-96"
          id="password"
          onChange={handleChange}
        />
        {showPassword ? (
          <FaEyeSlash
            className="right-4 top-4 text-blue-900 cursor-pointer " size={30}
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="right-4 top-4 text-blue-900 cursor-pointer" size={30}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
        </div>
        <button  className="bg-blue-500 p-4 rounded-full text-white uppercase hover:bg-blue-950 ">
        {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-4 justify-between">
        <div className='flex gap-2'>
        <p>New User?</p>
          <Link to={'/sign-up'}>
            <span className="text-blue-800">Sign-Up</span>
          </Link>
        </div>
        <div className='flex gap-2'>
          <p>Forgot Password?</p>
          <Link to={'/forgot-password'}>
            <span className="text-blue-800">Reset Password</span>
          </Link>
        </div>
      </div>
      {error ? <p className='text-red-500 m'>{JSON.stringify(error.message)}</p>: ""}
    </div>
  );
}

export default SignIn