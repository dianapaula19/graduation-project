import { useAppDispatch, useAppSelector } from "app/hooks";
import { Role } from "components/App";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginUserData, loginToken } from "features/account/loginSlice";
import { studentDataStatus, studentDataData, studentDataAsync } from "features/user/student/studentDataSlice";
import { ApiStatus } from "features/Utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProfilePage.scss";


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

const ProfilePage = () => {

  const componentClassName = "profile-page";

  const { t } = useTranslation("pages");

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
    if (role === Role.STUDENT) {
      if (studentStatus === ApiStatus.idle && email !== undefined && token !== null) {
        dispatch(studentDataAsync({
          token, 
          email
        }))
      }
    }
  }, [
    studentStatus, 
    email, 
    token,
    dispatch,
    role
  ]);

  let component = null;

  if (role === Role.STUDENT 
    && studentStatus === ApiStatus.success
    && studentData !== null
  ) {

    const studentDataFields = [
      {
        name: t('profile.studentDataFields.domain'),
        data: t(`common:domains.${studentData.domain}`)
      },
      {
        name: t('profile.studentDataFields.learningMode'),
        data: t(`common:learningModes.${studentData.learning_mode}`)
      },
      {
        name: t('profile.studentDataFields.degree'),
        data: t(`common:degrees.${studentData.degree}`)
      },
      {
        name: t('profile.studentDataFields.studyProgram'),
        data: t(`common:studyPrograms.${studentData.study_program}`)
      },
      {
        name: t('profile.studentDataFields.currentGroup'),
        data: studentData.current_group
      },
      {
        name: t('profile.studentDataFields.currentYear'),
        data: studentData.current_year
      }
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
          className={`${componentClassName}__profile`}
        >
          {t('profile.profile')}
        </h1>
        <h3
          className={`${componentClassName}__personal-data`}
        >
          {t('profile.personalData')}
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

export default ProfilePage;