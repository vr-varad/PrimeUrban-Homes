import { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const SignUp = () => {
  const [formData, setFormdata] = useState({});
  const [error,setError] =  useState(null);
  const [loading,setloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()

  function handleChange(e){
    setFormdata({...formData,[e.target.id]:e.target.value})
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setloading(true)
      const response = await axios.post('/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      if(response){
        setloading(false)
        setError(null)
        alert(response.data.message)
        navigate('/sign-in')
      }
    } catch (error) {
      const err = error.response.data;
      if(err.success == false){
        setError(err.message);
        setloading(false)
      }
    }
  }
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5  ">
        <input
          type="text"
          placeholder="UserName"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
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
        {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-4 justify-center">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-800">Sign-In</span>
        </Link>
      </div>
      {error ? <p className='text-red-500 m'>{error}</p>: ""}
    </div>
  );
};

export default SignUp;
