import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginUserData } from "../../../../features/auth/loginSlice";
import { revertSaveStudentChoices, saveStudentChoicesCode, saveStudentChoicesShowModal } from "../../../../features/user/student/saveStudentChoicesSlice";
import { studentOptionalsListsAsync, studentOptionalsListsStatus, studentOptionalsLists, revertStudentOptionalsLists } from "../../../../features/user/student/studentOptionalsListsSlice";
import { ApiStatus } from "../../../../features/Utils";
import Loader from "../../../atoms/Loader";
import Modal from "../../../molecules/Modal";
import OptionalCoursesContainer from "../../../molecules/OptionalCoursesContainer";
import { IOptionalCourseCard } from "../../../molecules/OptionalCoursesContainer/OptionalCoursesContainer.types";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const OptionalCoursesSelectionPage = () => {

    const status = useAppSelector(studentOptionalsListsStatus);
    const userData = useAppSelector(loginUserData);
    const optionsLists = useAppSelector(studentOptionalsLists);
    const showModal = useAppSelector(saveStudentChoicesShowModal);
    const saveCode = useAppSelector(saveStudentChoicesCode);
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (status === ApiStatus.idle && userData !== null) {
            dispatch(studentOptionalsListsAsync({
                email: userData.email
            }))
        }
    }, [])

    let component = null;

    switch (status) {
        case ApiStatus.loading:
            component = (
                <div>
                    <Loader/>
                </div>
            )
            break;
        case ApiStatus.failed:
            component = (
                <div>
                    Oops, there was a mistake
                </div>
            )
            break;
        case ApiStatus.success:
            component = (
                <div>
                    <div>
                        <span
                            style={{
                                fontSize: 'x-large'
                            }}
                        >
                            Semestrul I
                        </span>
                        <div>
                        {optionsLists !== null && optionsLists.filter((optionsList) => optionsList.semester == 1).map((optionsList) => {
                            let courses: IOptionalCourseCard[] = []
                            optionsList.courses.forEach(course => {
                                courses.push({
                                    courseId: course.id,
                                    courseTitle: course.title,
                                    teacherName: `${course.teacher_first_name} ${course.teacher_last_name}`,
                                    teacherEmail: course.teacher_email,
                                    linkDocument: course.link,
                                })
                            });
                            return (
                                <OptionalCoursesContainer 
                                    optionalsListId={optionsList.id} 
                                    title={optionsList.title} 
                                    courses={courses} 
                                />
                            )
                        })}
                        </div>
                    </div>
                    <div>
                        <span
                            style={{
                                fontSize: 'x-large'
                            }}
                        >
                            Semestrul al II-lea
                        </span>
                        <div>
                        {optionsLists !== null && optionsLists.filter((optionsList) => optionsList.semester == 2).map((optionsList) => {
                            let courses: IOptionalCourseCard[] = []
                            optionsList.courses.forEach(course => {
                                courses.push({
                                    courseId: course.id,
                                    courseTitle: course.title,
                                    teacherName: `${course.teacher_first_name} ${course.teacher_last_name}`,
                                    teacherEmail: course.teacher_email,
                                    linkDocument: course.link,
                                })
                            });
                            return (
                                <OptionalCoursesContainer 
                                    optionalsListId={optionsList.id} 
                                    title={optionsList.title} 
                                    courses={courses} 
                                />
                            )
                        })}
                        </div>
                    </div>
                </div>
            )
            break;
        default:
            break;
    }
    

    return (
        <LoggedUserPage>
            {component}
            <Modal show={showModal} closeModal={() => {
                dispatch(revertSaveStudentChoices());
            }} >
                {saveCode}
            </Modal>
        </LoggedUserPage>
    )
}

export default OptionalCoursesSelectionPage;