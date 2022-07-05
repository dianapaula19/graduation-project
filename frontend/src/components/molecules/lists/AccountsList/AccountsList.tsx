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

const AccountsList = ({
  role,
  emails,
  title
}: IAccountsListProps) => {

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
  
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

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
    case ApiStatus.loading:
      verifyUserModalComponent = <Loader />;
      break;
    case ApiStatus.failed:
      verifyUserModalComponent = (
        <div>
          The user's account couldn't be verified
        </div>
      )
      break;
    case ApiStatus.success:
      verifyUserModalComponent = (
        <div>
          The user's account was verified successfully
        </div>
      )
      break;
  }

  switch(statusUpdateStudentInfo) {
    case ApiStatus.loading:
      updateStudentInfoModalComponent = <Loader />;
      break;
    case ApiStatus.failed:
      updateStudentInfoModalComponent = (
        <div>
          The student's info couldn't be updated
        </div>
      )
      break;
    case ApiStatus.success:
      updateStudentInfoModalComponent = (
        <div>
          The student's info was updated successfully
        </div>
      )
      break;
  }

  switch(statusUpdateTeacherInfo) {
    case ApiStatus.loading:
      updateTeacherInfoModalComponent = <Loader />;
      break;
    case ApiStatus.failed:
      updateTeacherInfoModalComponent = (
        <div>
          The teacher's info couldn't be updated
        </div>
      )
      break;
    case ApiStatus.success:
      updateTeacherInfoModalComponent = (
        <div>
          The teacher's info was updated successfully
        </div>
      )
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
          {t("lists.accounts.header.email")}
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