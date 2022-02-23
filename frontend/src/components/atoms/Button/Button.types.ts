enum ButtonModifier {
    Disabled = "disabled",
}

interface ButtonProps {
    label: string;
    disabled: boolean;
    onClick: () => void;
    modifier?: ButtonModifier
}

export type {
    ButtonProps
}

export {
    ButtonModifier
}