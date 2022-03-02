enum ButtonModifier {
    disabled = "disabled",
}

interface IButtonProps {
    label: string;
    disabled: boolean;
    onClick: () => void;
    modifier?: ButtonModifier
}

export type {
    IButtonProps
}

export {
    ButtonModifier
}