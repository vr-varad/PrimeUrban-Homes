
import { useSelector } from "react-redux"

const Profile = () => {
  const { user } = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
        <img src={user.userWithoutPassword.profilePicture} alt="profile_picture" className="rounded-full h-50 w-50 object-cover mx-auto cursor-pointer self-center mt-2" />
        <input type="text" placeholder="username" defaultValue={user.userWithoutPassword.username} id="username" className="p-3 border-black border rounded-xl" />
        <input type="text" placeholder="email" defaultValue={user.userWithoutPassword.email} id="email" className="p-3 border-black border rounded-xl"/>
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