import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";
import "./AccountsList.scss";
import Modal from "../../Modal";
import UserDataForm from "../../forms/UserDataForm";
import { Role } from "../../../App";
import { useAppDispatch } from "../../../../app/hooks";
import { getCurrentStudent, revertCurrentStudent } from "../../../../features/user/admin/getStudentsSlice";
import { getCurrentTeacher, revertCurrentTeacher } from "../../../../features/user/admin/getTeachersSlice";

const AccountsList = ({
    role,
    emails,
    title
}: IAccountsListProps) => {

  const componentClassName = "accounts-list";
  const [showUserDataFormModal, setShowUserDataFormModal] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
    
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

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
      </>
  );

};

export default AccountsList;