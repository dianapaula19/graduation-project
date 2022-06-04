import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import CheckBox from "../../../atoms/CheckBox";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { ICreateOptionsListFormProps } from "./CreateOptionsListForm.types";
import "./CreateOptionsListForm.scss";


const CreateOptionsListForm = ({
  courses
}
: ICreateOptionsListFormProps
) => {

  const componentClassName = "create-options-list-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const coursesContainerClassName = `${fieldsContainerClassName}__courses-container`;
  const dropDownTranslate = "forms.createOptionsList.dropDownFields";
  const inputTranslate = "forms.createOptionsList.inputFields";
  const componentId = "create-options-list-form";


  const domains: string[] = [];
  const learningModes: string[] = [];
  const degrees: string[] = [];
  const studyPrograms: string[] = [];


  const { t } = useTranslation();

  let dictionary = t("domains", {returnObjects: true}) as {[id: string]: string}
  Object.keys(dictionary).map((key) => domains.push(dictionary[key] as string)) 
  dictionary = t("learningModes", {returnObjects: true}) as {[id: string]: string}
  Object.keys(dictionary).map((key) => learningModes.push(dictionary[key] as string))
  dictionary = t("degrees", {returnObjects: true}) as {[id: string]: string}
  Object.keys(dictionary).map((key) => degrees.push(dictionary[key] as string))
  dictionary = t("studyPrograms", {returnObjects: true}) as {[id: string]: string}
  Object.keys(dictionary).map((key) => studyPrograms.push(dictionary[key] as string))
  

  return (
    <div
      className={componentClassName}
    >
      <div
        className={fieldsContainerClassName}
      >
        <DropDown 
          id={`${componentId}-domain`}
          name="domain"
          error={false} 
          errorMessage={t(`${dropDownTranslate}.domain.errorMessage`)} 
          label={t(`${dropDownTranslate}.domain.label`)} 
        >
          {domains.map((domain) => {
            return (
              <option>
                {domain}
              </option>
            )
          })}        
        </DropDown>
        <DropDown
          id={`${componentId}-learning-mode`}
          name="learning-mode" 
          error={false} 
          errorMessage={t(`${dropDownTranslate}.learningMode.errorMessage`)} 
          label={t(`${dropDownTranslate}.learningMode.label`)}
        >
          {learningModes.map((learningMode) => {
            return (
              <option>
                {learningMode}
              </option>
            )
          })}
        </DropDown>
        <DropDown
          id={`${componentId}-degree`}
          name="degree" 
          error={false} 
          errorMessage={t(`${dropDownTranslate}.degree.errorMessage`)} 
          label={t(`${dropDownTranslate}.degree.label`)}
        >
          {degrees.map((degree) => {
            return (
              <option>
                {degree}
              </option>
            )
          })}
        </DropDown>
        <DropDown 
          id={`${componentId}-study-program`}
          name="study-program"
          error={false} 
          errorMessage={t(`${dropDownTranslate}.studyProgram.errorMessage`)} 
          label={t(`${dropDownTranslate}.studyProgram.label`)}
        >
          {studyPrograms.map((studyProgram) => {
            return (
              <option>
                {studyProgram}
              </option>
            )
          })}
        </DropDown>
        <InputField 
          id={`${componentId}-title`}
          name="title"
          type={InputFieldType.text} 
          error={false} 
          errorMessage={t(`${inputTranslate}.title.errorMessage`)}
          label={t(`${inputTranslate}.title.label`)} 
        />
        <InputField 
          id={`${componentId}-year`}
          name="year"
          type={InputFieldType.number} 
          error={false} 
          errorMessage={t(`${inputTranslate}.year.errorMessage`)}
          label={t(`${inputTranslate}.year.label`)}
        />
        <InputField 
          id={`${componentId}-semester`}
          name="semester"
          type={InputFieldType.number} 
          error={false} 
          errorMessage={t(`${inputTranslate}.semester.errorMessage`)}
          label={t(`${inputTranslate}.semester.label`)} 
        />
        <div
          className={`${fieldsContainerClassName}__courses-container`}
        >
          <span
            className={`${coursesContainerClassName}__title`}
          >
            Courses
          </span>
          <div
            className={`${coursesContainerClassName}__options`}
          >
            {courses.map((course) => {
              return <CheckBox 
                        label={course.title} 
                      />
            })}
          </div>
        </div>
      </div>
      <Button 
        label={t("forms.createOptionsList.createButton")} 
        disabled={false} 
        modifier={ButtonModifier.save}
      />
    </div>
  )  
}

export default CreateOptionsListForm;