export default function Dashboard(){
    return (
        <div className="w-screen h-screen flex flex-row">
            <div className="flex flex-col flex-1 gap-3 my-auto mx-auto px-50">
                <h1 className="text-2xl font-bold my-10">Welcome to your dashboard!</h1>
                <p>This page is under construction</p>
            </div>
            <div className="overflow-hidden flex flex-1">
            <img src="background.jpg" className="rounded-tl-lg w-full h-full object-cover" />
            </div>
        </div>
    )
}