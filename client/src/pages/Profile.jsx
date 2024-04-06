
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'

const Profile = () => {
  const fileRef = useRef(null)

  const [file,setFile] = useState(undefined)

  useEffect(()=>{
    if(file){
      console.log(1)
      handleFileUpload(file)
    }
  },[file])
  const {user} = useSelector(state => state.user)
  const [progress, setProgress] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null) 
  const [formData, setFormData] = useState({
    username: user.userWithoutPassword.username,
    email: user.userWithoutPassword.email,
    profilePicture: user.userWithoutPassword.profilePicture
  })
  
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
        console.log("downloadUrl",downloadURL)
        setFormData(prevFormData => ({...prevFormData, profilePicture: downloadURL}))
      })
    })
    console.log(formData)
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
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
        <input type="text" placeholder="username" defaultValue={user.userWithoutPassword.username} id="username" className="p-3 border-black border rounded-xl" />
        <input type="text" placeholder="email" defaultValue={user.userWithoutPassword.email} id="email" className="p-3 border-black border rounded-xl"/>
        <input type="password" placeholder="password" id="password" className="p-3 border-black border rounded-xl"/>
        <button className="bg-blue-900 text-stone-50 p-3 rounded-lg uppercase">Submit</button>
      </form>
      <div className="flex justify-around mt-5">
        <button className="bg-red-500 text-white p-2 rounded-lg">Delete Account</button>
        <button className="bg-red-500 text-white p-2 rounded-lg pr-7 pl-7 ">Sign Out</button>
      </div>
    </div>
  )
}

export default Profile