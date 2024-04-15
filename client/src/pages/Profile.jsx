
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { useDispatch } from "react-redux"
import {updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signInFailure,signInStart,signInSuccess} from '../redux/user/userslice'
import {app} from '../firebase'
import axios from "axios"
import {useNavigate, Link} from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const Profile = () => {
  const fileRef = useRef(null)
  
  const [file,setFile] = useState(undefined)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  useEffect(()=>{
    if(file){
      console.log(1)
      handleFileUpload(file)
    }
  },[file])
  const {user,loading,error} = useSelector(state => state.user)
  const [progress, setProgress] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null) 
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListing, setUserListing] = useState([])
  const [showPassword, setShowPassword] = useState(false);

  
  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, `profilePictures/${fileName}`)
    const upload = uploadBytesResumable(storageRef, file)



    upload.on('state_changed', (snapshot) => {
      setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
        default:
          break;
      }
    }, (error) => {
      setFileUploadError(error)
    }, () => {
      getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
        setFormData(prevFormData => ({...prevFormData, profilePicture: downloadURL}))
      })
    })
  }


  function handleChange(e){
    setFormData(prevFormData => ({...prevFormData, [e.target.id]: e.target.value}))
  }

  async function handleSubmit(e){
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const updatedUser = await axios.post(`/api/user/update/${user.userWithoutPassword._id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(updatedUser.data)
      dispatch(updateUserSuccess(updatedUser.data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }

  async function handleDelete(){
    alert("Are you sure you want to delete your account?")
    try {
      dispatch(deleteUserStart())
      await axios.delete(`/api/user/delete/${user.userWithoutPassword._id}`)
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error))
      console.log(error)
    }
  }

  async function handleSignOut(){
    alert("Are you sure you want to sign out?")
    try {
      dispatch(signInStart())
      await axios.get('/api/auth/signout')
      dispatch(signInSuccess(null))
      navigate('/sign-in')
    } catch (error) {
      dispatch(signInFailure(error))
    }
  }

  async function handleShowListing(){
    try {
      setShowListingError(false)
      const response = await axios.get(`/api/user/listing/${user.userWithoutPassword._id}`);
      setUserListing(response.data.listings)
      console.log(userListing)

      
    } catch (error) {
      setShowListingError(error)
    }
  }

  async function handleDeleteListing(e){
    const listingId = e.target.parentElement.parentElement.children[0].href.split('/')[4]
    try {
      await axios.delete(`/api/listing/delete/${listingId}`)
      setUserListing(prevUserListing => prevUserListing.filter(listing => listing._id !== listingId))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="file" accept="image/*" ref={fileRef} hidden onChange={(e)=>setFile(e.target.files[0])} />
        <img src={formData.profilePicture || user.userWithoutPassword.profilePicture} alt="profile_picture" onClick={()=>fileRef.current.click()} className="rounded-full h-50 w-50 object-cover mx-auto cursor-pointer self-center mt-2" />
        {fileUploadError ?
          <p className="text-red-500 text-center">Error Uploading the image</p>
          : progress > 0 && progress < 100 ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-1/2 h-4 bg-gray-200 rounded-full">
                <div className="w-1/2 h-4 bg-blue-500 rounded-full" style={{width: `${progress}%`}}></div>
              </div>
              <p>{progress}%</p>
            </div>
          ) : progress === 100 ? (
            <p className="text-green-500 text-center">Image Uploaded Successfully</p>
          ) :
          (
            <p className="text-center">Upload a profile picture</p>
          )
        }
        <input type="text" onChange={handleChange} placeholder="username" defaultValue={user.userWithoutPassword.username} id="username" className="p-3 border-black border rounded-xl" />
        <input type="text" onChange={handleChange} placeholder="email" defaultValue={user.userWithoutPassword.email} id="email" className="p-3 border-black border rounded-xl"/>
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
        <button className="bg-blue-500 text-stone-50 p-3 rounded-lg uppercase hover:bg-blue-900">{loading?'Updating....':"Update"}</button>
        <Link to={'/create-listing'} className="bg-orange-400 p-3 rounded-xl uppercase text-center hover:bg-orange-800 text-white">
          Create Listing
        </Link>
      </form>
      {error ? <p className="text-red-500">{JSON.stringify(error.message)}</p>: ""}
      <div className="flex justify-around mt-5">
        <button className="bg-red-500 text-white p-2 rounded-lg pr-7 pl-7 hover:bg-red-900" onClick={handleDelete}>{loading?"Deleting...":"Delete"}</button>
        <button className="bg-red-500 text-white p-2 rounded-lg pr-7 pl-7 hover:bg-red-900" onClick={handleSignOut}>{loading?"Signing Out...":"Sign Out"}</button>
      </div>
      {updateSuccess && <p className="text-green-500 text-center">Profile Updated Successfully</p>}
      <button onClick={handleShowListing} className="bg-green-400 text-white rounded-lg p-3 pl-48 pr-48 my-8 mb-10 border hover:bg-green-800 " >Show Listings</button>
      {showListingError && <p className="text-red-500 text-center">Error Showing Listing...</p>}
      {userListing && userListing.length > 0  ? (
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-2xl font-semibold text-center mb-5">Listings</h1>
          {userListing.map((listing)=>(
            <div key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.images[0]} alt="listing" className="w-full h-48 object-cover" />
              </Link>
              <Link to={`/listing/${listing._id}`} className="text-blue-800 font-semibold hover:underline truncate">
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-row justify-between">
                <button onClick={handleDeleteListing} className=" uppercase bg-red-500 p-2 rounded-lg text-white">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-blue-600 p-2 rounded-lg text-white uppercase">Update</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        ):"No Listings Found"
      }
    </div>
  )
}

export default Profile