import React from "react";
import OptionalCoursesContainer from "../../../molecules/OptionalCoursesContainer";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const OptionalCoursesSelectionPage = () => {
    return (
        <LoggedUserPage>
            <OptionalCoursesContainer 
                groupId="group-1" 
                groupTitle="Group #1"
                optionalCourses={[
                    {
                        optionalName: "English Literature",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                    },
                    {
                        optionalName: "Math",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                    {
                        optionalName: "Science",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                ]}
            />
            <OptionalCoursesContainer 
                groupId="group-2" 
                groupTitle="Group #1"
                optionalCourses={[
                    {
                        optionalName: "English Literature",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                    },
                    {
                        optionalName: "Math",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                    {
                        optionalName: "Science",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                ]}
            />
            <OptionalCoursesContainer 
                groupId="group-3" 
                groupTitle="Group #1"
                optionalCourses={[
                    {
                        optionalName: "English Literature",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                    },
                    {
                        optionalName: "Math",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                    {
                        optionalName: "Science",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                    },
                ]}
            />
        </LoggedUserPage>
    )
}

export default OptionalCoursesSelectionPage;