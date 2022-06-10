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

const UserDataForm = ({
  role,
  email
}: IUserDataFormProps) => {

  const componentClassName = "user-data-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const componentId = "user-data-form";
  const dropDownTranslate = "forms.userData.dropDownFields";
  const inputTranslate = "forms.userData.inputFields";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const student = useAppSelector(getStudentsCurrentStudent);
  const teacher = useAppSelector(getTeachersCurrentTeacher);

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

  }, [student])

  const validationUserData = {
    firstName: userData.firstName.length < 1,
    lastName: userData.lastName.length < 1,
    role: userData.role === t('roles.PLACEHOLDER')
  }

  const validationStudentData = {
    domain: studentData.domain === t('domains.PLACEHOLDER'),
    learningMode: studentData.learningMode === t('learningModes.PLACEHOLDER'),
    degree: studentData.degree === t('degrees.PLACEHOLDER'),
    studyProgram: studentData.studyProgram === t('studyPrograms.PLACEHOLDER'),
    currentGroup: studentData.currentGroup.length < 1,
    currentYear: studentData.currentYear < 1 && studentData.currentYear > 4 
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
    setStudentData({
      ...studentData,
      [name]: value
    });
  } 

  const roles: {[id: string]: string} = t("roles", {returnObjects: true}) as {[id: string]: string};
  const domains: {[id: string]: string} = t("domains", {returnObjects: true}) as {[id: string]: string};
  const learningModes: {[id: string]: string} = t("learningModes", {returnObjects: true}) as {[id: string]: string};
  const degrees: {[id: string]: string} = t("degrees", {returnObjects: true}) as {[id: string]: string};
  const studyPrograms: {[id: string]: string} = t("studyPrograms", {returnObjects: true}) as {[id: string]: string};

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
              onChange={handleChangeUserData}
            >
            {Object.keys(roles).map((key) => {
              return (
                <option
                selected={userData.role === key ? true : false}
                  value={key}
                >
                  {roles[key]}
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
              value={studentData.domain}
              onChange={handleChangeStudentData}
            >
            {Object.keys(domains).map((key) => {
              return (
                <option
                  value={key}
                  selected={studentData.domain === key ? true : false}
                >
                  {domains[key]}
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
            {Object.keys(learningModes).map((key) => {
              return (
                <option
                  value={key}
                  selected={studentData.learningMode === key ? true : false}
                >
                  {learningModes[key]}
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
              value={studentData.degree}
              onChange={handleChangeStudentData}
            >
            {Object.keys(degrees).map((key) => {
              return (
                <option
                  value={key}
                  selected={studentData.degree === key ? true : false}
                >
                  {degrees[key]}
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
            {Object.keys(studyPrograms).map((key) => {
              return (
                <option
                  value={key}
                  selected={studentData.studyProgram === key ? true : false}
                >
                  {studyPrograms[key]}
                </option>
              )
            })}
            </DropDown>
            <InputField 
              type={InputFieldType.text}
              id={`${componentId}-current-group`}
              name={"currentGroup"} 
              defaultValue={studentData.currentGroup}
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
            label={"Verify User"} 
            disabled={disableButtonVerifyUser} 
            onClick={() => {
              dispatch(verifyUserAsync({
                  first_name: userData.firstName,
                  last_name: userData.lastName,
                  role: userData.role,
                  email: email
                }))
              }
            }
          />  
        )}
        {role === Role.STUDENT && (
          <Button 
            label={"Update Student's Info"} 
            modifier={disableButtonUpdateStudentDataInfo ? ButtonModifier.disabled : ButtonModifier.save}
            disabled={disableButtonUpdateStudentDataInfo} 
            onClick={() => {
              dispatch(updateStudentInfoAsync({
                  first_name: userData.firstName,
                  last_name: userData.lastName,
                  domain: studentData.domain,
                  learning_mode: studentData.learningMode,
                  degree: studentData.degree,
                  study_program: studentData.studyProgram,
                  grades: studentData.grades
                }))
              }
            }
          />  
        )}
        {role === Role.TEACHER && (
          <Button 
            label={"Update Teachers's Info"}
            modifier={disableButtonUpdateTeacherDataInfo ? ButtonModifier.disabled : ButtonModifier.save}
            disabled={disableButtonUpdateTeacherDataInfo}
            onClick={() => {
              dispatch(updateTeacherInfoAsync({
                first_name: userData.firstName,
                last_name: userData.lastName
              }));
            } }          
          />
        )}
        <Button 
          label={"Delete Account"}
          modifier={ButtonModifier.delete} 
          disabled={false}
        />
      </div>
    </div>
  )
}

export default UserDataForm; 