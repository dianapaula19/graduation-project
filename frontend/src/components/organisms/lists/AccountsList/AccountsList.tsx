import { useAppDispatch, useAppSelector } from "app/hooks";
import { Role } from "components/App";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import UserDataForm from "components/organisms/forms/UserDataForm";
import { loginToken } from "features/account/loginSlice";
import { deleteCourseCode } from "features/user/admin/course/deleteCourseSlice";
import { deleteUserShowModal, deleteUserStatus, revertDeleteUser } from "features/user/admin/user/deleteUserSlice";
import { getNotVerifiedUsersAsync } from "features/user/admin/user/getNotVerifiedUsersSlice";
import { getCurrentStudent, revertCurrentStudent, getStudentsAsync } from "features/user/admin/user/getStudentsSlice";
import { getCurrentTeacher, revertCurrentTeacher, getTeachersAsync } from "features/user/admin/user/getTeachersSlice";
import { updateStudentInfoShowModal, updateStudentInfoStatus, revertUpdateStudentInfo } from "features/user/admin/user/updateStudentInfoSlice";
import { updateTeacherInfoShowModal, updateTeacherInfoStatus, revertUpdateTeacherInfo } from "features/user/admin/user/updateTeacherInfoSlice";
import { verifyUserShowModal, verifyUserStatus, revertVerifyUser } from "features/user/admin/user/verifyUserSlice";
import { ApiStatus } from "features/Utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual } from "react-redux";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";

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

  const showModalDeleteUser = useAppSelector(deleteUserShowModal);
  const showModalVerifyUser = useAppSelector(verifyUserShowModal);
  const showModalUpdateStudentInfo = useAppSelector(updateStudentInfoShowModal);
  const showModalUpdateTeacherInfo = useAppSelector(updateTeacherInfoShowModal);
  const statusDeleteUser = useAppSelector(deleteUserStatus);
  const statusVerifyUser = useAppSelector(verifyUserStatus);
  const statusUpdateStudentInfo = useAppSelector(updateStudentInfoStatus);
  const statusUpdateTeacherInfo = useAppSelector(updateTeacherInfoStatus);
  const codeDeleteUser = useAppSelector(deleteCourseCode);

  const token = useAppSelector(loginToken);

  useEffect(() => {
    if (
      showModalVerifyUser || 
      showModalUpdateStudentInfo || 
      showModalUpdateTeacherInfo ||
      showModalDeleteUser
    ) {
      setShowUserDataFormModal(false);
    }
  }, [
    showModalVerifyUser, 
    showModalUpdateTeacherInfo, 
    showModalUpdateStudentInfo, 
    showModalDeleteUser,
    setShowUserDataFormModal
  ])

  let verifyUserModalComponent = null;
  let updateStudentInfoModalComponent = null;
  let updateTeacherInfoModalComponent = null;

  switch(statusVerifyUser) {
    case ApiStatus.failed:
      verifyUserModalComponent = <ModalApiStatus 
        message={t("accounts.notVerified.error")} 
        status={statusVerifyUser}
      />
      break;
    case ApiStatus.success:
      verifyUserModalComponent = <ModalApiStatus 
        message={t("accounts.notVerified.success")} 
        status={statusVerifyUser} 
      />
      break;
  }

  switch(statusUpdateStudentInfo) {
    case ApiStatus.failed:
      updateStudentInfoModalComponent = <ModalApiStatus 
        message={t("accounts.students.error.update")} 
        status={statusUpdateStudentInfo} 
      />;
      break;
    case ApiStatus.success:
      updateStudentInfoModalComponent = <ModalApiStatus 
        message={t("accounts.students.success.update")} 
        status={statusUpdateStudentInfo}  
      />;
      break;
  }

  switch(statusUpdateTeacherInfo) {
    case ApiStatus.failed:
      updateTeacherInfoModalComponent = <ModalApiStatus 
        message={t("accounts.teachers.error.update")} 
        status={statusUpdateTeacherInfo} 
      />;
      break;
    case ApiStatus.success:
      updateTeacherInfoModalComponent = <ModalApiStatus 
        message={t("accounts.teachers.success.update")} 
        status={statusUpdateTeacherInfo} 
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
          dispatch(revertCurrentStudent());
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
          dispatch(revertCurrentTeacher());
          dispatch(revertUpdateTeacherInfo());
        }
      }}
    >
      {updateTeacherInfoModalComponent}
    </Modal>
    <Modal 
      show={showModalDeleteUser} 
      closeModal={() => {
        console.log(codeDeleteUser);
        if (token) {
          switch (role) {
            case Role.NONE:
              dispatch(getNotVerifiedUsersAsync({
                token: token
              }));
              dispatch(revertVerifyUser());
              break;
            case Role.STUDENT:
              dispatch(getStudentsAsync({
                token: token
              }));
              dispatch(revertCurrentStudent());
              break;
            case Role.TEACHER:
              dispatch(getTeachersAsync({
                token: token
              }));
              dispatch(revertCurrentTeacher());  
              break;
            default:
              break;
          }
          dispatch(revertDeleteUser());
        }
      }}
    >
      {statusDeleteUser === ApiStatus.failed && (
        <ModalApiStatus 
          message={codeDeleteUser ? t(`accounts.error.${codeDeleteUser}`) : t(`accounts.error.ERROR`)} 
          status={statusDeleteUser} 
        />
      )}
      {statusDeleteUser === ApiStatus.success && (
        <ModalApiStatus 
          message={t(`accounts.success.SUCCESS`)} 
          status={statusDeleteUser} 
        />
      )}
    </Modal>
    </>
  );

};

export default AccountsList;