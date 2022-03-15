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
                        draggableProps: {
                            key: 0,
                            draggableId: "1",
                            index: 0
                        }
                    },
                    {
                        optionalName: "Math",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                        draggableProps: {
                            key: 1,
                            draggableId: "2",
                            index: 1
                        }
                    },
                    {
                        optionalName: "Science",
                        teacherName: "John Keating",
                        teacherEmail: "john.keating@unibuc.ro",
                        linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
                        draggableProps: {
                            key: 2,
                            draggableId: "3",
                            index: 2
                        }
                    },
                ]}
            />
        </LoggedUserPage>
    )
}

export default OptionalCoursesSelectionPage;