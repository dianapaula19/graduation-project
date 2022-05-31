import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginToken, loginUserData } from "../../../features/auth/loginSlice";
import { studentDataAsync, studentDataData, studentDataStatus } from "../../../features/user/student/studentDataSlice";
import { ApiStatus } from "../../../features/Utils";
import { Role } from "../../App";
import LoggedUserPage from "../../templates/LoggedUserPage";
import "./PersonalDataPage.scss";


const DataRow = (
    name: string, 
    data: string | number | undefined
) => {
    
    const componentClassName = "data-row"
    
    return (
        <div
            className={componentClassName}
        >
            <span
                className={`${componentClassName}__name`}
            >
                {name}
            </span>
            <span
                className={`${componentClassName}__data`}
            >
                {data}
            </span>
        </div>
    )
}

const GradeRow = (
    year: number | undefined, 
    grade: number | undefined
) => {
    
    const componentClassName = "grade-row"
    
    return (
        <div
            className={componentClassName}
        >
            <span
                className={`${componentClassName}__year`}
            >
                {year}
            </span>
            <span
                className={`${componentClassName}__grade`}
            >
                {grade}
            </span>
        </div>
    )
}

const PersonalDataPage = () => {

    const componentClassName = "personal-data-page";

    const { t } = useTranslation();

    const studentClassName = `${componentClassName}__student`;
    const studentGradesName = `${studentClassName}__grades`;

    const dispatch = useAppDispatch();

    const userData = useAppSelector(loginUserData);
    const token = useAppSelector(loginToken);


    const role = userData?.role;
    const email = userData?.email;

    const profileDataFields = [
        {
            name: t('profile.profileDataFields.email'),
            data: userData?.email
        },
        {
            name: t('profile.profileDataFields.name'),
            data: `${userData?.first_name} ${userData?.last_name}`
        },
    ]

    const studentStatus = useAppSelector(studentDataStatus);
    const studentData = useAppSelector(studentDataData);

    useEffect(() => {
        if (role === Role.student) {
            if (studentStatus === ApiStatus.idle && email !== undefined && token !== null) {
                dispatch(studentDataAsync({
                    token, 
                    email
                }))
            }
        }
    }, [studentStatus, email, token]);

    let component = null;

    if (role === Role.student 
        && studentStatus === ApiStatus.success
        && studentData !== null
    ) {

        const studentDataFields = [
            {
                name: t('profile.studentDataFields.domain'),
                data: t(`domains.${studentData.domain}`)
            },
            {
                name: t('profile.studentDataFields.learningMode'),
                data: t(`learningModes.${studentData.learning_mode}`)
            },
            {
                name: t('profile.studentDataFields.degree'),
                data: t(`degrees.${studentData.degree}`)
            },
            {
                name: t('profile.studentDataFields.studyProgram'),
                data: t(`studyPrograms.${studentData.study_program}`)
            },
            {
                name: t('profile.studentDataFields.currentGroup'),
                data: studentData.current_group
            },
            {
                name: t('profile.studentDataFields.currentYear'),
                data: studentData.current_year
            },
            {
                name: t('profile.studentDataFields.currentSemester'),
                data: studentData.current_semester
            },
        ];

        component = (
            <div
                className={studentClassName}
            >
                <h3
                    className={`${studentClassName}__data`}
                >
                    {t('profile.studentData')}
                </h3>
                {studentDataFields.map((studentDataField) => {
                    return (
                        DataRow(studentDataField.name, studentDataField.data)
                    )
                })}
                <h3
                    className={`${studentClassName}__grade`}
                >
                    {t('profile.grade')}
                </h3>
                <div
                    className={studentGradesName}
                >
                    <div
                        className={`${studentGradesName}__header`}
                    >
                        <span
                            className={`${studentGradesName}__header__year`}
                        >
                            {t('profile.studentGradeFields.yearHeader')}
                        </span>
                        <span
                            className={`${studentGradesName}__header__grade`}
                        >
                            {t('profile.studentGradeFields.gradeHeader')}
                        </span>
                    </div>
                    {studentData.grades.map((grade) => {
                        return (
                            GradeRow(grade.year, grade.grade)
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <LoggedUserPage>
            <div
                className={componentClassName}
            >   
                <h1
                    className={`${componentClassName}__personal-data`}
                >
                    {t('profile.personalData')}
                </h1>
                <h3
                    className={`${componentClassName}__profile`}
                >
                    {t('profile.profile')}
                </h3>
                {profileDataFields.map((profileDataField) => {
                    return (
                        DataRow(profileDataField.name, profileDataField.data)
                    )
                })}
                {component}
            </div>
        </LoggedUserPage>
    )

}

export default PersonalDataPage;