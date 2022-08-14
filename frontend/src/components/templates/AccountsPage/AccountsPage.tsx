import React, { useEffect, useState } from "react";
import { Degree, Domain, LearningMode, Role, StudyProgram } from "../../App";
import Button, { ButtonModifier } from "../../atoms/Button";
import InputField, { InputFieldType } from "../../atoms/InputField";
import AccountsList from "../../molecules/lists/AccountsList";
import LoggedUserPage from "../LoggedUserPage";
import $ from "jquery";
import "./AccountsPage.scss"
import { IAccountsPageProps} from "./AccountsPage.types";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import registerBatchStudentsSlice, { IRegisterBatchStudentsRequest, IStudentData, registerBatchStudentsAsync, registerBatchStudentsShowModal, registerBatchStudentsStatus, revertRegisterBatchStudents } from "../../../features/user/admin/user/registerBatchStudentsSlice";
import { ITeacherData, registerBatchTeachersAsync, registerBatchTeachersShowModal, registerBatchTeachersStatus, revertRegisterBatchTeachers } from "../../../features/user/admin/user/registerBatchTeachersSlice";
import { ApiStatus } from "../../../features/Utils";
import Modal from "../../molecules/Modal";
import { getStudentsAsync, getStudentsStatus, getStudentsStudents } from "../../../features/user/admin/user/getStudentsSlice";
import { getTeachersAsync, getTeachersStatus, getTeachersTeachers } from "../../../features/user/admin/user/getTeachersSlice";
import { getNotVerifiedUsersAsync, getNotVerifiedUsersStatus, getNotVerifiedUsersUsers } from "../../../features/user/admin/user/getNotVerifiedUsersSlice";
import { revertVerifyUser, verifyUserShowModal } from "../../../features/user/admin/user/verifyUserSlice";
import { useNavigate } from "react-router-dom";
import { loginToken } from "../../../features/auth/loginSlice";
import LoadingPage from "../../pages/LoadingPage";
import DropDown from "../../atoms/DropDown";
import { Department } from "../../App/App.types";
import { degreeMap, PLACEHOLDER } from "../../Utils";
import ModalApiStatus from "../../molecules/ModalApiStatus";

const AccountsPage = ({
  role,
}: IAccountsPageProps) => {

  const componentClassName = "accounts-page";
  const studentFiltersClassName = `${componentClassName}__students-filters`;
  const teacherFiltersClassName = `${componentClassName}__teachers-filters`;
  const dropDownStudentFiltersTranslate = "accounts.students.filters.dropDownFields";
  const inputStudentFiltersTranslate = "accounts.students.filters.inputFields";
  const inputTeacherFiltersTranslate = "accounts.teachers.filters.inputFields";

  const statusRegisterBatchStudents = useAppSelector(registerBatchStudentsStatus);
  const statusRegisterBatchTeachers = useAppSelector(registerBatchTeachersStatus);

  const [studentFilters, setstudentFilters] = useState({
    degree: PLACEHOLDER,
    domain: PLACEHOLDER,
    learningMode: PLACEHOLDER,
    studyProgram: PLACEHOLDER,
    year: PLACEHOLDER
  });

  const [studentSearch, setStudentSearch] = useState({
    studentGroup: '',
    studentLastName: ''
  });

  const [teacherSearch, setTeacherSearch] = useState({
    teacherLastName: ''
  })

  const { t } = useTranslation('pages'); 
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
    const filteredStudents = students.filter((student) => {
      if (studentFilters.degree === PLACEHOLDER) {
        return student;
      }
      if (studentFilters.domain === PLACEHOLDER) {
        return student.degree === studentFilters.degree;
      }
      if (studentFilters.learningMode === PLACEHOLDER) {
        return student.degree === studentFilters.degree && 
          student.domain === studentFilters.domain;
      }
      if (studentFilters.studyProgram === PLACEHOLDER) {
        return student.degree === studentFilters.degree && 
          student.domain === studentFilters.domain &&
          student.learning_mode === studentFilters.learningMode;
      }
      if (studentFilters.year === PLACEHOLDER) {
        return student.degree === studentFilters.degree && 
          student.domain === studentFilters.domain &&
          student.learning_mode === studentFilters.learningMode &&
          student.study_program === studentFilters.studyProgram
      }
      return student.degree === studentFilters.degree && 
          student.domain === studentFilters.domain &&
          student.learning_mode === studentFilters.learningMode &&
          student.study_program === studentFilters.studyProgram &&
          student.current_year === Number(studentFilters.year)
    });

    const filteredByGroupStudents = filteredStudents.filter((student) => {
      if (studentSearch.studentGroup === '') {
        return student;
      }
      else {
        return student.current_group.toLowerCase().startsWith(studentSearch.studentGroup.toLowerCase())
      }
    })

    const filteredByLastNameStudents = filteredByGroupStudents.filter((student) => {
      if (studentSearch.studentLastName === '') {
        return student;
      }
      else {
        return student.last_name.toLowerCase().startsWith(studentSearch.studentLastName.toLowerCase())
      }
    })

    filteredByLastNameStudents.forEach((student) => {
      emails.push(student.email);
    });
  }
  if (teachers !== null && role === Role.TEACHER) {
    const filteredByLastNameTeachers = teachers.filter((teacher) => {
      if (teacherSearch.teacherLastName === '') {
        return teacher;
      }
      else {
        return teacher.last_name.toLowerCase().startsWith(teacherSearch.teacherLastName.toLowerCase())
      }
    })

    filteredByLastNameTeachers.forEach((teacher) => {
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

  if (
    statusRegisterBatchStudents === ApiStatus.success &&
    token
  ) {
    dispatch(getStudentsAsync({
      token: token
    }))
  }

  if (
    statusRegisterBatchTeachers === ApiStatus.success &&
    token
  ) {
    dispatch(getTeachersAsync({
      token: token
    }))
  }


  }, [
    role, 
    statusGetStudents, 
    statusGetTeachers, 
    statusGetNotVerifiedUsers, 
    token
  ])  

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

  const handleChangeStudentsFilter = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.name === 'degree') {
      setstudentFilters({
        degree: e.target.value,
        domain: PLACEHOLDER,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER,
        year: PLACEHOLDER
      })  
      return;
    }
    if (e.target.name === 'domain') {
      setstudentFilters({
        ...studentFilters,
        domain: e.target.value,
        learningMode: PLACEHOLDER,
        studyProgram: PLACEHOLDER,
        year: PLACEHOLDER
      })  
      return;
    }
    if (e.target.name === 'learningMode') {
      setstudentFilters({
        ...studentFilters,
        learningMode: e.target.value,
        studyProgram: PLACEHOLDER,
        year: PLACEHOLDER
      })  
      return;
    }
    if (e.target.name === 'studyProgram') {
      setstudentFilters({
        ...studentFilters,
        studyProgram: e.target.value,
        year: PLACEHOLDER
      })  
      return;
    }
    setstudentFilters({
      ...studentFilters, 
      [e.target.name]: e.target.value
    })
  }

  const handleChangeStudentsSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStudentSearch({
      ...studentSearch,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeTeacherSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTeacherSearch({
      ...teacherSearch,
      [e.target.name]: e.target.value
    })
  }

  let modalRegisterBatchStudentComponent = null;

  switch(statusRegisterBatchStudents) {
    case ApiStatus.failed:
      modalRegisterBatchStudentComponent = <ModalApiStatus 
        message={t("accounts.notVerified.error")} 
        error={true} 
      />
      break;
    case ApiStatus.success:
      modalRegisterBatchStudentComponent = <ModalApiStatus 
        message={t("accounts.notVerified.success")} 
        error={false} 
      />
      break;
  }


  let modalRegisterBatchTeacherComponent = null;

  switch(statusRegisterBatchTeachers) {
    case ApiStatus.failed:
      modalRegisterBatchTeacherComponent = <ModalApiStatus 
        message={t("accounts.notVerified.error")} 
        error={true} 
      />
      break;
    case ApiStatus.success:
      modalRegisterBatchTeacherComponent = <ModalApiStatus 
        message={t("accounts.notVerified.success")} 
        error={false} 
      />
      break;
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
        label={t(`accounts.notVerified.buttonLabel`)}
        modifier={role !== Role.NONE ? ButtonModifier.unselected : ButtonModifier.none}
        onClick={() => {navigate('/admin/accounts/notVerified')}} 
        disabled={false} 
      />
      <Button 
        label={t(`accounts.students.buttonLabel`)}
        modifier={role !== Role.STUDENT ? ButtonModifier.unselected : ButtonModifier.none}
        onClick={() => {navigate('/admin/accounts/students')}}
        disabled={false} 
      />
      <Button 
        label={t(`accounts.teachers.buttonLabel`)}
        modifier={role !== Role.TEACHER ? ButtonModifier.unselected : ButtonModifier.none} 
        onClick={() => {navigate('/admin/accounts/teachers')}}
        disabled={false} 
      />
    </div>
    {role !== Role.NONE && (
      <>
      <Button 
        id={"import-excel-file-button"}
        label={t(`accounts.${switchType(role)}.fileUploadLabel`)}
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
    {role === Role.STUDENT && (
      <div
        className={`${studentFiltersClassName}`}
      >
        <div
          className={`${studentFiltersClassName}__dropdown-fields`}
        >
          <DropDown 
            name="degree"
            onChange={handleChangeStudentsFilter}
            label={t(`${dropDownStudentFiltersTranslate}.degree.label`)}
            placeholder={t(`${dropDownStudentFiltersTranslate}.degree.placeholder`)}
            defaultValue={studentFilters.degree}
            value={studentFilters.degree} 
            error={false}          
          >
            {Object.keys(Degree).map((key) => {
            return (
              <option
                value={key}
              >
                {t(`common:degrees.${key}`)}
              </option>
            )
            })}
          </DropDown>
          <DropDown
            name="domain"
            onChange={handleChangeStudentsFilter}
            label={t(`${dropDownStudentFiltersTranslate}.domain.label`)}
            placeholder={t(`${dropDownStudentFiltersTranslate}.domain.placeholder`)}
            defaultValue={studentFilters.domain}
            value={studentFilters.domain} 
            error={false}
          >
            { studentFilters.degree !== PLACEHOLDER && 
              Object.keys(degreeMap[studentFilters.degree]).map((key) => {
                return (
                  <option
                    value={key}
                  >
                    {t(`common:domains.${key}`)}
                  </option>
                )
              })
            }
          </DropDown>
          <DropDown 
            name="learningMode"
            onChange={handleChangeStudentsFilter}
            label={t(`${dropDownStudentFiltersTranslate}.learningMode.label`)}
            placeholder={t(`${dropDownStudentFiltersTranslate}.learningMode.placeholder`)}
            defaultValue={studentFilters.learningMode}
            value={studentFilters.learningMode} 
            error={false}
          >
            {
              studentFilters.degree !== PLACEHOLDER && 
              studentFilters.domain !== PLACEHOLDER && 
              Object.keys(degreeMap[studentFilters.degree][studentFilters.domain]).map((key) => {
              return (
                <option
                  value={key}
                >
                  {t(`common:learningModes.${key}`)}
                </option>
              )
              })
            }
          </DropDown>
          <DropDown 
            name="studyProgram"
            onChange={handleChangeStudentsFilter}
            label={t(`${dropDownStudentFiltersTranslate}.studyProgram.label`)}
            placeholder={t(`${dropDownStudentFiltersTranslate}.studyProgram.placeholder`)}
            defaultValue={studentFilters.studyProgram}
            value={studentFilters.studyProgram} 
            error={false}
          >
            {
              studentFilters.degree !== PLACEHOLDER && 
              studentFilters.domain !== PLACEHOLDER &&
              studentFilters.learningMode !== PLACEHOLDER && 
              Object.keys(degreeMap[studentFilters.degree][studentFilters.domain][studentFilters.learningMode]).map((key) => {
              return (
                <option
                  value={key}
                >
                  {t(`common:studyPrograms.${key}`)}
                </option>
              )
              })
            }
          </DropDown>
          <DropDown 
            name="year"
            onChange={handleChangeStudentsFilter}
            label={t(`${dropDownStudentFiltersTranslate}.year.label`)}
            placeholder={t(`${dropDownStudentFiltersTranslate}.year.placeholder`)}
            defaultValue={studentFilters.year}
            value={studentFilters.year} 
            error={false}
          >
          {
            studentFilters.degree !== PLACEHOLDER && 
            studentFilters.domain !== PLACEHOLDER &&
            studentFilters.learningMode !== PLACEHOLDER &&
            studentFilters.studyProgram !== PLACEHOLDER &&  
            degreeMap[studentFilters.degree][studentFilters.domain][studentFilters.learningMode][studentFilters.studyProgram].map((year: number) => {
            return (
              <option
                value={year}
              >
                {year}
              </option>
            )
            })
          }
          </DropDown>
        </div>
        <div
          className={`${studentFiltersClassName}__input-fields`}
        >
          <InputField
            name="studentGroup" 
            onChange={handleChangeStudentsSearch}
            type={InputFieldType.search} 
            error={false} 
            label={t(`${inputStudentFiltersTranslate}.group.label`)}
          />
          <InputField 
            name="studentLastName"
            onChange={handleChangeStudentsSearch}
            type={InputFieldType.search} 
            error={false} 
            label={t(`${inputStudentFiltersTranslate}.lastName.label`)}
          />  
        </div>
      </div>
    )}
    {
      role === Role.TEACHER && (
        <div
          className={`${teacherFiltersClassName}__input-fields`}
        >
          <InputField 
            name="teacherLastName"
            onChange={handleChangeTeacherSearch}
            type={InputFieldType.search} 
            error={false} 
            label={t(`${inputTeacherFiltersTranslate}.lastName.label`)} 
          />
        </div>
      )
    }
    <AccountsList
      role={role} 
      title={t(`accounts.${switchType(role)}.title`)}
      emails={emails} 
    />
    {role === Role.STUDENT && (
      <Modal 
        show={showModalRegisterBatchStudents} 
        closeModal={() => {dispatch(revertRegisterBatchStudents());}}
      >
        {modalRegisterBatchStudentComponent}
      </Modal>  
    )}
    {role === Role.TEACHER && (
      <Modal 
        show={showModalRegisterBatchTeachers} 
        closeModal={() => {dispatch(revertRegisterBatchTeachers());}}
      >
        {modalRegisterBatchTeacherComponent}
      </Modal>
    )}
    </div>
  </LoggedUserPage>
  )
};

export default AccountsPage;