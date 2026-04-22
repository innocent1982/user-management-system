import "../../../index.css";
import {useState} from "react";
import FormField from "../components/form.fields";
import { useNavigate } from "react-router-dom";

export default function SignInPage(){
    const navigate = useNavigate();
    const [form, setForm] = useState({email:"", password:""});
    const handleChange = (e) => {
            const new_form = {
            ...form,
            [e.target.name]:e.target.value
            };
            setForm(new_form)
    }
        const handleSubmit = async(e)=>{
            e.preventDefault();
            try{
            const response = await fetch("http://127.0.0.1:3000/auth/login/", {
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(form)
            })
            const data = await response.json();
            console.log(data)
            if(data.success){
                navigate("/dashboard");
            }else{
                console.log(data.message);
            }
        } catch (error) {
            console.log("Error when submitting form", error);
        }
        }
    
    return (
        <div className="w-screen h-screen flex bg-gray-200 flex-col justify-center align-center">
            <div className="flex flex-col bg-gray-50 gap-4 w-[30%] mx-auto my-auto px-10 rounded-md shadow-md">
                <h1 className="text-2xl font-bold my-10">Welcome back!</h1>
                <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                    <FormField labelText="Email" type="email" placeholder="Type Email" name="email" onChange={handleChange}/>
                    <FormField labelText="Password" type="password" placeholder="Password" name="password" onChange={handleChange}/>
                    <a onClick={()=>{navigate("/forgot-password")}} className="underline text-blue-600 self-end text-sm my-2">Forgot password?</a>
                    <button type="submit" className="btn bg-amber-600 p-2 w-full font-semibold text-white rounded-md">Sign In</button>
    
                </form>
                <p className="mx-auto my-2">or</p>
                <div className="flex flex-row gap-5 mx-auto ">
                    <button className="btn bg-gray-100 p-1 rounded-md border border-gray-200 text-sm flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/google.png"/><p> Sign in with Google</p></button>
                    <button className="btn bg-gray-100 rounded-md border border-gray-200 text-sm p-1 flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/apple.png"/><p>Sign in with Apple</p></button>
                </div>
                 <div className="flex flex-row gap-2 my-4 mx-auto text-sm">
                        <p>Have an account</p>
                        <a onClick={()=>{navigate("/signup")}} className="underline text-amber-600">Sign Up</a>
                    </div>
            </div>
        </div>
    )
}