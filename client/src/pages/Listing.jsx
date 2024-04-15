import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

import {useSelector} from 'react-redux';
import Contact from '../components/Contact';

const Listing = () => {
  SwiperCore.use([Navigation]);


  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchListing() {
      try {
        const id = params.listingId;
        const response = await axios.get(`/api/listing/get/${id}`);
        setListing(response.data.listings[0]);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);


  return (
    <main>
      {loading && (
        <div className="text-center my-7 font-semibold">Loading...</div>
      )}
      {error && (
        <div className="flex flex-col justify-center items-center ">
          <p className="text-red-500 text-center text-2xl my-6 font-semibold ">
            {error.message}
          </p>
          <button
            className="bg-green-400 p-3 text-center w-28 rounded-lg"
            onClick={() => navigate("/home")}
          >
            Home
          </button>
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[100vh]"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (<p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">Copied to clipboard</p>)}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 bg-blue-500 bg-opacity-50 rounded-lg'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${''}
              {listing.offer
                ? listing.discountedPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-blue-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountedPrice} OFF
                </p>
              )}
            </div>
            <p className='text-blue-800'>
              <span className='font-semibold text-blue-900'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-blue-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {user && listing.userRefernce !== user.userWithoutPassword._id && !contact && (
              <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95">Contact Landord</button>
            )}

            {contact && <Contact listing={listing}/>}


          </div>


        </div>
      )}
    </main>
  );
};

export default Listing;
