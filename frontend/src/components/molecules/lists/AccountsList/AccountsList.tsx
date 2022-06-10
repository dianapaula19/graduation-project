import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";
import "./AccountsList.scss";
import Modal from "../../Modal";
import UserDataForm from "../../forms/UserDataForm";
import { Role } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCurrentStudent, getStudentsAsync, revertCurrentStudent } from "../../../../features/user/admin/getStudentsSlice";
import { getCurrentTeacher, getTeachersAsync, revertCurrentTeacher } from "../../../../features/user/admin/getTeachersSlice";
import { revertVerifyUser, verifyUserShowModal, verifyUserStatus } from "../../../../features/user/admin/verifyUserSlice";
import { revertUpdateStudentInfo, updateStudentInfoShowModal, updateStudentInfoStatus } from "../../../../features/user/admin/updateStudentInfoSlice";
import { revertUpdateTeacherInfo, updateTeacherInfoShowModal, updateTeacherInfoStatus } from "../../../../features/user/admin/updateTeacherInfoSlice";
import { getNotVerifiedUsersAsync } from "../../../../features/user/admin/getNotVerifiedUsersSlice";
import { ApiStatus } from "../../../../features/Utils";

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
    
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (statusVerifyUser === ApiStatus.failed || statusVerifyUser === ApiStatus.success) {
        setShowUserDataFormModal(false);
    }
    if (statusUpdateStudentInfo === ApiStatus.failed || statusUpdateStudentInfo === ApiStatus.success) {
        setShowUserDataFormModal(false);
    }
    if (statusUpdateTeacherInfo === ApiStatus.failed || statusUpdateTeacherInfo === ApiStatus.success) {
        setShowUserDataFormModal(false);
    }
  }, [])
  

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
                dispatch(getNotVerifiedUsersAsync());
                dispatch(revertVerifyUser());
            }}
        >
            Not Verified TBA
        </Modal>
        <Modal 
            show={showModalUpdateStudentInfo} 
            closeModal={() => {
                dispatch(getStudentsAsync());
                if (role === Role.STUDENT) {
                    dispatch(revertCurrentStudent());
                }
                dispatch(revertUpdateStudentInfo());
            }}
        >
            Update Student TBA
        </Modal>
        <Modal 
            show={showModalUpdateTeacherInfo} 
            closeModal={() => {
                dispatch(getTeachersAsync());
                if (role === Role.TEACHER) {
                    dispatch(revertCurrentTeacher());
                }
                dispatch(revertUpdateTeacherInfo());
            }}
        >
            Update Teacher TBA
        </Modal>
      </>
  );

};

export default AccountsList;