import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleLoginC, googleLoginS } from './redux/userHandle';
import styled from 'styled-components';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify"
import { authSuccess } from './redux/userSlice';

const GoogleLogin = ({ role, mode }) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const responseGoogleCustomer = async (authResult) => {
		try {
			if (authResult?.code) {
				const result = await dispatch(googleLoginC(authResult.code, role));
				if (result?.name) {
					toast.success(`Welcome ${result.name}`, {
						autoClose: 1000
					});
				} else {
					toast.success(result.message || "Login successful");
				}
				navigate('/');
			} else {
				toast.error("No auth code received");
			}
		} catch (error) {
			console.error("Google Auth Error:", error);
			toast.error("Google Login Failed");
		}
	};

	const googleLoginCustomer = useGoogleLogin({
		onSuccess: responseGoogleCustomer,
		onError: responseGoogleCustomer,
		flow: "auth-code",
	});
	const responseGoogleSeller = async (authResult) => {
		try {
			if (authResult?.code) {
				const user = await dispatch(googleLoginS(authResult.code, 'Seller'));

				if (user && !user.shopName) {
					navigate('/shop-info', { state: { tempUser: user } });

				} else if (user) {
					toast.success(`Welcome ${user.name}`, {
						autoClose: 1000
					});
					navigate('/');
					dispatch(authSuccess(user));
				}
			} else {
				toast.error("No auth code received");
			}
		} catch (error) {
			console.error("Google Auth Error:", error);
			toast.error("Google Login Failed");
		}
	};

	const googleLoginSeller = useGoogleLogin({
		onSuccess: responseGoogleSeller,
		onError: responseGoogleSeller,
		flow: "auth-code",
	});
	return (
		<>
			{
				(role === 'Customer') &&
				<GoogleButton onClick={googleLoginCustomer} >
					<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
					Continue with Google
				</GoogleButton>
			}
			{
				(role === 'Seller') &&
				<GoogleButton onClick={googleLoginSeller} >
					<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
					Continue with Google
				</GoogleButton>
			}

		</>
	);
};

export default GoogleLogin;


const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  color: #3c4043;
  padding: 10px 20px;
  border-radius: 30px;
  border: 1px solid #dadce0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3),
              0px 1px 3px 1px rgba(60, 64, 67, 0.15);
  transition: box-shadow 0.2s ease;
  outline: none;

  &:hover {
    box-shadow: 0px 1px 3px rgba(60, 64, 67, 0.4),
                0px 4px 8px rgba(60, 64, 67, 0.2);
  }

  img {
    width: 22px;
    height: 22px;
  }
`;
