import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import {app} from '../firebase.js'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userslice.js'
import axios from 'axios'
import {Navigate} from 'react-router-dom'

const OAuth = () => {
  const dispatch = useDispatch()
  const navigate = Navigate()
  async function handleGoogle(){
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)  
      const res = await axios.post('/api/auth/google', result.user,{
        headers: {
          'Content-Type': 'application/json'
        }
      })
      dispatch(signInSuccess(res.data))
      console.log(res)
      navigate('/')
    } catch (error) {
      console.log("Google OAuth Error: ", error)
    }
  }
  return (
    <button onClick={handleGoogle} type='button' className='bg-green-400 text-white p-3 rounded-3xl border-black hover:bg-green-900 uppercase'>Continue with Google</button>
  )
}

export default OAuth