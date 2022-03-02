import { InputHTMLAttributes } from "react";

enum InputFieldType {
    email = "email",
    password = "password",
    text = "text"
}

enum InputFieldModifier {
    error = "error"
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>{
    modifier?: InputFieldModifier;
    type: InputFieldType;
    name: string;
    id: string;
    placeholder: string;
    required: boolean;
    error: boolean;
    errorMessage: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

export type { 
    InputFieldProps 
}

export {
    InputFieldType,
    InputFieldModifier
}