import "../../../index.css";

export default function EmailSentPage(){
    return (
        <div className="h-screen w-screen">
            <div className="max-w-[60vw] mx-auto pt-20 flex flex-col gap-8">
            <img src="/check.png" className="w-[5rem] h-[5rem] mx-auto my-10"/>
            <p className="text-2xl font-bold mx-auto">Email has been sent to provided email, Awaiting verification!</p>
            <button className="btn bg-amber-600 p-2 w-full font-semibold text-white rounded-md">Resend Email</button>
            </div>    
        </div>
    )
}