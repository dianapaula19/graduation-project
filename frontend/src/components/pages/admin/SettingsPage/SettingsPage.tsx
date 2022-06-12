import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginSelectionSessionOpen, loginToken } from "../../../../features/auth/loginSlice";
import { updateSelectionSessionOpenAsync } from "../../../../features/user/admin/updateSelectionSessionOpenSlice";
import { SelectionSessionSettingValue } from "../../../../features/Utils";
import Button, { ButtonModifier } from "../../../atoms/Button";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./SettingsPage.scss";


const SettingsPage = () => {
  const componentClassName = "settings-page";
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const token = useAppSelector(loginToken);
  
  const dispatch = useAppDispatch();
  

  return (
    <LoggedUserPage>
      <div
        className={componentClassName}
      >
        <span
          className={`${componentClassName}__title`}
        >
          Perioada de înscrieri este: {selectionSessionOpen === SelectionSessionSettingValue.TRUE ? 'activă' : 'inactivă' }
        </span>
        {selectionSessionOpen === SelectionSessionSettingValue.FALSE && (
          <Button 
            label={"Exportă repartizarea studenților la cursurile opționale"} 
            disabled={false}
            modifier={ButtonModifier.excel} 
          />
        )}
        <div
          className={`${componentClassName}__buttons-container`}
        >
          <Button 
            label={"START"} 
            disabled={selectionSessionOpen === SelectionSessionSettingValue.TRUE ? true : false} 
            onClick={
              () => {
                if (selectionSessionOpen && token) {
                  dispatch(updateSelectionSessionOpenAsync({
                    value: SelectionSessionSettingValue.TRUE, 
                    token: token
                  }))
                }
              }
            }
          />
          <Button 
            label={"STOP"} 
            disabled={selectionSessionOpen === SelectionSessionSettingValue.FALSE ? true : false} 
            onClick={
              () => {
                if (selectionSessionOpen && token) {
                  dispatch(updateSelectionSessionOpenAsync({
                    value: SelectionSessionSettingValue.FALSE,
                    token: token
                  }))
                }
              }
            }
          />
        </div>
      </div>
    </LoggedUserPage>
  )
};

export default SettingsPage;