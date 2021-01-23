import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import useAuthSubmit from "../hooks/useAuthSubmit";
import Uploader from "../components/imgUploader";

export default function Account() {
    const activeUser = useSelector((state) => state.activeUser);
    const [values, setValues] = useState({
        first: activeUser.first,
        last: activeUser.last,
        email: activeUser.email,
        deleteAcc: false,
    });
    const [confirmDelete, setDeleteModal] = useState(false);
    const [uploadProfilePic, setUploadModal] = useState(false);
    const [error, handleSubmit] = useAuthSubmit("/user/profile/edit", values);

    const toggleDelete = () => {
        setValues({
            ...values,
            deleteAcc: !values.deleteAcc,
        });
        setDeleteModal(!confirmDelete);
    };

    const toggleUpload = () => {
        setUploadModal(!uploadProfilePic);
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const confirmModal = (
        <div className="modal" onClick={toggleDelete}>
            <div className="modal-box">
                <div className="modal-header">
                    <h2>Confirm Account Deletion</h2>
                    <button className="close-button" onClick={toggleDelete}>
                        X
                    </button>
                </div>
                <button onClick={handleSubmit}>Delete Account</button>
                <button onClick={toggleDelete}>Cancel</button>
            </div>
        </div>
    );

    return (
        <>
            {confirmDelete && confirmModal}
            {uploadProfilePic && <Uploader toggleModal={toggleUpload} />}
            <h2 className="title">Account Settings</h2>
            <div className="auth-container">
                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                    value={values.first}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    value={values.last}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={values.email}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="password"
                    placeholder="Change Password"
                    type="password"
                />
                <button onClick={handleSubmit}>Submit Changes</button>
                <Link to="/">
                    <button>Cancel</button>
                </Link>
                <button onClick={toggleUpload}>Change Profile Picture</button>
                <button onClick={toggleDelete}>Delete Account</button>
            </div>
        </>
    );
}
