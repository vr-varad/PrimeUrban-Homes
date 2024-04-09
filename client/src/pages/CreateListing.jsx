import { useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import axios from "axios";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'


const CreateListing = () => {

    const [files,setFiles] = useState([])
    const [formData,setFormData] = useState({
        images : [],
        name : "",
        description : "",
        address : "",
        type : "rent",
        parking : false,
        furnished : false,
        offer : false,
        bedrooms : 1,
        bathrooms : 1,
        regularPrice : 50,
        discountedPrice : 0,
        userRefernce : ""
    })
    const [imageUploadError,setImageUploadError] = useState(false)
    const [uploading,setUploading] = useState(false)
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false) 
    const {user} = useSelector((state)=> state.user)
    const navigate = useNavigate()

    const handleImageUpload = (e)=>{
        e.preventDefault();

        if(files.length === 0){
            setImageUploadError("Please select an image")
        }else if(files.length > 0 && files.length + formData.images.length <= 6){
            setUploading(true)
            setImageUploadError(false)
            const promise = []
            for (let i = 0; i < files.length; i++) {
                promise.push(storeImage(files[i]))
            }
            Promise.all(promise)
            .then((values)=>{
                if(values !== undefined){
                    console.log(values)
                    setFormData({...formData,images: formData.images.concat(values)})
                }
                setUploading(false)
                setImageUploadError(false)
            })
            .catch((error)=>{
                console.log(error)
                setImageUploadError("Image upload failed (greates than 2MB or not an image)")
                setFormData({...formData,images:[]})
            })
        }else{
            setImageUploadError("You can only upload 6 images")
            setUploading(false)
        }
        document.getElementById("images").value = "";

        
    }

    const storeImage = async (file) => {
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = Math.random().toString(36).substring(2) + Date.now() + '.' + file.name;
            const storageRef = ref(storage, `images/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            },
            (error) => {
                console.log(error)
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { 
                    resolve(downloadURL)
                })
            }
            )
        })
    }

    function handleChange(e){
        const {id,value} = e.target;
        if(id === 'sale' || id === 'rent'){
            setFormData({...formData,type:id})
        }

        if(id === 'parking' || id === 'furnished' || id === 'offer'){
            setFormData({...formData,[id]:!formData[id]})
        }
        if(e.target.type === 'number'){
            setFormData({...formData,[id]:Number(value)})
        }else if(e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({...formData,[id]:value})
        }
    }

    console.log(formData)

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(formData.images.length === 0){
                return setError("Please upload an image")
            }
            if(+formData.regularPrice < +formData.discountedPrice){
                return setError("Discount price cannot be greater than regular price")
            }
            setLoading(true)
            setError(false)
            const response = await axios.post('/api/listing/create',{
                ...formData,
                userRefernce : user.userWithoutPassword._id
            } , {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log(response)
            navigate('/listings/'+response.data.listing._id)
            setLoading(false)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-10">
        <div className="flex flex-col gap-4 flex-1">
            <input
                type="text"
                placeholder="Name"
                className="border p-3 rounded-lg"
                id="name"
                maxLength="62"
                minLength="10"
                required
                onChange={handleChange}
            />
            <textarea
                type="text"
                placeholder="Description"
                className="border p-3 rounded-lg"
                id="description"
                required
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder="Address"
                className="border p-3 rounded-lg"
                id="address"
                required
                onChange={handleChange}
            />

            <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
                <input
                    onChange={handleChange} 
                    checked = {formData.type === "sale"}
                    type="checkbox"
                    id="sale"
                    className="w-5"
                />
                <span>Sell</span>
            </div>
            <div className="flex gap-2">
                <input
                    onChange={handleChange}
                    checked = {formData.type === "rent"}
                    type="checkbox"
                    id="rent"
                    className="w-5"
                />
                <span>Rent</span>
            </div>
            <div className="flex gap-2">
                <input
                    onChange={handleChange}
                    checked = {formData.parking}
                    type="checkbox"
                    id="parking"
                    className="w-5"
                />
                <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
                <input
                    onChange={handleChange}
                    checked = {formData.furnished}
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                />
                <span>Furnished</span>
            </div>
            <div className="flex gap-2">
                <input
                    onChange={handleChange}
                    checked = {formData.offer}
                    type="checkbox"
                    id="offer"
                    className="w-5"
                />
                <span>Offer</span>
            </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                <input
                    onChange={handleChange}
                    value={formData.bedrooms}
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
                <input
                    onChange={handleChange}
                    value={formData.bathrooms}
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
                <input
                    onChange={handleChange}
                    value={formData.regularPrice}
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-col items-center">
                <p>Regular price</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    onChange={handleChange}
                    value={formData.discountedPrice}
                    type="number"
                    id="discountedPrice"
                    min="0"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    disabled = {!formData.offer}
                />
                <div className="flex flex-col items-center">
                    <p>Discounted price</p>
                    {formData.type === 'rent' ? <span className="text-xs">($ / month)</span> : <span className="text-xs">($)</span>}
            
                </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
            </span>
            </p>
            <div className="flex gap-4">
            <input
                onChange={(e)=> setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
            />
            <button
                disabled = {uploading}
                onClick={handleImageUpload}
                type="button"
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
            
            </div>
            {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
            {formData.images?.length > 0 &&  
            <div className="flex gap-4">
                {formData.images.map((image,index)=>(
                    <div className="flex flex-col justify-center gap-5" key={image}>
                        <img key={index} src={image} alt="img" className="w-20 h-20 object-cover rounded-lg" />
                        <button onClick={() => setFormData({ ...formData, images: formData.images.filter((img) => img !== image) })} className="p-1 bg-red-500 text-white rounded-lg">Delete</button>
                    </div>
                ))
                }
                </div>
            }
            <button disabled={loading || uploading}  className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create Listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
        </form>
    </main>
    );
};

export default CreateListing;
