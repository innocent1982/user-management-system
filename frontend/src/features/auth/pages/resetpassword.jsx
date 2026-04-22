import FormField from "../components/form.fields";
import {useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [form, setForm] = useState({
        password:"",
        confirm:""
    });
    const onChange = (e) => {
        const {name, value} = e.target;
        const newForm = {
            ...form,
            [name]:value
        };
        setForm(newForm);
    }
    const validatePassword = (password, confirmation) => {
        if(password.length < 8 || password.length > 20){
            throw new Error("Password must be 8 - 20 chars long");
        }
        if(password != confirmation){
            console.log(password, confirmation
            )
            throw new Error("Password does not match");
        }
        return true;
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        const {password, confirm:confirmation} = form;
        console.log(form);
        const isValid = validatePassword(password, confirmation);
        if(!isValid){
            alert("Please provide a valid password");
        }
        const body = {
            password:password.toLowerCase(),
            confirmation:confirmation.toLowerCase(),
            token
        }
        try{
            const response = await fetch(`http://127.0.0.1:3000/auth/reset-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if(!data.success){
                console.log(data.message)
                throw new Error("Failed to set new password")
            }
            navigate("/")

        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="w-screen h-screen flex bg-gray-200 flex-col justify-center align-center">
            <div className="flex flex-col bg-gray-50 w-[30%] h-[60%] mx-auto my-auto px-10 rounded-md shadow-md">
                <p className="text-2xl font-bold my-7">Please provide new password</p>
                <form onSubmit={handleSubmit}>
                    <FormField type="password" onChange={onChange} placeholder="Type new password" labelText="New Password:" name="password"/>
                    <FormField type="password" onChange={onChange} placeholder="Confirm new password" labelText="Confirm New Password:" name="confirm"/>
                    <button className="btn bg-amber-600 rounded-md p-2 text-white">Submit</button>
                </form>
            </div>
        </div>
    )
}