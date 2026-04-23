import {useState} from "react";
import FormField from "../components/form.fields";
import { useNavigate } from "react-router-dom";

export default function SignUpPage(){
    const navigate = useNavigate();
    const [registered, setRegistered] = useState(false);
    const [form, setForm] = useState({username:"", email:"", password:""});
    const handleChange = (e) => {
        const new_form = {
        ...form,
        [e.target.name]:e.target.value
        };
        setForm(new_form)
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:3000/auth/register/", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(form)
        })
        const data = await response.json();
        if(!data.success){
            alert("Failed to register user");
        }
        setRegistered(true);
    }

return (

    <div className="w-screen h-screen flex bg-gray-200 flex-col justify-center align-center">
        {registered ? (
            <div className="min-w-30 flex flex-col mx-auto my-auto">
                   <img src="/check.png" className="w-35 h-35 md:w-10 md:h-10 mx-auto"/>
                   <p className="text-xl font-bold mx-auto">Email successfully sent, check mail</p>  
                </div>
        ) : (
        <div className="flex flex-col bg-gray-50 gap-4 min-w-12 mx-auto my-auto px-10 md:h-full rounded-md shadow-md">
            <h1 className="text-2xl font-bold my-8">Get Started now</h1>
            <form className="flex flex-col gap-2 w-full " onSubmit={handleSubmit}>
                <FormField labelText="User Name" type="text" name="username" placeholder="Enter username" onChange={handleChange} />
                <FormField labelText="Email" type="email" placeholder="Type Email" name="email" onChange={handleChange}/>
                <FormField labelText="Password" type="password" placeholder="Password" name="password" onChange={handleChange}/>
                <div className="flex flex-row my-3 gap-1">
                <input type="radio" />
                <p>I agree to the <span className="underline">terms and policy</span></p>
            </div>
                <button type="submit" className="btn bg-amber-600 p-2 w-full font-semibold text-white rounded-md">Sign Up</button>
            </form>
            <p className="mx-auto my-2">or</p>
            <div className="flex flex-row gap-5 mx-auto ">
                <button className="btn bg-gray-100 p-1 rounded-md border border-gray-200 text-sm flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/google.png"/><p> Sign in with Google</p></button>
                <button className="btn bg-gray-100 rounded-md border border-gray-200 text-sm p-1 flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/apple.png"/><p>Sign in with Apple</p></button>
            </div>
             <div className="flex flex-row gap-2 my-4 mx-auto text-sm">
                <p>Have an account</p>
                <a onClick={()=>{navigate("/")}} className="underline text-amber-600">Sign In</a>
            </div>
            </div>
        )}
        </div>
    )
}
