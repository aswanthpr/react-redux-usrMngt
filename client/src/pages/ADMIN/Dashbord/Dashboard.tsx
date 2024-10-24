import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import API from '../../../../config/axiogCongig'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/adminAuthSlice'
import { toast } from 'react-toastify'
import Modal from '../../Modal/Modal'




interface IUser {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    profileUrl: string;
  }
const Dashboard:React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userDetails, setUserDetails] = useState<IUser[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<IUser|null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage:number = 5;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        if (token) {
            const fetchUserDetails = async () => {
                try {
                    const response = await API.get('/admin/dashboard', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            page: currentPage,
                            limit: itemsPerPage
                        }
                    });

                    console.log("response.data: ", response.data)

                    if (response.data.success) {
                        setUserDetails(response.data.users);
                        setTotalPages(response.data.totalPages);
                    } else {
                        toast.error('Failed to fetch user details');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    toast.error('Error fetching user details');
                }
            };

            fetchUserDetails();
        } else {
            toast.error('No token found, please log in again');
            navigate('/admin/login');
        }
    }, [currentPage,navigate]);


    const navigateToAddUser = () => {
        navigate('/admin/add-user');
    }

    const handleEditClick = (userId:string) => {
        navigate(`/admin/edit-user/${userId}`);
    };


    const filteredUsers = userDetails.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile.includes(searchQuery)
    );

    const handlePageChange = (newPage:number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteClick = (user:IUser) => {
        setUserToDelete(user);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if(!userToDelete) return;
        try {
            const token = localStorage.getItem('adminToken');
            console.log(token,userToDelete._id)
            const response = await API.delete(`/admin/delete-user/${userToDelete._id}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.data.success) {
                setUserDetails(userDetails.filter(user => user._id !== userToDelete._id));
                toast.success('User deleted successfully');
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error:any) {
            console.error('Error deleting user:', error.message);
            toast.error('Error deleting user');
        }

        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        dispatch(logout());
        navigate('/admin/login');
        
        toast.success('Logged out successfully');
    };

    console.log(userDetails)


    return (
        <div className='dashboard'>
       
            <div className='top-bar'>
               
                <button className='logout-button' onClick={handleLogout}>Logout</button>
            </div>
            <div className='container'>

                <div className='header'>
                    <p>Manage Users</p>
                    <div>
                        <input
                            type="text"
                            placeholder='Search for users...'
                            className='search-bar'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button >Search</button>
                    </div>
                    <button onClick={navigateToAddUser}>Add user</button>
                </div>

                <div className="users-list">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>  <img src={user.profileUrl} alt="img" className='profile' /></td>
                                        <td>
                                          
                                            {user.name}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.mobile}</td>
                                        <td>
                                        <button onClick={()=>handleEditClick(user._id)}>Edit</button>
                                            <button className='delete-btn' onClick={() => handleDeleteClick(user)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='no-users-found '>
                                    <td colSpan={4}>No users found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='pagination'>
                    <button
                        className='pagination-button'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    <div className='page-numbers'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`page-number-button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className='pagination-button'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>



            </div>

            <Modal
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete User?"
                body={`Are you sure you want to delete ${userToDelete?.name} ? `}
            />
        </div>
    )
}

export default Dashboard