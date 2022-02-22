enum ButtonModifier {
    Disabled = "disabled",
}

interface ButtonProps {
    label: string;
    disabled: boolean;
    modifier?: ButtonModifier
}

export type {
    ButtonProps
}

export {
    ButtonModifier
}