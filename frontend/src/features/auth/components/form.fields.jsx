export default function FormField({name, labelText, placeholder, onChange}){
    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">{labelText}</label>
            <input name={name} placeholder={placeholder} onChange={onChange} type="text" className="rounded-md p-1  border border-gray-200 text-sm" />
        </div>
    )
}
