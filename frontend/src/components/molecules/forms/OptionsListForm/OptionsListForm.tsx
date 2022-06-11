import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import CheckBox from "../../../atoms/CheckBox";
import DropDown from "../../../atoms/DropDown";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import { IOptionsListFormData, IOptionsListFormProps } from "./OptionsListForm.types";
import "./OptionsListForm.scss";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { createOptionsListAsync } from "../../../../features/user/admin/createOptionsListSlice";
import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";
import { getCoursesCourses } from "../../../../features/user/admin/getCoursesSlice";
import { getOptionsListsCurrentOptionsList } from "../../../../features/user/admin/getOptionsListsSlice";
import { maxYears } from "../utils";
import { updateOptionsListAsync } from "../../../../features/user/admin/updateOptionsListSlice";


const OptionsListForm = ({
  type,
}
: IOptionsListFormProps
) => {

  const componentClassName = "options-list-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const coursesContainerClassName = `${fieldsContainerClassName}__courses-container`;
  
  const componentId = "options-list-form";

  const dropDownTranslate = "forms.optionsList.dropDownFields";
  const inputTranslate = "forms.optionsList.inputFields";
  const submitButtonsTranslate = "forms.optionsList.submitButtons";

  const courses = useAppSelector(getCoursesCourses);
  const currentOptionsList = useAppSelector(getOptionsListsCurrentOptionsList);
  
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const domains: {[id: string]: string} = t("domains", {returnObjects: true}) as {[id: string]: string};
  const learningModes: {[id: string]: string} = t("learningModes", {returnObjects: true}) as {[id: string]: string};
  const degrees: {[id: string]: string} = t("degrees", {returnObjects: true}) as {[id: string]: string};
  const studyPrograms: {[id: string]: string} = t("studyPrograms", {returnObjects: true}) as {[id: string]: string};

  const [data, setData] = useState<IOptionsListFormData>({
  title: '',
  year: 2,
  semester: 1,
  domain: 'placeholder',
  learningMode: 'placeholder',
  degree: 'placeholder',
  studyProgram: 'placeholder',
  coursesIds: []
  });

  const validation = {
  title: data.title === "",
  year: data.year < 2 || data.year > maxYears(data.domain, data.degree),
  semester: data.semester < 1 || data.semester > 2,
  domain: data.domain === 'placeholder',
  learningMode: data.learningMode === 'placeholder',
  degree: data.degree === 'placeholder',
  studyProgram: data.studyProgram === 'placeholder',
  coursesIds: data.coursesIds.length < 1
  } 
  
  const disableSubmitButton = 
  validation.title || 
  validation.year || 
  validation.semester || 
  validation.domain || 
  validation.learningMode ||
  validation.degree ||
  validation.studyProgram ||
  validation.coursesIds; 

  useEffect(() => {
  if (currentOptionsList) {
    setData({
    title: currentOptionsList.title,
    year: currentOptionsList.year,
    semester: currentOptionsList.semester,
    domain: currentOptionsList.domain,
    learningMode: currentOptionsList.learning_mode,
    degree: currentOptionsList.degree,
    studyProgram: currentOptionsList.study_program,
    coursesIds: Array.from(currentOptionsList.courses, course => course.id)
    })
  }
  }, [])
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
  const name = e.target.name;
  const value = e.target.value;
  if (name === "courses") {
    const copy = data.coursesIds;
    const id = parseInt(value)
    const index = copy.indexOf(parseInt(value));
    if (index === -1) {
    copy.push(id);
    } else {
    copy.splice(index, 1);
    }
    setData({
    ...data,
    coursesIds: copy
    })
  } else {
    setData({
    ...data,
    [name]: value
    });
  }
  console.log(data);
  }

  const onSubmit = () => {
  if (type === 'create') {
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
  else if (type === 'update' && currentOptionsList) {
    dispatch(updateOptionsListAsync({
    id: currentOptionsList.id,
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
      defaultValue={data.domain}
      value={data.domain}
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
      name="learningMode" 
      error={validation.learningMode} 
      errorMessage={t(`${dropDownTranslate}.learningMode.errorMessage`)} 
      label={t(`${dropDownTranslate}.learningMode.label`)}
      placeholder={t(`${dropDownTranslate}.learningMode.placeholder`)}
      defaultValue={data.learningMode}
      value={data.learningMode}
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
      defaultValue={data.degree}
      value={data.degree}
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
      name="studyProgram"
      error={validation.studyProgram} 
      errorMessage={t(`${dropDownTranslate}.studyProgram.errorMessage`)} 
      label={t(`${dropDownTranslate}.studyProgram.label`)}
      placeholder={t(`${dropDownTranslate}.studyProgram.placeholder`)}
      defaultValue={data.studyProgram}
      value={data.studyProgram}
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
      value={data.title}
      onChange={handleChange} 
    />
    <InputField 
      id={`${componentId}-year`}
      name="year"
      type={InputFieldType.number} 
      min={2} max={maxYears(data.domain, data.degree)}
      error={validation.year} 
      errorMessage={t(`${inputTranslate}.year.errorMessage`)}
      label={t(`${inputTranslate}.year.label`)}
      placeholder={t(`${inputTranslate}.year.placeholder`)}
      value={data.year}
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
      value={data.semester}
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
      {courses && courses.map((course) => {
        const idx = data.coursesIds.indexOf(course.id)
        return <CheckBox
            checked={idx === -1 ? false : true}
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
    label={
      type === "create" ? 
      t(`${submitButtonsTranslate}.create`) : 
      t(`${submitButtonsTranslate}.update`)
    } 
    disabled={disableSubmitButton} 
    modifier={disableSubmitButton ? ButtonModifier.disabled : ButtonModifier.save}
    onClick={onSubmit}
    />
    {type === 'update' && (
    <Button 
      label={t(`${submitButtonsTranslate}.delete`)}
      modifier={ButtonModifier.delete}
      disabled={false}
    />  
    )} 
  </div>
  )  
}


export default OptionsListForm;