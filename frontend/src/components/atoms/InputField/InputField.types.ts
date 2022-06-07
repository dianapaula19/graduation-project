import { InputHTMLAttributes } from "react";

enum InputFieldType {
    email = "email",
    password = "password",
    text = "text",
    number = "number",
    file = "file"
}

enum InputFieldModifier {
    error = "error"
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>{
    modifier?: InputFieldModifier;
    type: InputFieldType;
    error: boolean;
    errorMessage: string;
    label: string;
}

export type { 
    InputFieldProps 
}

export {
    InputFieldType,
    InputFieldModifier
}