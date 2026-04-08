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
            const response = await fetch("http://127.0.0.1:3000/users/login/", {
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(form)
            })
            const data = await response.json();
            if(data.success){
                navigate("/dashboard");
            }else{
                alert(data.message);
            }
            
        } catch (error) {
            console.log("Error when submitting form", error);
        }
        }
    
    return (
        <div className="w-screen flex-1 h-screen flex flex-row ">
            <div className="flex flex-col flex-1 gap-3 my-auto mx-auto px-50">
                <h1 className="text-2xl font-bold my-10">Welcome back!</h1>
                <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
                    <FormField labelText="Email" placeholder="Type Email" name="email" onChange={handleChange}/>
                    <FormField labelText="Password" placeholder="Password" name="password" onChange={handleChange}/>
                    <button type="submit" className="btn bg-amber-600 p-2 w-full font-semibold text-white rounded-md">Sign In</button>
    
                </form>
                <p className="mx-auto my-5">or</p>
                <div className="flex flex-row gap-5 mx-auto ">
                    <button className="btn bg-gray-100 p-1 rounded-md border border-gray-200 text-sm flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/google.png"/><p> Sign in with Google</p></button>
                    <button className="btn bg-gray-100 rounded-md border border-gray-200 text-sm p-1 flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/apple.png"/><p>Sign in with Apple</p></button>
                </div>
                 <div className="flex flex-row gap-2 mt-4 mx-auto text-sm">
                        <p>Have an account</p>
                        <a onClick={()=>{navigate("/signup")}} className="underline text-amber-600">Sign Up</a>
                    </div>
            </div>
            <div className="overflow-hidden flex flex-1">
            <img src="background.jpg" className="rounded-tl-lg w-full h-full object-cover" />
            </div>
        </div>
    )
}