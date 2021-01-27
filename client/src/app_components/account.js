import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import useAuthSubmit from "../hooks/useAuthSubmit";
import Uploader from "../components/imgUploader";
import { Button, Input } from "@material-ui/core";

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
                    <Button onClick={toggleDelete}>
                        X
                    </Button>
                </div>
                <Button onClick={handleSubmit}>Delete Account</Button>
                <Button onClick={toggleDelete}>Cancel</Button>
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
                <Input
                    onChange={handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                    value={values.first}
                />
                <Input
                    onChange={handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    value={values.last}
                />
                <Input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={values.email}
                />
                <Input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="password"
                    placeholder="Change Password"
                    type="password"
                />
                <Button onClick={handleSubmit}>Submit Changes</Button>
                <Link to="/profile">
                    <Button>Cancel</Button>
                </Link>
                <Button onClick={toggleUpload}>Change Profile Picture</Button>
                <Button onClick={toggleDelete}>Delete Account</Button>
            </div>
        </>
    );
}
