import {useState} from 'react'
import { useNavigate  } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.get(`/api/user/forgot-password/${email}`)
      alert('Reset link sent to your email')
      navigate('/')
    } catch (error) {
      alert('Email not found')
      navigate('/sign-up')
    }
  }
  const handleChange = (e) => {
    setEmail(e.target.value)
  }
  return (
    <div className='p-3 max-w-lg mx-auto my-10 flex flex-col items-center gap-5 text-xl '>
      <h1 className=' font-semibold '>Forgot Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" name="email" id="email" value={email} onChange={handleChange} className='w-96 border p-3 rounded-lg' placeholder='Enter Your Email.' required/>
        <button className='border rounded-lg bg-blue-500 hover:bg-blue-900 text-white w-96 p-3'>Submit</button>
      </form>
    </div>
  )
}

export default ForgotPassword