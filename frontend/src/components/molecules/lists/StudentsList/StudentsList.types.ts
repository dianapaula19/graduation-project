interface Student {
    first_name: string;
    last_name: string;
    email: string;
}

interface IStudentsListProps {
    students: Student[]
}

export type {
    Student,
    IStudentsListProps
}