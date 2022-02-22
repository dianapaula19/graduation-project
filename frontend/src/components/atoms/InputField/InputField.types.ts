enum InputFieldType {
    Email = "email",
    Password = "password",
    Text = "text"
}

enum InputFieldModifier {
    Error = "error"
}

interface InputFieldProps {
    modifier?: InputFieldModifier;
    type: InputFieldType;
    name: string;
    id: string;
    placeholder: string;
    required: boolean;
    error: boolean;
    errorMessage: string;
    onChange: () => void;
    label: string;
}

export type { 
    InputFieldProps 
}

export {
    InputFieldType,
    InputFieldModifier
}