import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateSellerProfile } from '../../../redux/userHandle';
import { authSuccess } from '../../../redux/userSlice';

const SellerShopInfo = () => {
    const [shopName, setShopName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tempUser = location.state?.tempUser;

    if (!tempUser) {
        return <p>Unauthorized. Please register or login first.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: tempUser.email,
            shopName,
        };

        const res = await dispatch(updateSellerProfile(payload));

        if (res?.success) {
            toast.success('Shop name saved!');

            // complete the login after profile is updated
            const finalUser = {
                ...tempUser,
                shopName: res.seller.shopName,
            };

            dispatch(authSuccess(finalUser));
            navigate('/');
        } else {
            toast.error(res?.message || 'Failed to save shop name');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Complete Your Seller Profile</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Shop Name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SellerShopInfo;
