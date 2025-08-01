import axios from 'axios';
import {
    authRequest,
    authSuccess,
    authFailed,
    authError,
    stuffAdded,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    productSuccess,
    productDetailsSuccess,
    getProductDetailsFailed,
    getProductsFailed,
    setFilteredProducts,
    getSearchFailed,
    sellerProductSuccess,
    getSellerProductsFailed,
    stuffUpdated,
    updateFailed,
    getCustomersListFailed,
    customersListSuccess,
    getSpecificProductsFailed,
    specificProductSuccess,
    updateCurrentUser,
} from './userSlice';
import { toast } from 'react-toastify';

const REACT_APP_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// 🔵 Normal login/register


export const googleAuth = async (code, role) => {
    const response = await axios.post(`${REACT_APP_BASE_URL}/auth/googleLogin${role}`, {
        code,
        role,
    });
    return response.data;
};

export const googleLoginC = (code, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await googleAuth(code, role);
        if (result?.role) {
            dispatch(authSuccess(result));
            return result;
        } else {
            const failMessage = result?.message || "Google login failed";
            dispatch(authFailed(failMessage));
            return { message: failMessage };
        }
    } catch (error) {
        const errMsg = error.response?.data?.message || "Google login error";
        dispatch(authError(errMsg));
        return { message: errMsg };
    }
};
export const googleLoginS = (code, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await googleAuth(code, role);
        if (result?.role) {
            // dispatch(authSuccess(result));
            return result;
        } else {
            const failMessage = result?.message || "Google login failed";
            dispatch(authFailed(failMessage));
            return { message: failMessage };
        }
    } catch (error) {
        const errMsg = error.response?.data?.message || "Google login error";
        dispatch(authError(errMsg));
        return { message: errMsg };
    }
};

export const updateSellerProfile = (data) => async (dispatch, getState) => {
    try {
        const { currentUser } = getState().user;

        const emailToUse = data.email || currentUser?.email;
        if (!emailToUse) {
            toast.error("Email not found for seller");
            return;
        }

        const res = await axios.post(`${REACT_APP_BASE_URL}/auth/updateSellerProfile`, {
            email: emailToUse,
            shopName: data.shopName,
        });

        if (res.data.success) {
            return res.data;
        } else {
            toast.error(res.data.message || "Failed to update shop name");
        }
    } catch (err) {
        console.error("Error updating shop info:", err);
        toast.error(err.response?.data?.message || 'Update failed');
    }
};


export const authUser = (fields, role, mode) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${role}${mode}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

export const addStuff = (address, fields) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${address}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

export const updateStuff = (fields, id, address) => async (dispatch) => {
    try {
        const result = await axios.put(`${REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(updateFailed(result.data.message));
        } else {
            dispatch(stuffUpdated());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const deleteStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const updateCustomer = (fields, id) => async (dispatch) => {
    dispatch(updateCurrentUser(fields));
    const newFields = { ...fields };
    delete newFields.token;

    try {
        await axios.put(`${REACT_APP_BASE_URL}/CustomerUpdate/${id}`, newFields, {
            headers: { 'Content-Type': 'application/json' },
        });
        dispatch(stuffUpdated());
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getProductsbySeller = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getSellerProducts/${id}`);
        if (result.data.message) {
            dispatch(getSellerProductsFailed(result.data.message));
        } else {
            dispatch(sellerProductSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getProducts = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getProducts`);
        if (result.data.message) {
            dispatch(getProductsFailed(result.data.message));
        } else {
            dispatch(productSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getProductDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/getProductDetail/${id}`);
        if (result.data.message) {
            dispatch(getProductDetailsFailed(result.data.message));
        } else {
            dispatch(productDetailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getCustomers = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getCustomersListFailed(result.data.message));
        } else {
            dispatch(customersListSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getSpecificProducts = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getSpecificProductsFailed(result.data.message));
        } else {
            dispatch(specificProductSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const getSearchedProducts = (address, key) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${key}`);
        if (result.data.message) {
            dispatch(getSearchFailed(result.data.message));
        } else {
            dispatch(setFilteredProducts(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
