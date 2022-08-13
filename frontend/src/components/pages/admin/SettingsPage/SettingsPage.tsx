import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginSelectionSessionOpen, loginToken } from "../../../../features/auth/loginSlice";
import { getStudentsListsAsync, getStudentsListsLists, getStudentsListsStatus } from "../../../../features/user/admin/user/getStudentsListsSlice";
import { updateSelectionSessionOpenAsync } from "../../../../features/user/admin/updateSelectionSessionOpenSlice";
import { ApiStatus, SelectionSessionSettingValue } from "../../../../features/Utils";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Button, { ButtonModifier } from "../../../atoms/Button";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./SettingsPage.scss";
import { useTranslation } from "react-i18next";


const SettingsPage = () => {

  const { t } = useTranslation("pages");

  const componentClassName = "settings-page";
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const token = useAppSelector(loginToken);
  const lists = useAppSelector(getStudentsListsLists)
  const statusLists = useAppSelector(getStudentsListsStatus)
  
  const dispatch = useAppDispatch();

  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  useEffect(() => {
    if (
      selectionSessionOpen === SelectionSessionSettingValue.FALSE && 
      token && 
      statusLists === ApiStatus.idle
    ) {
      dispatch(getStudentsListsAsync({
        token: token
      }))
    }
  });

  const exportLists = () => {
    if (lists) {
      const header = [t("admin.settings.xlsx.header.fullName"), t("admin.settings.xlsx.header.currentGroup")];
      lists.map((list) => {
        const ws = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(ws, [header]);
        list.students.map((student) => {
          XLSX.utils.sheet_add_aoa(ws, 
            [[`${student.first_name} ${student.last_name}`, student.current_group]],
            {origin: -1}  
          )
        })
        
        const wb = { Sheets: {"data": ws}, SheetNames: ["data"]}
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], { type: fileType})
        FileSaver.saveAs(data, `${list.course} ${list.domain} ${list.degree} ${list.learning_mode} ${list.study_program} ${list.year}.xlsx`); 
      }) 
    }
  }
  
  

  return (
    <LoggedUserPage>
      <div
        className={componentClassName}
      >
        <span
          className={`${componentClassName}__title`}
        >
          {t("admin.settings.text.message")} {selectionSessionOpen === SelectionSessionSettingValue.TRUE ? t("admin.settings.text.active") : t("admin.settings.text.inactive") }
        </span>
        {selectionSessionOpen === SelectionSessionSettingValue.FALSE && (
          <Button 
            label={t("admin.settings.buttons.exportLists")} 
            disabled={false}
            modifier={ButtonModifier.excel} 
            onClick={exportLists}
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
