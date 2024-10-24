import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../../../config/axiogCongig'
import './EditUser.css';
import { toast } from 'react-toastify';
import Spinner from '../../Loading/Spinner';


interface IUser {

    name: string;
    email: string;
    mobile: string;
    profileUrl: string;
  }

  interface IErrors {
    name?: string;
    email?: string;
    mobile?: string;
}

const AdminEditUser:React.FC = () => {
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<IErrors>({});
    const [isLoading, setLoading] = useState<boolean>(false);
    const { userId } = useParams<{userId:string}>();
    const [userData, setUserData] = useState<IUser>({
        name: '',
        email: '',
        mobile: '',
        profileUrl: ''
    });


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await API.get(`/admin/edit-user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    console.error('Failed to fetch user details');
                    navigate('/admin/dashboard');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/admin/dashboard');
            }
        };

        if (userId) {
            fetchUserData();
        } else {
            console.error('No userId found');
            navigate('/admin/dashboard');
        }
    }, [userId, navigate]);

    const validate = ():boolean => {
       
        if (!userData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!userData.email.trim()) {
            errors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email address is invalid';
        }
        if (!userData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d+$/.test(userData.mobile)) {
            errors.mobile = 'Mobile number must contain only digits';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        const token = localStorage.getItem('adminToken');
        const formData = new FormData();

        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('mobile', userData.mobile);
        if (profileImage) {
            formData.append('profileImg', profileImage);
        } else {
            formData.append('profileImg', userData.profileUrl);
        }

        try {
            const response = await API.put(`/admin/edit-user/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                navigate('/admin/dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoback = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div className='admin-edit-user'>
           
            <div className='admin-edit-user-form'>
                <h1>Edit User's Profile</h1>
                <img src={userData?.profileUrl} alt="User Profile" />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder='Username'
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder='Email address'
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <p className='error'>{errors.email}</p>}

                    <input
                        type="text"
                        name="mobile"
                        placeholder='Mobile'
                        value={userData.mobile}
                        onChange={handleInputChange}
                    />
                    {errors.mobile && <p className='error'>{errors.mobile}</p>}

                    <div className='file-input-container'>
                        <input
                            type="file"
                            name='profileImg'
                            id="file-input"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input" className="upload-img-btn">Upload Profile</label>
                    </div>

                    {isLoading ? (
                        <Spinner/>
                    ) : (
                        <button type='submit'>Save changes</button>
                    )}
                </form>
                <button onClick={handleGoback} className='goback-btn'>Go back</button>
            </div>
        </div>
    );
}

export default AdminEditUser;