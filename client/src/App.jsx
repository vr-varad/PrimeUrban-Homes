import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import Header from './components/Header'
import Privateroute from './components/Privateroute'
import CreateListing from './pages/CreateListing'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<Privateroute/>}>
            <Route path="/profile" element={<Profile/>}/>
            <Route path='/create-listing' element={<CreateListing/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App