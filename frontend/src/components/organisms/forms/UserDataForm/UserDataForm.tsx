import { useAppDispatch, useAppSelector } from "app/hooks";
import { Role, Degree } from "components/App";
import Button, { ButtonModifier } from "components/atoms/Button";
import DropDown from "components/atoms/DropDown";
import InputField, { InputFieldType } from "components/atoms/InputField";
import { PLACEHOLDER, degreeMap } from "components/Utils";
import { loginToken } from "features/account/loginSlice";
import { deleteUserAsync } from "features/user/admin/user/deleteUserSlice";
import { getStudentsCurrentStudent } from "features/user/admin/user/getStudentsSlice";
import { getTeachersCurrentTeacher } from "features/user/admin/user/getTeachersSlice";
import { updateStudentInfoAsync } from "features/user/admin/user/updateStudentInfoSlice";
import { updateTeacherInfoAsync } from "features/user/admin/user/updateTeacherInfoSlice";
import { verifyUserAsync } from "features/user/admin/user/verifyUserSlice";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./UserDataForm.scss";
import { IUserDataFormProps } from "./UserDataForm.types";

const UserDataForm = ({
  role,
  email
}: IUserDataFormProps) => {

  const { t } = useTranslation('forms');

  const componentClassName = "user-data-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const gradesContainerClassName = `${fieldsContainerClassName}__grades-container`;
  const componentId = "user-data-form";
  const dropDownTranslate = "userData.dropDownFields";
  const inputTranslate = "userData.inputFields";
  const textTranslate = "userData.text";
  const submitButtonsTranslate = "userData.buttons";

  const dispatch = useAppDispatch();
  
  const student = useAppSelector(getStudentsCurrentStudent);
  const teacher = useAppSelector(getTeachersCurrentTeacher);
  const token = useAppSelector(loginToken);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: PLACEHOLDER
  });

  const [studentData, setStudentData] = useState({
    domain: PLACEHOLDER,
    learningMode: PLACEHOLDER,
    degree: PLACEHOLDER,
    studyProgram: PLACEHOLDER,
    currentGroup: '',
    currentYear: 1,
    grades1: 0.0,
    grades2: 0.0,
    grades3: 0.0,
    grades4: 0.0  
  });

  useEffect(() => {
    if (role === Role.STUDENT) {
      if (student) {
        let grades = [0.0, 0.0, 0.0, 0.0];
        student.grades.map((grade) => {
          grades[grade.year - 1] = grade.grade;
        })
        setUserData({
          ...userData,
          firstName: student.first_name,
          lastName: student.last_name
        })
        setStudentData({
          ...studentData,
          domain: student.domain === null ? PLACEHOLDER : student.domain,
          learningMode: student.learning_mode === null ? PLACEHOLDER : student.learning_mode,
          degree: student.degree === null ? PLACEHOLDER : student.degree,
          studyProgram: student.study_program === null ? PLACEHOLDER : student.study_program,
          currentGroup: student.current_group === null ? '' : student.current_group,
          currentYear: student.current_year === null ? 1 : student.current_year,
          grades1: grades[0],
          grades2: grades[1],
          grades3: grades[2],
          grades4: grades[3]
        });
      } 
    }
    if (role === Role.TEACHER) {
      if (teacher) {
        setUserData({
          ...userData,
          firstName: teacher.first_name,
          lastName: teacher.last_name
        })
      } 
    }

  }, [
    student, 
    teacher,
    role
  ])

  const validationUserData = {
    firstName: userData.firstName.length < 1,
    lastName: userData.lastName.length < 1,
    role: userData.role === PLACEHOLDER
  }

  const validationStudentData = {
    domain: studentData.domain === PLACEHOLDER,
    learningMode: studentData.learningMode === PLACEHOLDER,
    degree: studentData.degree === PLACEHOLDER,
    studyProgram: studentData.studyProgram === PLACEHOLDER,
    currentGroup: studentData.currentGroup.length < 1,
    currentYear: studentData.currentYear < 1 || studentData.currentYear > 4, 
    grade1: studentData.grades1 < 0.0 || studentData.grades1 > 10.0,
    grade2: studentData.grades2 < 0.0 || studentData.grades2 > 10.0,
    grade3: studentData.grades3 < 0.0 || studentData.grades3 > 10.0,
    grade4: studentData.grades4 < 0.0 || studentData.grades4 > 10.0, 
  }

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({
      ...userData,
      [name]: value
    });
  }

  const handleChangeStudentData = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'degree') {
      setStudentData({
        ...studentData,
        degree: value,
        domain: PLACEHOLDER,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER,
      })  
      return;
    }
    if (name === 'domain') {
      setStudentData({
        ...studentData,
        domain: value,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER
      })  
      return;
    }
    if (name === 'learningMode') {
      setStudentData({
        ...studentData,
        learningMode: value,
        studyProgram: PLACEHOLDER
      })  
      return;
    }
    if (name === 'studyProgram') {
      setStudentData({
        ...studentData,
        studyProgram: value
      })  
      return;
    }
    setStudentData({
      ...studentData,
      [name]: value
    });
  } 

  const disableButtonUpdateStudentDataInfo = 
    validationStudentData.degree || 
    validationStudentData.learningMode || 
    validationStudentData.degree || 
    validationStudentData.studyProgram ||
    validationStudentData.currentGroup ||
    validationStudentData.currentYear ||
    validationStudentData.grade1 ||
    validationStudentData.grade2 ||
    validationStudentData.grade3 ||
    validationStudentData.grade4;

  const disableButtonUpdateTeacherDataInfo = 
    validationUserData.firstName ||
    validationUserData.lastName;
  
  const disableButtonVerifyUser = 
    validationUserData.firstName ||
    validationUserData.lastName || 
    validationUserData.role;

  return (
  <div
    className={componentClassName}
  >
    <div
    className={fieldsContainerClassName}
    >
    <InputField 
      type={InputFieldType.text} 
      name={"firstName"}
      id={`${componentId}-first-name`}
      value={userData.firstName}
      error={validationUserData.firstName} 
      errorMessage={t(`${inputTranslate}.firstName.errorMessage`)} 
      label={t(`${inputTranslate}.firstName.label`)}
      placeholder={t(`${inputTranslate}.firstName.placeholder`)}
      onChange={handleChangeUserData} 
    />
    <InputField 
      type={InputFieldType.text}
      id={`${componentId}-last-name`}
      name={"lastName"} 
      value={userData.lastName}
      error={validationUserData.lastName} 
      errorMessage={t(`${inputTranslate}.lastName.errorMessage`)} 
      label={t(`${inputTranslate}.lastName.label`)}
      placeholder={t(`${inputTranslate}.lastName.placeholder`)}
      onChange={handleChangeUserData}
    />
    {role === Role.NONE && (
      <>
      <DropDown 
        error={validationUserData.role}
        id={`${componentId}-role`}
        name={"role"} 
        value={userData.role}
        errorMessage={t(`${dropDownTranslate}.role.errorMessage`)} 
        label={t(`${dropDownTranslate}.role.label`)}
        placeholder={t(`${dropDownTranslate}.role.placeholder`)}
        onChange={handleChangeUserData}
      >
      {Object.keys(Role).map((key) => {
        if (key !== Role.ADMIN && key !== Role.NONE) {
          return (
            <option
              selected={userData.role === key ? true : false}
              value={key}
            >
              {t(`common:roles.${key}`)}
            </option>
            )  
        }
      })}
      </DropDown>
      </>
    )}
    {role === Role.STUDENT && (
      <>
        <DropDown 
          error={validationStudentData.degree}
          id={`${componentId}-degree`}
          name={"degree"} 
          errorMessage={t(`${dropDownTranslate}.degree.errorMessage`)} 
          label={t(`${dropDownTranslate}.degree.label`)}
          placeholder={t(`${dropDownTranslate}.degree.placeholder`)}
          value={studentData.degree}
          onChange={handleChangeStudentData}
        >
          {Object.keys(Degree).map((key) => {
            return (
            <option
              value={key}
              selected={studentData.degree === key ? true : false}
            >
              {t(`common:degrees.${key}`)}
            </option>
            )
          })}
        </DropDown>
        <DropDown 
          error={validationStudentData.domain}
          id={`${componentId}-domain`}
          name={"domain"} 
          errorMessage={t(`${dropDownTranslate}.domain.errorMessage`)} 
          label={t(`${dropDownTranslate}.domain.label`)}
          placeholder={t(`${dropDownTranslate}.domain.placeholder`)}
          value={studentData.domain}
          onChange={handleChangeStudentData}
        >
        {studentData.degree !== "placeholder" && 
        Object.keys(degreeMap[studentData.degree]).map((key) => {
          return (
          <option
            value={key}
            selected={studentData.domain === key ? true : false}
          >
            {t(`common:domains.${key}`)}
          </option>
          )
        })}
        </DropDown>
        <DropDown 
          error={validationStudentData.learningMode}
          id={`${componentId}-learning-mode`}
          name={"learningMode"} 
          errorMessage={t(`${dropDownTranslate}.learningMode.errorMessage`)} 
          label={t(`${dropDownTranslate}.learningMode.label`)}
          placeholder={t(`${dropDownTranslate}.learningMode.placeholder`)}
          value={studentData.learningMode}
          onChange={handleChangeStudentData}
        >
        { studentData.degree !== "placeholder" &&
          studentData.domain !== "placeholder" && 
          Object.keys(degreeMap[studentData.degree][studentData.domain]).map((key) => {
          return (
          <option
            value={key}
            selected={studentData.learningMode === key ? true : false}
          >
            {t(`common:learningModes.${key}`)}
          </option>
          )
        })}
        </DropDown>
        <DropDown 
          error={validationStudentData.studyProgram}
          id={`${componentId}-study-program`}
          name={"studyProgram"} 
          errorMessage={t(`${dropDownTranslate}.studyProgram.errorMessage`)} 
          label={t(`${dropDownTranslate}.studyProgram.label`)}
          placeholder={t(`${dropDownTranslate}.studyProgram.placeholder`)}
          value={studentData.studyProgram}
          onChange={handleChangeStudentData}
        >
        { studentData.degree !== "placeholder" &&
          studentData.domain !== "placeholder" &&
          studentData.learningMode !== "placeholder" &&
          Object.keys(degreeMap[studentData.degree][studentData.domain][studentData.learningMode]).map((key) => {
          return (
          <option
            value={key}
            selected={studentData.studyProgram === key ? true : false}
          >
            {t(`common:studyPrograms.${key}`)}
          </option>
          )
        })}
        </DropDown>
        <InputField 
          type={InputFieldType.text}
          id={`${componentId}-current-group`}
          name={"currentGroup"} 
          value={studentData.currentGroup}
          error={validationStudentData.currentGroup} 
          errorMessage={t(`${inputTranslate}.currentGroup.errorMessage`)} 
          label={t(`${inputTranslate}.currentGroup.label`)}
          placeholder={t(`${inputTranslate}.currentGroup.placeholder`)}
          onChange={handleChangeStudentData}
        />
        <InputField 
          type={InputFieldType.number}
          id={`${componentId}-current-year`}
          name={"currentYear"} 
          value={studentData.currentYear}
          error={validationStudentData.currentYear} 
          errorMessage={t(`${inputTranslate}.currentYear.errorMessage`)} 
          label={t(`${inputTranslate}.currentYear.label`)}
          placeholder={t(`${inputTranslate}.currentYear.placeholder`)}
          onChange={handleChangeStudentData}
          min={1}
          max={4}
        />
          <div
            className={gradesContainerClassName}
          >
            <span
              style={{
                "fontSize": "medium"
              }}
            >
              {t(`${textTranslate}.gradesTitle`)}
            </span>
            <div>
            {[
              [1, 2, 3, 4].map((year: number) => {
                let defaultValue = 0.0;
                let value = 0.0;
                let validation = false;
                switch (year) {
                  case 1:
                    defaultValue = studentData.grades1;
                    value = studentData.grades1;
                    validation = validationStudentData.grade1;
                    break;
                  case 2:
                    defaultValue = studentData.grades2;
                    value = studentData.grades2;
                    validation = validationStudentData.grade2;
                    break;
                  case 3:
                    defaultValue = studentData.grades3;
                    value = studentData.grades3;
                    validation = validationStudentData.grade3;
                    break;
                  case 4:
                    defaultValue = studentData.grades4;
                    value = studentData.grades4;
                    validation = validationStudentData.grade4;
                    break;
                  default:
                    break;
                }
                return (
                  <div
                    className={`${gradesContainerClassName}__field`}
                  >
                    <InputField 
                      type={InputFieldType.number} 
                      value={year}
                      error={false} 
                      label={t(`${inputTranslate}.year.label`)} 
                      onChange={handleChangeStudentData}
                      disabled
                    />
                    <InputField
                      name={`grades${year}`}
                      type={InputFieldType.number}
                      value={value} 
                      error={validation} 
                      errorMessage={t(`${inputTranslate}.grade.errorMessage`)} 
                      label={t(`${inputTranslate}.grade.label`)}
                      placeholder={t(`${inputTranslate}.grade.placeholder`)} 
                      onChange={handleChangeStudentData}
                    />
                  </div> 
                )
              })
            ]}
            </div>
          </div>
      </>
    )}
    <br/>
    {role === Role.NONE && (
      <Button 
      label={t(`${submitButtonsTranslate}.verifyUser`)} 
      disabled={disableButtonVerifyUser} 
      onClick={() => {
        if (token) {
          dispatch(verifyUserAsync({
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            email: email,
            token: token
          }))
        }
        }
      }
      />  
    )}
    {role === Role.STUDENT && (
      <Button 
      label={t(`${submitButtonsTranslate}.student`)} 
      modifier={disableButtonUpdateStudentDataInfo ? ButtonModifier.disabled : ButtonModifier.save}
      disabled={disableButtonUpdateStudentDataInfo} 
      onClick={() => {
        if (token && student) {
          const grades = [
            {
              year: 1,
              grade: Number(studentData.grades1)
            },
            {
              year: 2,
              grade: Number(studentData.grades2)
            },
            {
              year: 3,
              grade: Number(studentData.grades3)
            },
            {
              year: 4,
              grade: Number(studentData.grades4)
            }
          ];
          console.log(grades);
          
          dispatch(updateStudentInfoAsync({
            email: student.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            domain: studentData.domain,
            learning_mode: studentData.learningMode,
            degree: studentData.degree,
            study_program: studentData.studyProgram,
            current_group: studentData.currentGroup,
            current_year: studentData.currentYear,
            grades: grades,
            token: token
          }))  
        }
        }
      }
      />  
    )}
    {role === Role.TEACHER && (
      <Button 
      label={t(`${submitButtonsTranslate}.teacher`)}
      modifier={disableButtonUpdateTeacherDataInfo ? ButtonModifier.disabled : ButtonModifier.save}
      disabled={disableButtonUpdateTeacherDataInfo}
      onClick={() => {
        if (token && teacher) {
          dispatch(updateTeacherInfoAsync({
            email: teacher.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            token: token
            }));  
        }
      } }      
      />
    )}
    <Button 
      label={t(`${submitButtonsTranslate}.delete`)}
      modifier={ButtonModifier.delete} 
      disabled={false}
      onClick={() => {
        if (token) {
          dispatch(deleteUserAsync({
            email: email,
            token: token
          }))
        }
      }}
    />
    </div>
  </div>
  )
}

export default UserDataForm; 