interface IModalProps {
    title: string;
    show: boolean;
    closeModal: () => void;
    children?: React.ReactNode;
}

export type {
    IModalProps
}