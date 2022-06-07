import React, { useEffect } from "react";
import { Role } from "../../App";
import Button, { ButtonModifier } from "../../atoms/Button";
import InputField, { InputFieldType } from "../../atoms/InputField";
import AccountsList from "../../molecules/lists/AccountsList";
import LoggedUserPage from "../LoggedUserPage";
import $ from "jquery";
import "./AccountsPage.scss"
import { IAccountsPageProps } from "./AccountsPage.types";
import { useTranslation } from "react-i18next";


const AccountsPage = ({
  role = Role.NONE
}: IAccountsPageProps) => {

  const componentClassName = "accounts-page";

  const { t } = useTranslation();

  useEffect(() => {
    $('#import-excel-file-button').on('click', () => {
      $('#import-excel-file-input').trigger('click')
    });
  }, [])  

  const switchType = (role: Role): string =>  {
    switch (role) {
      case Role.NONE:
        return 'notVerified' 
      case Role.STUDENT:
        return 'students'
      case Role.TEACHER:
        return 'teachers'
      case Role.SECRETARY:
        return 'secretaries'
      default:
        return ''
    }
  }

  return (
    <LoggedUserPage>
      <div 
        className={`${componentClassName}__excel-import-buttons`}
      >
        {role !== Role.NONE && (
          <>
            <Button 
              id={"import-excel-file-button"}
              label={t(`pages.accounts.${switchType(role)}.fileUploadLabel`)}
              modifier={ButtonModifier.excel} 
              disabled={false} 
            />
            <input 
              type="file"
              style={{
                display: "none"
              }}
              id={"import-excel-file-input"}
            />
          </>
        )}
      </div>
      <AccountsList 
        title={t(`pages.accounts.${switchType(role)}.accountsListTitle`)}
        accounts={[
          {
            email: "rachel@chu.com",
            role: Role.STUDENT,
            verified: false
          },
          {
            email: "nick@young.com",
            role: Role.STUDENT,
            verified: true
          },
        ]} 
      />
    </LoggedUserPage>
  )
};

export default AccountsPage;