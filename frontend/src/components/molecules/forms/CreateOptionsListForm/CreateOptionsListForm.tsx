import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import CheckBox from "../../../atoms/CheckBox";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { CreateOptionsListFormType, ICreateOptionsListFormData, ICreateOptionsListFormProps } from "./CreateOptionsListForm.types";
import "./CreateOptionsListForm.scss";
import { useAppDispatch } from "../../../../app/hooks";
import { createOptionsListAsync } from "../../../../features/user/admin/createOptionsListSlice";
import { regexRules } from "../utils";
import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";


const CreateOptionsListForm = ({
  title = "",
  year = "", 
  semester = "",
  domain = "", 
  learningMode = "",
  degree = "",
  studyProgram = "",
  coursesIds = [],
  courses,
  type = CreateOptionsListFormType.create,
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

  const { t } = useTranslation();

  const domains: {[id: string]: string} = t("domains", {returnObjects: true}) as {[id: string]: string};
  const learningModes: {[id: string]: string} = t("learningModes", {returnObjects: true}) as {[id: string]: string};
  const degrees: {[id: string]: string} = t("degrees", {returnObjects: true}) as {[id: string]: string};
  const studyPrograms: {[id: string]: string} = t("studyPrograms", {returnObjects: true}) as {[id: string]: string};

  const [data, setData] = useState<ICreateOptionsListFormData>({
    title: title,
    year: parseInt(year),
    semester: parseInt(semester),
    domain: domain as Domain,
    learningMode: learningMode as LearningMode,
    degree: degree as Degree,
    studyProgram: studyProgram as StudyProgram,
    coursesIds: []
  });

  const validation = {
    title: data.title === "",
    year: data.year < 2 && data.year > 4,
    semester: data.semester < 1 && data.semester > 2,
    domain: !(data.domain === t(`${dropDownTranslate}.domain.placeholder`)),
    learningMode: !(data.learningMode === t(`${dropDownTranslate}.learningMode.placeholder`)),
    degree: !(data.degree === t(`${dropDownTranslate}.degree.placeholder`)),
    studyProgram: !(data.studyProgram === t(`${dropDownTranslate}.studyProgram.placeholder`)),
    coursesIds: data.coursesIds.length < 2
  }

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
    console.log(data);
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
          error={validation.domain} 
          errorMessage={t(`${dropDownTranslate}.domain.errorMessage`)} 
          label={t(`${dropDownTranslate}.domain.label`)} 
          placeholder={t(`${dropDownTranslate}.domain.placeholder`)}
          onChange={handleChange}
        >
          {Object.keys(domains).map((key) => {
            return (
              <option
                value={key}
              >
                {domains[key]}
              </option>
            )
          })}        
        </DropDown>
        <DropDown
          id={`${componentId}-learning-mode`}
          name="learning-mode" 
          error={validation.learningMode} 
          errorMessage={t(`${dropDownTranslate}.learningMode.errorMessage`)} 
          label={t(`${dropDownTranslate}.learningMode.label`)}
          placeholder={t(`${dropDownTranslate}.learningMode.placeholder`)}
          onChange={handleChange}
        >
          {Object.keys(learningModes).map((key) => {
            return (
              <option
                value={key}
              >
                {learningModes[key]}
              </option>
            )
          })}
        </DropDown>
        <DropDown
          id={`${componentId}-degree`}
          name="degree" 
          error={validation.degree} 
          errorMessage={t(`${dropDownTranslate}.degree.errorMessage`)} 
          label={t(`${dropDownTranslate}.degree.label`)}
          placeholder={t(`${dropDownTranslate}.degree.placeholder`)}
          onChange={handleChange}
        >
          {Object.keys(degrees).map((key) => {
            return (
              <option
                value={key}
              >
                {degrees[key]}
              </option>
            )
          })}
        </DropDown>
        <DropDown 
          id={`${componentId}-study-program`}
          name="study-program"
          error={validation.studyProgram} 
          errorMessage={t(`${dropDownTranslate}.studyProgram.errorMessage`)} 
          label={t(`${dropDownTranslate}.studyProgram.label`)}
          placeholder={t(`${dropDownTranslate}.studyProgram.placeholder`)}
          onChange={handleChange}
        >
          {Object.keys(studyPrograms).map((key) => {
            return (
              <option
                value={key}
              >
                {studyPrograms[key]}
              </option>
            )
          })}
        </DropDown>
        <InputField 
          id={`${componentId}-title`}
          name="title"
          type={InputFieldType.text} 
          error={validation.title} 
          errorMessage={t(`${inputTranslate}.title.errorMessage`)}
          label={t(`${inputTranslate}.title.label`)}
          placeholder={t(`${inputTranslate}.title.placeholder`)}
          onChange={handleChange} 
        />
        <InputField 
          id={`${componentId}-year`}
          name="year"
          type={InputFieldType.number} 
          min={2} max={4}
          error={validation.year} 
          errorMessage={t(`${inputTranslate}.year.errorMessage`)}
          label={t(`${inputTranslate}.year.label`)}
          placeholder={t(`${inputTranslate}.year.placeholder`)}
          onChange={handleChange}
        />
        <InputField 
          id={`${componentId}-semester`}
          name="semester"
          type={InputFieldType.number} 
          min={1} max={2}
          error={validation.semester} 
          errorMessage={t(`${inputTranslate}.semester.errorMessage`)}
          label={t(`${inputTranslate}.semester.label`)}
          placeholder={t(`${inputTranslate}.semester.placeholder`)}
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
              const idx = coursesIds.indexOf(course.id)
              if (idx === -1) {
                return <CheckBox
                        value={course.id}
                        name="courses" 
                        label={course.title}
                        onChange={handleChange} 
                      />
              }
              return <CheckBox
                      checked
                      value={course.id}
                      name="courses" 
                      label={course.title}
                      onChange={handleChange} 
                    />
            })}
            {validation.coursesIds && (<p>Please select at least one course</p>)}
          </div>
        </div>
      </div>
      <Button 
        label={type === CreateOptionsListFormType.create ? t("forms.createOptionsList.createButton") : t("forms.createOptionsList.updateButton")} 
        disabled={false} 
        modifier={ButtonModifier.save}
        onClick={onSubmit}
      />
    </div>
  )  
}


export default CreateOptionsListForm;