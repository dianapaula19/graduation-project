import { useAppDispatch, useAppSelector } from "app/hooks";
import Button from "components/atoms/Button";
import InputField, { InputFieldType } from "components/atoms/InputField";
import TextAreaField from "components/atoms/TextAreaField";
import { loginUserData, loginToken } from "features/account/loginSlice";
import { getTeacherCoursesCurrentCourse } from "features/user/teacher/getTeacherCoursesSlice";
import { sendAnnouncementAsync } from "features/user/teacher/sendAnnouncementSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./SendAnnouncementForm.scss";

const SendAnnouncementForm = () => {

  const { t } = useTranslation('forms');

  const dispatch = useAppDispatch();

  const componentClassName = "send-announcement-form";
  const componentId = "send-announcement-form";
  const inputFieldsTranslate = "sendAnnouncement.inputFields";
  const textAreaFieldsTranslate = "sendAnnouncement.textAreaFields";
  const submitButtonsTranslate = "sendAnnouncement.buttons";

  const currentTeacherCourse = useAppSelector(getTeacherCoursesCurrentCourse);
  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);

  const [data, setData] = useState({
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (currentTeacherCourse && userData && token) {
      let recipient_list = Array.from(currentTeacherCourse.students, student => student.email);
      dispatch(sendAnnouncementAsync({
        subject: `[FMI] [${currentTeacherCourse.title}] ${data.subject}`,
        message: data.message,
        token: token,
        teacher_email: userData.email,
        teacher_first_name: userData.first_name,
        teacher_last_name: userData.last_name,
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
        placeholder={t(`${textAreaFieldsTranslate}.message.placeholder`)}
        onChange={handleChange}
      />
      <Button 
        label={t(`${submitButtonsTranslate}.sendTheAnnouncement`)} 
        disabled={data.subject.length < 1} 
        onClick={handleSubmit}
      />
    </div>
  )
}

export default SendAnnouncementForm;