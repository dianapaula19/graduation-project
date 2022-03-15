interface IModalProps {
    title: string;
    setIsOpen: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

export type {
    IModalProps
}