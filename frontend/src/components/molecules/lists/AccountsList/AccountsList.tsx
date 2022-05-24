import React from "react";
import { useTranslation } from "react-i18next";
import "./AccountsList.scss";
import { IAccountsListProps } from "./AccountsList.types";
import "./AccountsList.scss";

const VerifiedStatusTag = (verified: boolean) => {
  const componentClassName = "verified-status-tag";

  const { t } = useTranslation();

  return (
    <span
      className={`${componentClassName}--${verified === true ? 'green' : 'red'}`}
    >
      

    </span>
  )

}

const AccountsList = ({
  accounts
}: IAccountsListProps) => {

  const componentClassName = "accounts-list";
    
  const { t } = useTranslation();

  return (
      <div 
          className={componentClassName}
      >
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
                  {t("accountsList.header.email")}
              </span>
              <span
                  className={`${componentClassName}__role`}
              >
                  {t("accountsList.header.role")}
              </span>
              <span
                  className={`${componentClassName}__status`}
              >
                  {t("accountsList.header.status")}
              </span>
              
          </div>
          {accounts.map((account, idx) => {
              return (
                  <div 
                      className={`${componentClassName}__item`}
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
                      <span
                        className={`${componentClassName}__role`}
                      >
                          {account.role}
                      </span>
                      <div
                        className={`${componentClassName}__status`}
                      
                      >

                      </div>
                  </div>
              )
          })}
      </div>
  );

};

export default AccountsList;