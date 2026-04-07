export function LoginPage(){    
return (
    <div className="w-screen flex-1 h-screen flex flex-row ">
        <div className="flex flex-col flex-1 gap-3 my-auto mx-auto px-50">
            <h1 className="text-2xl font-bold my-10">Get Started now</h1>
            <form className="flex flex-col gap-7">
                <FormField labelText="User Name" placeholder="Enter username" />
                <FormField labelText="Email" placeholder="Type Email"/>
                <FormField labelText="Password" placeholder="Password"/>
            </form>
            <div className="flex flex-row gap-1 my-4">
                <input type="radio" />
                <p>I agree to the <span>terms and policy</span></p>
            </div>
            <button className="btn bg-amber-600 p-2 w-full font-semibold text-white rounded-md">Sign Up</button>

            <p className="mx-auto my-5">or</p>
            <div className="flex flex-row gap-5 mx-auto ">
                <button className="btn bg-gray-100 p-1 rounded-md border border-gray-200 text-sm flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/google.png"/><p> Sign in with Google</p></button>
                <button className="btn bg-gray-100 rounded-md border border-gray-200 text-sm p-1 flex flex-row gap-1"><img className="w-[1.2rem] h-[1.2rem]" src="/apple.png"/><p>Sign in with Apple</p></button>
            </div>
             <div className="flex flex-row gap-2 mt-4 mx-auto text-sm">
                    <p>Have an account</p>
                    <a className="underline text-amber-600">Sign in</a>
                </div>
        </div>
        <div className="overflow-hidden flex flex-1">
        <img src="background.jpg" className="rounded-tl-lg w-full h-full object-cover" />
        </div>
    </div>
    )
}

function FormField({labelText, placeholder}){
    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">{labelText}</label>
            <input placeholder={placeholder} type="text" className="rounded-md p-1  border border-gray-200 text-sm" />
        </div>
    )
}
