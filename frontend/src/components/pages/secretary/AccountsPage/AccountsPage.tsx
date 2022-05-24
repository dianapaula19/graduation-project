import React from "react";
import { Role } from "../../../App";
import Button, { ButtonModifier } from "../../../atoms/Button";
import AccountsList from "../../../molecules/lists/AccountsList";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./AccountsPage.scss"


const AccountsPage = () => {

  const componentClassName = "accounts-page";

  return (
    <LoggedUserPage>
      <div className={`${componentClassName}__excel-import-buttons`}>
        <Button 
          label={"Import Excel File of Students' Info"}
          modifier={ButtonModifier.excel} 
          disabled={false} 
        />
        <Button 
          label={"Import Excel File of Teachers' Info"}
          modifier={ButtonModifier.excel}  
          disabled={false} 
        />
      </div>
      <AccountsList accounts={[
        {
          email: "rachel@chu.com",
          role: Role.student,
          verified: false
        },
        {
          email: "nick@young.com",
          role: Role.student,
          verified: true
        },
    ]} />
    </LoggedUserPage>
  )
};

export default AccountsPage;