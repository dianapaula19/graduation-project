import { useAppSelector, useAppDispatch } from "app/hooks";
import { Degree } from "components/App";
import Button, { ButtonModifier } from "components/atoms/Button";
import CheckBox from "components/atoms/CheckBox";
import DropDown from "components/atoms/DropDown";
import InputField, { InputFieldType } from "components/atoms/InputField";
import { PLACEHOLDER, degreeMap } from "components/Utils";
import { loginToken } from "features/account/loginSlice";
import { getCoursesCourses } from "features/user/admin/course/getCoursesSlice";
import { createOptionsListAsync } from "features/user/admin/optionsList/createOptionsListSlice";
import { deleteOptionsListAsync } from "features/user/admin/optionsList/deleteOptionsListSlice";
import { getOptionsListsCurrentOptionsList } from "features/user/admin/optionsList/getOptionsListsSlice";
import { updateOptionsListAsync } from "features/user/admin/optionsList/updateOptionsListSlice";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./OptionsListForm.scss";
import { IOptionsListFormProps, IOptionsListFormData } from "./OptionsListForm.types";

const OptionsListForm = ({
  type,
}
: IOptionsListFormProps
) => {

  const { t } = useTranslation('forms');

  const componentClassName = "options-list-form";
  const fieldsContainerClassName = `${componentClassName}__fields-container`;
  const coursesContainerClassName = `${fieldsContainerClassName}__courses-container`;
  
  const componentId = "options-list-form";

  const dropDownTranslate = "optionsList.dropDownFields";
  const inputTranslate = "optionsList.inputFields";
  const submitButtonsTranslate = "optionsList.buttons";

  const courses = useAppSelector(getCoursesCourses);
  const currentOptionsList = useAppSelector(getOptionsListsCurrentOptionsList);
  const token = useAppSelector(loginToken);

  const dispatch = useAppDispatch();

  const [data, setData] = useState<IOptionsListFormData>({
    title: '',
    year: 2,
    semester: 1,
    domain: PLACEHOLDER,
    learningMode: PLACEHOLDER,
    degree: PLACEHOLDER,
    studyProgram: PLACEHOLDER,
    coursesIds: []
  });
  
  const validation = {
    title: data.title === "",
    year: data.year < 2 || data.year > 4,
    semester: data.semester < 1 || data.semester > 2,
    domain: data.domain === PLACEHOLDER,
    learningMode: data.learningMode === PLACEHOLDER,
    degree: data.degree === PLACEHOLDER,
    studyProgram: data.studyProgram === PLACEHOLDER,
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
  }, [
    currentOptionsList
  ]);

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
      return;
    } 
    if (name === 'degree') {
      setData({
        ...data,
        degree: value,
        domain: PLACEHOLDER,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER,
      })  
      return;
    }
    if (name === 'domain') {
      setData({
        ...data,
        domain: value,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER
      })  
      return;
    }
    if (name === 'learningMode') {
      setData({
        ...data,
        learningMode: value,
        studyProgram: PLACEHOLDER
      })  
      return;
    }
    if (name === 'studyProgram') {
      setData({
        ...data,
        studyProgram: value
      })  
      return;
    }
    setData({
    ...data,
    [name]: value
    });   
  }

  const onSubmit = () => {
    if (token) {
      if (type === 'create') {
        dispatch(createOptionsListAsync({
          title: data.title,
          year: data.year,
          semester: data.semester,
          domain: data.domain,
          learning_mode: data.learningMode,
          degree: data.degree,
          study_program: data.studyProgram,
          courses_ids: data.coursesIds,
          token: token
        }))  
      }
      if (type === 'update' && currentOptionsList) {
        dispatch(updateOptionsListAsync({
          id: currentOptionsList.id,
          title: data.title,
          year: data.year,
          semester: data.semester,
          domain: data.domain,
          learning_mode: data.learningMode,
          degree: data.degree,
          study_program: data.studyProgram,
          courses_ids: data.coursesIds,
          token: token
        }))
      }
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
      id={`${componentId}-degree`}
      name="degree" 
      error={validation.degree} 
      errorMessage={t(`${dropDownTranslate}.degree.errorMessage`)} 
      label={t(`${dropDownTranslate}.degree.label`)}
      placeholder={t(`${dropDownTranslate}.degree.placeholder`)}
      value={data.degree}
      onChange={handleChange}
    >
      {
      Object.keys(Degree).map((key) => {
      return (
        <option
        value={key}
        >
        {t(`common:degrees.${key}`)}
        </option>
      )
      })}
      </DropDown>
    <DropDown 
      id={`${componentId}-domain`}
      name="domain"
      error={validation.domain} 
      errorMessage={t(`${dropDownTranslate}.domain.errorMessage`)} 
      label={t(`${dropDownTranslate}.domain.label`)} 
      placeholder={t(`${dropDownTranslate}.domain.placeholder`)}
      value={data.domain}
      onChange={handleChange}
    >
      { data.degree !== PLACEHOLDER &&
        Object.keys(degreeMap[data.degree]).map((key) => {
      return (
        <option
        value={key}
        >
        {t(`common:domains.${key}`)}
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
      value={data.learningMode}
      onChange={handleChange}
    >
      { data.degree !== PLACEHOLDER &&
        data.domain !== PLACEHOLDER &&
        Object.keys(degreeMap[data.degree][data.domain]).map((key) => {
      return (
        <option
          value={key}
        >
        {t(`common:learningModes.${key}`)}
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
      value={data.studyProgram}
      onChange={handleChange}
    >
      {data.degree !== PLACEHOLDER &&
        data.domain !== PLACEHOLDER &&
        data.learningMode !== PLACEHOLDER &&
        Object.keys(degreeMap[data.degree][data.domain][data.learningMode]).map((key) => {
      return (
        <option
        value={key}
        >
        {t(`common:studyPrograms.${key}`)}
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
      min={2} max={4}
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
      {t("optionsList.courses.label")}
      </span>
      <div
      className={`${coursesContainerClassName}__courses`}
      >
      { 
        courses && courses.filter(
          course => 
          course.semester === Number(data.semester) && 
          course.degree === data.degree
        ).map((course) => {
        const idx = data.coursesIds.indexOf(course.id)
        return <CheckBox
            checked={idx === -1 ? false : true}
            value={course.id}
            name="courses" 
            label={course.title}
            onChange={handleChange} 
          />
      })}
      {validation.coursesIds && (<p>{t("optionsList.courses.validation")}</p>)}
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
        onClick={() => {
          if (currentOptionsList && token) {
            dispatch(deleteOptionsListAsync({
              id: currentOptionsList.id,
              token: token
            }));
          }
        }}
      />  
    )} 
  </div>
  )  
}


export default OptionsListForm;