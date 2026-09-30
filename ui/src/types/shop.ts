export interface review {
    id: number,
    userName: string,
    review: string,
}

export interface Item {
    id: number;
    icon: React.ElementType;
    text: string;
    description?: string[];
    href: string;
}

export interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    Icon: React.ElementType,
    title: string,
    description?: string[],
}