import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginUserData } from "../../../../features/auth/loginSlice";
import { getTeacherCoursesCurrentCourse } from "../../../../features/user/teacher/getTeacherCoursesSlice";
import { sendAnnouncementAsync } from "../../../../features/user/teacher/sendAnnouncementSlice";
import Button from "../../../atoms/Button";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import TextAreaField from "../../../atoms/TextAreaField";

const SendAnnouncementForm = () => {

  const componentClassName = "send-announcement-form";
  const componentId = "send-announcement-form";
  const inputFieldsTranslate = "forms.sendAnnouncement.inputFields";
  const textAreaFieldsTranslate = "forms.sendAnnouncement.textAreaFields";
  const submitButtonsTranslate = "forms.sendAnnouncement.submitButtons";

  const currentTeacherCourse = useAppSelector(getTeacherCoursesCurrentCourse);
  const userData = useAppSelector(loginUserData);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [data, setData] = useState({
  subject: '',
  message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
  const name = e.target.name;
  const value = e.target.value;
  setData({
    ...data,
    [name]: value
  });
  }

  const handleSubmit = () => {
  if (currentTeacherCourse && userData) {
    const recipient_list = Array.from(currentTeacherCourse.students, student => student.email);
    dispatch(sendAnnouncementAsync({
    subject: `${data.subject} [${currentTeacherCourse.title}]`,
    message: data.message,
    recipient_list: recipient_list,
    }))
  }
  }

  return (
  <div className={componentClassName}>
    <InputField 
    type={InputFieldType.text}
    id={`${componentId}-subject`}
    name={"subject"} 
    error={data.subject.length < 1} 
    errorMessage={t(`${inputFieldsTranslate}.subject.errorMessage`)} 
    label={t(`${inputFieldsTranslate}.subject.label`)}
    placeholder={t(`${inputFieldsTranslate}.subject.placeholder`)}
    onChange={handleChange} 
    />
    <TextAreaField 
    id={`${componentId}-message`}
    name={"message"}
    label={t(`${textAreaFieldsTranslate}.message.label`)}
    onChange={handleChange}
    />
    <Button 
    label={t(`${submitButtonsTranslate}.sendTheAnnouncement`)} 
    disabled={data.subject.length < 1} 
    onSubmit={handleSubmit}
    />
  </div>
  )
}

export default SendAnnouncementForm;