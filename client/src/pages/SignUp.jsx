import {Link} from 'react-router-dom'


const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign Up</h1>
      <form className="flex flex-col gap-5  ">
        <input
          type="text"
          placeholder="UserName"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-blue-500 p-4 rounded-full text-white uppercase hover:bg-blue-950 ">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-4 justify-center">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-800">Sign-In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
