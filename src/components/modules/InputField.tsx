import React from "react";
import { Input } from "../ui/input";

interface InputFieldProps {
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    placeholder,
    value,
    onChange,
}) => (
    <div className="space-y-2">
        <Input
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
    </div>
);

export default InputField;
