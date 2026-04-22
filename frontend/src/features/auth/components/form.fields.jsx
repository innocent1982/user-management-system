export default function FormField({name, labelText, placeholder, type, onChange}){
    return (
        <div className="flex flex-col gap-2 my-2">
            <label className="font-bold text-sm">{labelText}</label>
            <input name={name} placeholder={placeholder} onChange={onChange} type={type} className="rounded-md p-1  border border-gray-200 text-sm" />
        </div>
    )
}
