import { ButtonHTMLAttributes } from "react";

enum ButtonModifier {
    disabled = "disabled",
    excel = "excel",
    save = "save"
}

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    disabled: boolean;
    modifier?: ButtonModifier
}

export type {
    IButtonProps
}

export {
    ButtonModifier
}