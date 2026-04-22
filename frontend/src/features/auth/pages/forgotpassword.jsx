import FormField  from "../components/form.fields"; 
import {useState} from "react";

export default function ForgotPasswordPage(){
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const onChange = (e) => {
        setEmail(e.target.value);
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(email);
        if(email.length < 1 ) {
            console.log("Invalid email");
            throw new Error("Error")
        }
        try{
            const response = await fetch("http://127.0.0.1:3000/auth/forgot-password/", {
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({email})
            });
            const data = await response.json();
            console.log(data);
            if(!response.ok){
                console.log("Error in backend");
            }
            if(data.message){
            setSubmitted(true);
            }
        } catch (error) {+
            console.log("Encountered the following error requesting forget password", error)
        }
    } 
    return (
        <div className="w-screen h-screen flex bg-gray-200 flex-col justify-center align-center">
            <div className="flex flex-col bg-gray-50 w-[30%] h-[60%] mx-auto my-auto px-10 rounded-md shadow-md">
            { submitted ? (
                <div className="min-w-[60%] flex flex-col mx-auto my-auto">
                   <img src="/check.png" className="w-35 h-35 mx-auto"/>
                   <p className="text-xl font-bold mx-auto">Email successfully sent, check mail</p>  
                </div>
            ) : (
            <div>
                <p className="text-2xl font-bold my-7">Please provide email</p>
                <form onSubmit={handleSubmit} className="mt-10 mx-auto">
                    <FormField type="email" placeholder="Type email used for the account" labelText="Email" name="email" onChange={onChange}/>
                    <button className="btn bg-amber-600 rounded-md p-2 w-full text-sm text-white font-semibold my-2">Submit</button>
                </form>
            </div>
            )
        }
        </div>
        </div>
    )
}