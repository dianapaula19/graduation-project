import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";
import "./AccountsList.scss";
import Button, { ButtonModifier } from "../../../atoms/Button";
import Modal from "../../Modal";
import UserDataForm from "../../forms/UserDataForm";

const AccountsList = ({
  accounts,
  title
}: IAccountsListProps) => {

  const componentClassName = "accounts-list";
  const [showUserDataFormModal, setShowUserDataFormModal] = useState<boolean>(false);
    
  const { t } = useTranslation();

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
            {accounts.map((account, idx) => {
                return (
                    <div 
                        className={`${componentClassName}__item`}
                        onClick={() => setShowUserDataFormModal(true)}
                    >
                        <span
                            className={`${componentClassName}__index`}
                        >
                            {idx + 1}
                        </span>
                        <span
                            className={`${componentClassName}__email`}
                        >
                            {account.email}
                        </span>
                    </div>
                )
            })}
        </div>
        <Modal 
            show={showUserDataFormModal} 
            closeModal={() => setShowUserDataFormModal(false)}
        >
            <UserDataForm firstName={""} lastName={""} role={""} domain={""} degree={""} learningMode={""} studyProgram={""} currentGroup={""} currentYear={""} />    
        </Modal>
      </>
  );

};

export default AccountsList;