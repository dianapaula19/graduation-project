import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import CheckBox from "../../../atoms/CheckBox";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { ICreateOptionsListFormData, ICreateOptionsListFormProps } from "./CreateOptionsListForm.types";
import "./CreateOptionsListForm.scss";
import { useAppDispatch } from "../../../../app/hooks";
import { createOptionsListAsync } from "../../../../features/user/admin/createOptionsListSlice";


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
  const dispatch = useAppDispatch();


  const domains: string[] = [];
  const learningModes: string[] = [];
  const degrees: string[] = [];
  const studyPrograms: string[] = [];


  const { t } = useTranslation();

  const [data, setData] = useState<ICreateOptionsListFormData>({
    title: "",
    year: 0,
    semester: 0,
    domain: "",
    learningMode: "",
    degree: "",
    studyProgram: "",
    coursesIds: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "courses") {
      const id = parseInt(value)
      const index = data.coursesIds.indexOf(parseInt(value));
      if (index === -1) {
        data.coursesIds.push(id);
      } else {
        data.coursesIds.splice(index, 1);
      }
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  }

  const onSubmit = () => {
    dispatch(createOptionsListAsync({
      title: data.title,
      year: data.year,
      semester: data.semester,
      domain: data.domain,
      learning_mode: data.learningMode,
      degree: data.degree,
      study_program: data.studyProgram,
      courses_ids: data.coursesIds
    }))
  }

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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange} 
        />
        <InputField 
          id={`${componentId}-year`}
          name="year"
          type={InputFieldType.number} 
          error={false} 
          errorMessage={t(`${inputTranslate}.year.errorMessage`)}
          label={t(`${inputTranslate}.year.label`)}
          onChange={handleChange}
        />
        <InputField 
          id={`${componentId}-semester`}
          name="semester"
          type={InputFieldType.number} 
          error={false} 
          errorMessage={t(`${inputTranslate}.semester.errorMessage`)}
          label={t(`${inputTranslate}.semester.label`)}
          onChange={handleChange} 
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
            className={`${coursesContainerClassName}__courses`}
          >
            {courses.map((course) => {
              return <CheckBox
                        value={course.id}
                        name="courses" 
                        label={course.title}
                        onChange={handleChange} 
                      />
            })}
          </div>
        </div>
      </div>
      <Button 
        label={t("forms.createOptionsList.createButton")} 
        disabled={false} 
        modifier={ButtonModifier.save}
        onClick={onSubmit}
      />
    </div>
  )  
}

export default CreateOptionsListForm;