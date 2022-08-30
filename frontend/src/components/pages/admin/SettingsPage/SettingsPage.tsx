import { useAppSelector, useAppDispatch } from "app/hooks";
import Button, { ButtonModifier } from "components/atoms/Button";
import LoadingPage from "components/pages/LoadingPage";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginSelectionSessionOpen, loginToken, setSelectionSessionOpenSetting } from "features/account/loginSlice";
import { updateSelectionSessionOpenStatus, revertUpdateSelectionSessionOpen, updateSelectionSessionOpenAsync } from "features/user/admin/updateSelectionSessionOpenSlice";
import { getStudentsListsLists, getStudentsListsStatus, getStudentsListsAsync } from "features/user/admin/user/getStudentsListsSlice";
import { SelectionSessionSettingValue, ApiStatus } from "features/Utils";
import * as FileSaver from "file-saver";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import "./SettingsPage.scss";


const SettingsPage = () => {

  const { t } = useTranslation("pages");

  const componentClassName = "settings-page";
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const token = useAppSelector(loginToken);
  const lists = useAppSelector(getStudentsListsLists)
  const statusLists = useAppSelector(getStudentsListsStatus);
  const statusUpdateSelectionSessionOpen = useAppSelector(updateSelectionSessionOpenStatus);
  
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
    if (statusUpdateSelectionSessionOpen === ApiStatus.success) {
      const serverAppLink = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER_APP_LINK_PROD : process.env.REACT_APP_SERVER_APP_LINK_DEV;
      let url = `ws://${serverAppLink}/ws/socket-server/`;
  
      const socket = new WebSocket(url);
      socket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === 'set_selection_session_open') {
          dispatch(setSelectionSessionOpenSetting({
            value: data.SELECTION_SESSION_OPEN as SelectionSessionSettingValue
          }))
          dispatch(revertUpdateSelectionSessionOpen())
        }
      }
      socket.onopen = () => {
          socket.send(JSON.stringify({
          'status': 'SUCCESS'
        }))  
      }
    }
  }, [
    statusUpdateSelectionSessionOpen,
    dispatch,
    selectionSessionOpen,
    statusLists,
    token
  ]);

  if (statusUpdateSelectionSessionOpen === ApiStatus.loading) {
    return <LoadingPage />
  }

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
          );
          return;
        })
        const wb = { Sheets: {"data": ws}, SheetNames: ["data"]}
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], { type: fileType})
        FileSaver.saveAs(data, `${list.course} ${list.domain} ${list.degree} ${list.learning_mode} ${list.study_program} ${list.year}.xlsx`);
        return; 
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
