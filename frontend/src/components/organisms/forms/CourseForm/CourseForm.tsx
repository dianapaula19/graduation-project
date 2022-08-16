import { useAppSelector, useAppDispatch } from "app/hooks";
import { Degree } from "components/App";
import Button, { ButtonModifier } from "components/atoms/Button";
import DropDown from "components/atoms/DropDown";
import InputField, { InputFieldType } from "components/atoms/InputField";
import { PLACEHOLDER } from "components/Utils";
import { loginToken } from "features/account/loginSlice";
import { createCourseAsync } from "features/user/admin/course/createCourseSlice";
import { deleteCourseAsync } from "features/user/admin/course/deleteCourseSlice";
import { getCoursesCurrentCourse } from "features/user/admin/course/getCoursesSlice";
import { updateCourseAsync } from "features/user/admin/course/updateCourseSlice";
import { getTeachersTeachers } from "features/user/admin/user/getTeachersSlice";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./CourseForm.scss";
import { ICourseFormProps } from "./CourseForm.types";


const CourseForm = ({
  type,
  courseId
}: ICourseFormProps) => {

  const {t} = useTranslation('forms');
  
  const componentClassName = "course-form";
  const componentId = "course-id";
  const dropDownFieldsTranslate = "course.dropDownFields";
  const inputFieldsTranslate = "course.inputFields";
  const submitButtonsTranslate = "course.buttons";

  const teachers = useAppSelector(getTeachersTeachers);
  const currentCourse = useAppSelector(getCoursesCurrentCourse);
  const token = useAppSelector(loginToken);

  const dispatch = useAppDispatch();

  const [courseData, setCourseData] = useState({
  title: '',
  link: '',
  capacity: 1,
  degree: PLACEHOLDER,
  semester: 1,
  teacher: PLACEHOLDER
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
  const name = e.target.name;
  const value = e.target.value;
  setCourseData({
    ...courseData,
    [name]: value
  });
  
  };

  const validation = {
  title: courseData.title.length < 1,
  link: courseData.link.length < 1,
  capacity: courseData.capacity < 1 || courseData.capacity > 100,
  degree: courseData.degree === PLACEHOLDER,
  semester: courseData.semester < 1 || courseData.semester > 2,
  teacher: courseData.teacher === PLACEHOLDER
  }

  const disableSubmitButton = validation.title || validation.link || validation.capacity || validation.degree;

  useEffect(() => {
    if (currentCourse) {
      setCourseData({
      title: currentCourse.title,
      link: currentCourse.link,
      capacity: currentCourse.capacity,
      degree: currentCourse.degree,
      semester: currentCourse.semester,
      teacher: currentCourse.teacher_email
      })
    }
  }, [currentCourse, setCourseData])
  
  
  return (
  <div
    className={componentClassName}
  >
    <InputField 
      type={InputFieldType.text}
      id={`${componentId}-title`}
      name={"title"}
      defaultValue={courseData.title} 
      error={validation.title} 
      errorMessage={t(`${inputFieldsTranslate}.title.errorMessage`)} 
      label={t(`${inputFieldsTranslate}.title.label`)} 
      placeholder={t(`${inputFieldsTranslate}.title.placeholder`)}
      onChange={handleChange}
    />
    <InputField 
      type={InputFieldType.text} 
      id={`${componentId}-link`}
      name={"link"}
      defaultValue={courseData.link}
      error={validation.link} 
      errorMessage={t(`${inputFieldsTranslate}.link.errorMessage`)} 
      label={t(`${inputFieldsTranslate}.link.label`)} 
      placeholder={t(`${inputFieldsTranslate}.link.placeholder`)}
      onChange={handleChange} 
    />
    <InputField 
      type={InputFieldType.number}
      id={`${componentId}-capacity`}
      name={"capacity"}
      value={courseData.capacity} 
      error={validation.capacity} 
      errorMessage={t(`${inputFieldsTranslate}.capacity.errorMessage`)} 
      label={t(`${inputFieldsTranslate}.capacity.label`)} 
      placeholder={t(`${inputFieldsTranslate}.capacity.placeholder`)}
      onChange={handleChange}
      min={1} max={100}
    />
    <DropDown
      id={`${componentId}-degree`}
      name="degree" 
      error={validation.degree} 
      errorMessage={t(`${dropDownFieldsTranslate}.degree.errorMessage`)} 
      label={t(`${dropDownFieldsTranslate}.degree.label`)}
      placeholder={t(`${dropDownFieldsTranslate}.degree.placeholder`)}
      defaultValue={courseData.degree}
      value={courseData.degree}
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
    <InputField 
      type={InputFieldType.number}
      id={`${componentId}-semester`}
      name={"semester"}
      value={courseData.semester} 
      error={validation.semester} 
      errorMessage={t(`${inputFieldsTranslate}.semester.errorMessage`)} 
      label={t(`${inputFieldsTranslate}.semester.label`)} 
      placeholder={t(`${inputFieldsTranslate}.semester.placeholder`)}
      onChange={handleChange}
      min={1} max={2}
    />
    <DropDown
      id={`${componentId}-teacher`}
      name={"teacher"}
      value={courseData.teacher} 
      error={false} 
      errorMessage={t(`${dropDownFieldsTranslate}.teacher.errorMessage`)} 
      label={t(`${dropDownFieldsTranslate}.teacher.label`)} 
      placeholder={t(`${dropDownFieldsTranslate}.teacher.placeholder`)}
      onChange={handleChange}
    >
    {teachers && teachers.map((teacher) => {
      return (
      <option
        value={teacher.email}
        selected={courseData.teacher === teacher.email ? true : false}
      >
        {`${teacher.first_name} ${teacher.last_name}`}
      </option>
      )
    })}
    </DropDown>
    <Button 
      label={t(`${submitButtonsTranslate}.${type}`)}
      modifier={disableSubmitButton ? ButtonModifier.disabled : ButtonModifier.save} 
      disabled={disableSubmitButton}
      onClick={() => {
        if (token) {
          if (type === 'create') {
              dispatch(createCourseAsync({
                title: courseData.title,
                link: courseData.link,
                capacity: courseData.capacity,
                semester: courseData.semester,
                degree: courseData.degree,
                teacher_email: courseData.teacher,
                token: token
              }))
            }
            if (type === 'update' && currentCourse) {
              dispatch(updateCourseAsync({
                id: currentCourse.id,
                title: courseData.title,
                link: courseData.link,
                capacity: courseData.capacity,
                semester: courseData.semester,
                degree: courseData.degree,
                teacher_email: courseData.teacher,
                token: token
              }))
            }
        }
      }}
    />
    {type === 'update' && (
    <Button 
      label={t(`${submitButtonsTranslate}.delete`)}
      modifier={ButtonModifier.delete}
      disabled={false}
      onClick={() => {
        if (currentCourse && token) {
          dispatch(deleteCourseAsync({
            id: currentCourse.id,
            token: token
          }))
        }
      }}
    />  
    )} 
  </div>
  )
}

export default CourseForm;