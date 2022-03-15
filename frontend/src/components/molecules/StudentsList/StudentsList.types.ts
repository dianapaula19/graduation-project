interface Student {
    name: string;
    email: string;
}

interface IStudentsListProps {
    students: Student[]
}

export type {
    Student,
    IStudentsListProps
}