import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";
import "./AccountsList.scss";
import Modal from "../../Modal";
import UserDataForm from "../../forms/UserDataForm";
import { Role } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCurrentStudent, getStudentsAsync, revertCurrentStudent } from "../../../../features/user/admin/user/getStudentsSlice";
import { getCurrentTeacher, getTeachersAsync, revertCurrentTeacher } from "../../../../features/user/admin/user/getTeachersSlice";
import { revertVerifyUser, verifyUserShowModal, verifyUserStatus } from "../../../../features/user/admin/user/verifyUserSlice";
import { revertUpdateStudentInfo, updateStudentInfoShowModal, updateStudentInfoStatus } from "../../../../features/user/admin/user/updateStudentInfoSlice";
import { revertUpdateTeacherInfo, updateTeacherInfoShowModal, updateTeacherInfoStatus } from "../../../../features/user/admin/user/updateTeacherInfoSlice";
import { getNotVerifiedUsersAsync } from "../../../../features/user/admin/user/getNotVerifiedUsersSlice";
import { ApiStatus } from "../../../../features/Utils";
import { loginToken } from "../../../../features/auth/loginSlice";
import Loader from "../../../atoms/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ModalApiStatus from "../../ModalApiStatus";

const AccountsList = ({
  role,
  emails,
  title
}: IAccountsListProps) => {

  const { t } = useTranslation('lists');

  const dispatch = useAppDispatch();

  const componentClassName = "accounts-list";
  const [showUserDataFormModal, setShowUserDataFormModal] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  const showModalVerifyUser = useAppSelector(verifyUserShowModal);
  const showModalUpdateStudentInfo = useAppSelector(updateStudentInfoShowModal);
  const showModalUpdateTeacherInfo = useAppSelector(updateTeacherInfoShowModal);
  const statusVerifyUser = useAppSelector(verifyUserStatus);
  const statusUpdateStudentInfo = useAppSelector(updateStudentInfoStatus);
  const statusUpdateTeacherInfo = useAppSelector(updateTeacherInfoStatus);

  const token = useAppSelector(loginToken);

  useEffect(() => {
  if (
    showModalVerifyUser || 
    showModalUpdateStudentInfo || 
    showModalUpdateTeacherInfo
  ) {
    setShowUserDataFormModal(false);
  }
  }, [
    showModalVerifyUser, 
    showModalUpdateTeacherInfo, 
    showModalUpdateStudentInfo, 
    setShowUserDataFormModal
  ])

  let verifyUserModalComponent = null;
  let updateStudentInfoModalComponent = null;
  let updateTeacherInfoModalComponent = null;

  switch(statusVerifyUser) {
    case ApiStatus.failed:
      verifyUserModalComponent = <ModalApiStatus 
        message={t("accounts.notVerified.error")} 
        error={true} 
      />
      break;
    case ApiStatus.success:
      verifyUserModalComponent = <ModalApiStatus 
        message={t("accounts.notVerified.success")} 
        error={true} 
      />
      break;
  }

  switch(statusUpdateStudentInfo) {
    case ApiStatus.failed:
      updateStudentInfoModalComponent = <ModalApiStatus 
        message={t("accounts.students.error")} 
        error={true} 
      />;
      break;
    case ApiStatus.success:
      updateStudentInfoModalComponent = <ModalApiStatus 
        message={t("accounts.students.success")} 
        error={false} 
      />;
      break;
  }

  switch(statusUpdateTeacherInfo) {
    case ApiStatus.failed:
      updateTeacherInfoModalComponent = <ModalApiStatus 
        message={t("accounts.teachers.error")} 
        error={true} 
      />;
      break;
    case ApiStatus.success:
      updateTeacherInfoModalComponent = <ModalApiStatus 
        message={t("accounts.teachers.success")} 
        error={false} 
      />;
      break;
  }
  

  return (
    <>
    <div 
      className={componentClassName}
    >
      <span
        className={`${componentClassName}__title`}
      >
        {title}
      </span>
      <div 
        className={`${componentClassName}__header`}
      >
        <span
          className={`${componentClassName}__index`}
        >
          #
        </span>
        <span
          className={`${componentClassName}__email`}
        >
          {t("accounts.header.email")}
        </span>
        
      </div>
      {emails.map((email, idx) => {
        return (
          <div 
            className={`${componentClassName}__item`}
            onClick={() => {
              setCurrentEmail(email);
              if (role === Role.STUDENT) {
                dispatch(getCurrentStudent({
                  email: email
                }))
              }
              if (role === Role.TEACHER) {
                dispatch(getCurrentTeacher({
                  email: email
                }))
              }
              setShowUserDataFormModal(true);
            }}
          >
            <span
              className={`${componentClassName}__index`}
            >
              {idx + 1}
            </span>
            <span
              className={`${componentClassName}__email`}
            >
              {email}
            </span>
          </div>
        )
      })}
    </div>
    <Modal 
      show={showUserDataFormModal} 
      closeModal={() => {
        setShowUserDataFormModal(false);
        if (role === Role.STUDENT) {
          dispatch(revertCurrentStudent());
        }
        if (role === Role.TEACHER) {
          dispatch(revertCurrentTeacher());
        }
      }}
    >
      {currentEmail && (
        <UserDataForm
          role={role}
          email={currentEmail}   
        />  
      )}   
    </Modal>
    <Modal 
      show={showModalVerifyUser} 
      closeModal={() => {
        if (token) {
          dispatch(getNotVerifiedUsersAsync({
            token: token
          }));
          dispatch(revertVerifyUser());
        }
      }}
    >
      {verifyUserModalComponent}
    </Modal>
    <Modal 
      show={showModalUpdateStudentInfo} 
      closeModal={() => {
        if (token) {
          dispatch(getStudentsAsync({
            token: token
          }));
          if (role === Role.STUDENT) {
            dispatch(revertCurrentStudent());
          }
          dispatch(revertUpdateStudentInfo());
        }
      }}
    >
      {updateStudentInfoModalComponent}
    </Modal>
    <Modal 
      show={showModalUpdateTeacherInfo} 
      closeModal={() => {
        if (token) {
          dispatch(getTeachersAsync({
            token: token
          }));
        if (role === Role.TEACHER) {
          dispatch(revertCurrentTeacher());
        }
        dispatch(revertUpdateTeacherInfo());
        }
      }}
    >
      {updateTeacherInfoModalComponent}
    </Modal>
    </>
  );

};

export default AccountsList;