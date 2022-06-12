import React, { useEffect, useState } from "react";
import { Role } from "../../App";
import Button, { ButtonModifier } from "../../atoms/Button";
import InputField, { InputFieldType } from "../../atoms/InputField";
import AccountsList from "../../molecules/lists/AccountsList";
import LoggedUserPage from "../LoggedUserPage";
import $ from "jquery";
import "./AccountsPage.scss"
import { IAccountsPageProps } from "./AccountsPage.types";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import registerBatchStudentsSlice, { IRegisterBatchStudentsRequest, IStudentData, registerBatchStudentsAsync, registerBatchStudentsShowModal, registerBatchStudentsStatus, revertRegisterBatchStudents } from "../../../features/user/admin/registerBatchStudentsSlice";
import { ITeacherData, registerBatchTeachersAsync, registerBatchTeachersShowModal, registerBatchTeachersStatus, revertRegisterBatchTeachers } from "../../../features/user/admin/registerBatchTeachersSlice";
import { ApiStatus } from "../../../features/Utils";
import Modal from "../../molecules/Modal";
import { getStudentsAsync, getStudentsStatus, getStudentsStudents } from "../../../features/user/admin/getStudentsSlice";
import { getTeachersAsync, getTeachersStatus, getTeachersTeachers } from "../../../features/user/admin/getTeachersSlice";
import { getNotVerifiedUsersAsync, getNotVerifiedUsersStatus, getNotVerifiedUsersUsers } from "../../../features/user/admin/getNotVerifiedUsersSlice";
import { revertVerifyUser, verifyUserShowModal } from "../../../features/user/admin/verifyUserSlice";
import { useNavigate } from "react-router-dom";
import { loginToken } from "../../../features/auth/loginSlice";

const AccountsPage = ({
  role,
}: IAccountsPageProps) => {

  const componentClassName = "accounts-page";

  const { t } = useTranslation(); 
  const dispatch = useAppDispatch();
  const statusGetStudents = useAppSelector(getStudentsStatus);
  const statusGetTeachers = useAppSelector(getTeachersStatus);
  const statusGetNotVerifiedUsers = useAppSelector(getNotVerifiedUsersStatus);
  const students = useAppSelector(getStudentsStudents);
  const teachers = useAppSelector(getTeachersTeachers)
  const users = useAppSelector(getNotVerifiedUsersUsers);
  const showModalRegisterBatchStudents = useAppSelector(registerBatchStudentsShowModal);
  const showModalRegisterBatchTeachers = useAppSelector(registerBatchTeachersShowModal);
  const token = useAppSelector(loginToken);

  let navigate = useNavigate();

  let emails: string[] = [];

  if (users !== null && role === Role.NONE) {
  emails = users;
  }

  if (students !== null && role === Role.STUDENT) {
  students.forEach((student) => {
    emails.push(student.email);
  });
  }
  if (teachers !== null && role === Role.TEACHER) {
  teachers.forEach((teacher) => {
    emails.push(teacher.email);
  });
  }

  useEffect(() => {
  $('#import-excel-file-button').on('click', () => {
    $('#import-excel-file-input').trigger('click')
  });
  if (
    role === Role.STUDENT && 
    statusGetStudents === ApiStatus.idle &&
    token) 
  {
    dispatch(getStudentsAsync({
      token: token
    }))
  }
  if (
    role === Role.TEACHER && 
    statusGetTeachers === ApiStatus.idle &&
    token
    ) 
  {
    dispatch(getTeachersAsync({
      token: token
    }))
  }
  if (
    role === Role.NONE && 
    statusGetNotVerifiedUsers === ApiStatus.idle &&
    token
    ) 
  {
    dispatch(getNotVerifiedUsersAsync({
      token: token
    }))
  }
  }, [role, statusGetStudents, statusGetTeachers, statusGetNotVerifiedUsers, token])  

  const switchType = (role: Role): string =>  {
  switch (role) {
    case Role.NONE:
    return 'notVerified' 
    case Role.STUDENT:
    return 'students'
    case Role.TEACHER:
    return 'teachers'
    default:
    return ''
  }
  }

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void =>  {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = (e) => {
    const data = e.target?.result;
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    if (token) {
      if (role === Role.STUDENT) {
        const json: IStudentData[] = XLSX.utils.sheet_to_json(worksheet);
        dispatch(registerBatchStudentsAsync({students: json, token: token}))
      } else if (role === Role.TEACHER) {
        const json: ITeacherData[] = XLSX.utils.sheet_to_json(worksheet);
        dispatch(registerBatchTeachersAsync({teachers: json, token: token}))
      }
    }
    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }
  }
  

  return (
  <LoggedUserPage>
    <div
    className={componentClassName}
    >
    <div 
      className={`${componentClassName}__buttons`}
    >
      <Button 
      label={"Not Verified Accounts"}
      modifier={role !== Role.NONE ? ButtonModifier.unselected : ButtonModifier.none}
      onClick={() => {navigate('/admin/accounts/notVerified')}} 
      disabled={false} 
      />
      <Button 
      label={"Students"} 
      modifier={role !== Role.STUDENT ? ButtonModifier.unselected : ButtonModifier.none}
      onClick={() => {navigate('/admin/accounts/students')}}
      disabled={false} 
      />
      <Button 
      label={"Teachers"}
      modifier={role !== Role.TEACHER ? ButtonModifier.unselected : ButtonModifier.none} 
      onClick={() => {navigate('/admin/accounts/teachers')}}
      disabled={false} 
      />
    </div>
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
        onChange={onFileUpload}
        style={{
        display: "none"
        }}
        id={"import-excel-file-input"}
      />
      </>
    )}
    <AccountsList
      role={role} 
      title={t(`pages.accounts.${switchType(role)}.accountsListTitle`)}
      emails={emails} 
    />
    {role === Role.STUDENT && (
      <Modal 
      show={showModalRegisterBatchStudents} 
      closeModal={() => {dispatch(revertRegisterBatchStudents());}}
      >
      
      </Modal>  
    )}
    {role === Role.TEACHER && (
      <Modal 
      show={showModalRegisterBatchTeachers} 
      closeModal={() => {dispatch(revertRegisterBatchTeachers());}}
      >
    
      </Modal>
    )}
    </div>
  </LoggedUserPage>
  )
};

export default AccountsPage;