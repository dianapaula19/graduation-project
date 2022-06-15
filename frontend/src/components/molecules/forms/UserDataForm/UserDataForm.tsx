import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Degree, Domain, LearningMode, Role, StudyProgram } from "../../../App";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { IUserDataFormProps } from "./UserDataForm.types";
import "./UserDataForm.scss";
import Button, { ButtonModifier } from "../../../atoms/Button";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { verifyUserAsync } from "../../../../features/user/admin/verifyUserSlice";
import { getStudentsCurrentStudent } from "../../../../features/user/admin/getStudentsSlice";
import { getTeachersCurrentTeacher } from "../../../../features/user/admin/getTeachersSlice";
import { updateStudentInfoAsync } from "../../../../features/user/admin/updateStudentInfoSlice";
import { updateTeacherInfoAsync } from "../../../../features/user/admin/updateTeacherInfoSlice";
import { loginToken, loginUserData } from "../../../../features/auth/loginSlice";

const UserDataForm = ({
  role,
  email
}: IUserDataFormProps) => {

  const componentClassName = "user-data-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const componentId = "user-data-form";
  const dropDownTranslate = "forms.userData.dropDownFields";
  const inputTranslate = "forms.userData.inputFields";
  const submitButtonsTranslate = "forms.userData.submitButtons";

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const student = useAppSelector(getStudentsCurrentStudent);
  const teacher = useAppSelector(getTeachersCurrentTeacher);
  const token = useAppSelector(loginToken);
  const user = useAppSelector(loginUserData);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: 'placeholder'
  });

  const [studentData, setStudentData] = useState({
    domain: 'placeholder',
    learningMode: 'placeholder',
    degree: 'placeholder',
    studyProgram: 'placeholder',
    currentGroup: '',
    currentYear: 1,
    grades: [],
  });

  useEffect(() => {
  if (role === Role.STUDENT) {
    if (student) {
      setUserData({
        ...userData,
        firstName: student.first_name,
        lastName: student.last_name
      })
      setStudentData({
        ...studentData,
        domain: student.domain === null ? 'placeholder' : student.domain,
        learningMode: student.learning_mode === null ? 'placeholder' : student.learning_mode,
        degree: student.degree === null ? 'placeholder' : student.degree,
        studyProgram: student.study_program === null ? 'placeholder' : student.study_program,
        currentGroup: student.current_group === null ? '' : student.current_group,
        currentYear: student.current_year === null ? 1 : student.current_year
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

  }, [student, teacher])

  const validationUserData = {
    firstName: userData.firstName.length < 1,
    lastName: userData.lastName.length < 1,
    role: userData.role === 'placeholder'
  }

  const validationStudentData = {
    domain: studentData.domain === 'placeholder',
    learningMode: studentData.learningMode === 'placeholder',
    degree: studentData.degree === 'placeholder',
    studyProgram: studentData.studyProgram === 'placeholder',
    currentGroup: studentData.currentGroup.length < 1,
    currentYear: studentData.currentYear < 1 || studentData.currentYear > 4 
  }

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const handleChangeStudentData = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  } 

  const disableButtonUpdateStudentDataInfo = 
    validationStudentData.degree || 
    validationStudentData.learningMode || 
    validationStudentData.degree || 
    validationStudentData.studyProgram ||
    validationStudentData.currentGroup ||
    validationStudentData.currentYear;
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
      defaultValue={userData.firstName}
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
      defaultValue={userData.lastName}
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
        defaultValue={userData.role}
        value={userData.role}
        errorMessage={t(`${dropDownTranslate}.role.errorMessage`)} 
        label={t(`${dropDownTranslate}.role.label`)}
        onChange={handleChangeUserData}
      >
      {Object.keys(Role).map((key) => {
        return (
        <option
          selected={userData.role === key ? true : false}
          value={key}
        >
          {t(`roles.${key}`)}
        </option>
        )
      })}
      </DropDown>
      </>
    )}
    {role === Role.STUDENT && (
      <>
      <DropDown 
        error={validationStudentData.domain}
        id={`${componentId}-domain`}
        name={"domain"} 
        errorMessage={t(`${dropDownTranslate}.domain.errorMessage`)} 
        label={t(`${dropDownTranslate}.domain.label`)}
        placeholder={t(`${dropDownTranslate}.domain.placeholder`)}
        defaultValue={studentData.domain}
        value={studentData.domain}
        onChange={handleChangeStudentData}
      >
      {Object.keys(Domain).map((key) => {
        return (
        <option
          value={key}
          selected={studentData.domain === key ? true : false}
        >
          {t(`domains.${key}`)}
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
        defaultValue={studentData.learningMode}
        value={studentData.learningMode}
        onChange={handleChangeStudentData}
      >
      {Object.keys(LearningMode).map((key) => {
        return (
        <option
          value={key}
          selected={studentData.learningMode === key ? true : false}
        >
          {t(`learningModes.${key}`)}
        </option>
        )
      })}
      </DropDown>
      <DropDown 
        error={validationStudentData.degree}
        id={`${componentId}-degree`}
        name={"degree"} 
        errorMessage={t(`${dropDownTranslate}.degree.errorMessage`)} 
        label={t(`${dropDownTranslate}.degree.label`)}
        placeholder={t(`${dropDownTranslate}.degree.placeholder`)}
        defaultValue={studentData.degree}
        value={studentData.degree}
        onChange={handleChangeStudentData}
      >
      {Object.keys(Degree).map((key) => {
        return (
        <option
          value={key}
          selected={studentData.degree === key ? true : false}
        >
          {t(`degrees.${key}`)}
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
        defaultValue={studentData.studyProgram}
        value={studentData.studyProgram}
        onChange={handleChangeStudentData}
      >
      {Object.keys(StudyProgram).map((key) => {
        return (
        <option
          value={key}
          selected={studentData.studyProgram === key ? true : false}
        >
          {t(`studyPrograms.${key}`)}
        </option>
        )
      })}
      </DropDown>
      <InputField 
        type={InputFieldType.text}
        id={`${componentId}-current-group`}
        name={"currentGroup"} 
        defaultValue={studentData.currentGroup}
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
        defaultValue={studentData.currentYear}
        value={studentData.currentYear}
        error={validationStudentData.currentYear} 
        errorMessage={t(`${inputTranslate}.currentYear.errorMessage`)} 
        label={t(`${inputTranslate}.currentYear.label`)}
        placeholder={t(`${inputTranslate}.currentYear.placeholder`)}
        onChange={handleChangeStudentData}
        min={1}
        max={4}
      />
      <div>

      </div>
      </>
    )}
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
            grades: studentData.grades,
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
    />
    </div>
  </div>
  )
}

export default UserDataForm; 