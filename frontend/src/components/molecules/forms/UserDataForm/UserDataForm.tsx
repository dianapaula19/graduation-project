import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Degree, Domain, LearningMode, Role, StudyProgram } from "../../../App";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { IUserDataFormProps } from "./UserDataForm.types";
import "./UserDataForm.scss";
import Button from "../../../atoms/Button";

const UserDataForm = ({
  firstName = '',
  lastName = '',
  role = '',
  domain = '',
  learningMode = '',
  degree = '',
  studyProgram = ''
}: IUserDataFormProps) => {

  const componentClassName = "user-data-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const componentId = "user-data-form";
  const dropDownTranslate = "forms.userData.dropDownFields";
  const inputTranslate = "forms.userData.inputFields";
  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    firstName: firstName,
    lastName: lastName,
    role: role as Role,
    domain: domain as Domain,
    learningMode: learningMode as LearningMode,
    degree: degree as Degree,
    studyProgram: studyProgram as StudyProgram,
  });

  const validationUserData = {
    firstName: firstName.length < 1,
    lastName: lastName.length < 1,
    role: userData.role === t(`${dropDownTranslate}.role.placeholder`),
    domain: userData.role === t(`${dropDownTranslate}.domain.placeholder`),
    learningMode: userData.role === t(`${dropDownTranslate}.learningMode.placeholder`),
    degree: userData.role === t(`${dropDownTranslate}.degree.placeholder`),
    studyProgram: userData.role === t(`${dropDownTranslate}.studyProgram.placeholder`),
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({
      ...userData,
      [name]: value
    });
  }

  const roles: {[id: string]: string} = t("roles", {returnObjects: true}) as {[id: string]: string};
  const domains: {[id: string]: string} = t("domains", {returnObjects: true}) as {[id: string]: string};
  const learningModes: {[id: string]: string} = t("learningModes", {returnObjects: true}) as {[id: string]: string};
  const degrees: {[id: string]: string} = t("degrees", {returnObjects: true}) as {[id: string]: string};
  const studyPrograms: {[id: string]: string} = t("studyPrograms", {returnObjects: true}) as {[id: string]: string};

  return (
    <div
      className={componentClassName}
    >
      <div
        className={fieldsContainerClassName}
      >
        <InputField 
          type={InputFieldType.text} 
          error={false} 
          errorMessage={t(`${inputTranslate}.firstName.errorMessage`)} 
          label={t(`${inputTranslate}.firstName.label`)}
          placeholder={t(`${inputTranslate}.firstName.placeholder`)} 
        />
        <InputField 
          type={InputFieldType.text} 
          error={false} 
          errorMessage={t(`${inputTranslate}.lastName.errorMessage`)} 
          label={t(`${inputTranslate}.lastName.label`)}
          placeholder={t(`${inputTranslate}.lastName.placeholder`)}
        />
        <DropDown 
          error={false} 
          errorMessage={t(`${dropDownTranslate}.role.errorMessage`)} 
          label={t(`${dropDownTranslate}.role.label`)}
          placeholder={t(`${dropDownTranslate}.role.placeholder`)}
        >
          {Object.keys(roles).map((key) => {
            return (
              <option
                value={key}
              >
                {roles[key]}
              </option>
            )
          })}
        </DropDown>
        <Button label={"Verify User"} disabled={false} />
      </div>

    </div>
  )
}

export default UserDataForm; 