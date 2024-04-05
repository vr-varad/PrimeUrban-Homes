import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux'
import {signInFailure,signInStart,signInSuccess} from '../redux/user/userslice'
import OAuth from '../components/OAuth';



const SignIn = () => {
  const [formData, setFormdata] = useState({});
  const {loading,error} = useSelector((state)=>state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(e){
    setFormdata({...formData,[e.target.id]:e.target.value})
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const response = await axios.post('/api/auth/signin', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      if(response){
        dispatch(signInSuccess(response.data))
        dispatch(signInFailure(null))

        navigate('/')
      }
    } catch (error) {
      const err = error.response.data;
      if(err.success == false){
        dispatch(signInFailure(err.message))
      }
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
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button  className="bg-blue-500 p-4 rounded-full text-white uppercase hover:bg-blue-950 ">
        {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-4 justify-center">
        <p>New User?</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-800">Sign-Up</span>
        </Link>
      </div>
      {error ? <p className='text-red-500 m'>{error}</p>: ""}
    </div>
  );
}

export default SignIn