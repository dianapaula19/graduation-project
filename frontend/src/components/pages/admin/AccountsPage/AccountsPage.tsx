import "./AccountsPage.scss"
import * as XLSX from "xlsx";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { Role, Degree } from "components/App";
import Button, { ButtonModifier } from "components/atoms/Button";
import DropDown from "components/atoms/DropDown";
import InputField, { InputFieldType } from "components/atoms/InputField";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import AccountsList from "components/organisms/lists/AccountsList";
import LoadingPage from "components/pages/LoadingPage";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { PLACEHOLDER, degreeMap } from "components/Utils";
import { loginToken } from "features/account/loginSlice";
import { getNotVerifiedUsersStatus, getNotVerifiedUsersUsers, getNotVerifiedUsersAsync } from "features/user/admin/user/getNotVerifiedUsersSlice";
import { getStudentsStatus, getStudentsStudents, getStudentsAsync, revertGetStudents } from "features/user/admin/user/getStudentsSlice";
import { getTeachersStatus, getTeachersTeachers, getTeachersAsync, revertGetTeachers } from "features/user/admin/user/getTeachersSlice";
import { registerBatchStudentsStatus, registerBatchStudentsShowModal, registerBatchStudentsCode, IStudentData, registerBatchStudentsAsync, revertRegisterBatchStudents, registerBatchStudentsErrorMessages } from "features/user/admin/user/registerBatchStudentsSlice";
import { registerBatchTeachersStatus, registerBatchTeachersShowModal, registerBatchTeachersErrorMessages, registerBatchTeachersCode, ITeacherData, registerBatchTeachersAsync, revertRegisterBatchTeachers } from "features/user/admin/user/registerBatchTeachersSlice";
import { verifyUserStatus } from "features/user/admin/user/verifyUserSlice";
import { ApiStatus } from "features/Utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IAccountsPageProps } from "./AccountsPage.types";

const AccountsPage = ({
  role,
}: IAccountsPageProps) => {

  const componentClassName = "accounts-page";
  const studentFiltersClassName = `${componentClassName}__students-filters`;
  const teacherFiltersClassName = `${componentClassName}__teachers-filters`;
  const dropDownStudentFiltersTranslate = "admin.accounts.students.filters.dropDownFields";
  const inputStudentFiltersTranslate = "admin.accounts.students.filters.inputFields";
  const inputTeacherFiltersTranslate = "admin.accounts.teachers.filters.inputFields";

  const statusRegisterBatchStudents = useAppSelector(registerBatchStudentsStatus);
  const statusRegisterBatchTeachers = useAppSelector(registerBatchTeachersStatus);
  const statusVerifyUser = useAppSelector(verifyUserStatus);

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
  });

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
  const errorMessagesRegisterBatchStudents = useAppSelector(registerBatchStudentsErrorMessages);
  const errorMessagesRegisterBatchTeachers = useAppSelector(registerBatchTeachersErrorMessages);
  const codeRegisterBatchStudents = useAppSelector(registerBatchStudentsCode);
  const codeRegisterBatchTeachers = useAppSelector(registerBatchTeachersCode);

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

  }, [
    role, 
    statusGetStudents, 
    statusGetTeachers, 
    statusGetNotVerifiedUsers, 
    token,
    dispatch
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

  if (
    statusRegisterBatchStudents === ApiStatus.loading ||
    statusRegisterBatchTeachers === ApiStatus.loading ||
    statusVerifyUser === ApiStatus.loading  
  ) {
    return <LoadingPage />
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
        label={t(`admin.accounts.notVerified.buttonLabel`)}
        modifier={role !== Role.NONE ? ButtonModifier.unselected : ButtonModifier.none}
        onClick={() => {navigate('/admin/accounts/notVerified')}} 
        disabled={false} 
      />
      <Button 
        label={t(`admin.accounts.students.buttonLabel`)}
        modifier={role !== Role.STUDENT ? ButtonModifier.unselected : ButtonModifier.none}
        onClick={() => {navigate('/admin/accounts/students')}}
        disabled={false} 
      />
      <Button 
        label={t(`admin.accounts.teachers.buttonLabel`)}
        modifier={role !== Role.TEACHER ? ButtonModifier.unselected : ButtonModifier.none} 
        onClick={() => {navigate('/admin/accounts/teachers')}}
        disabled={false} 
      />
    </div>
    {role !== Role.NONE && (
      <>
        <InputField
          id={"import-excel-file-input"} 
          type={InputFieldType.file} 
          error={false} 
          label={t(`admin.accounts.${switchType(role)}.fileUploadLabel`)}
          accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
          onChange={onFileUpload}
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
      title={t(`admin.accounts.${switchType(role)}.title`)}
      emails={emails} 
    />
    {role === Role.STUDENT && (
      <Modal 
        show={showModalRegisterBatchStudents} 
        closeModal={() => {
          dispatch(revertRegisterBatchStudents());
          dispatch(revertGetStudents());
        }}
      >
        {statusRegisterBatchStudents === ApiStatus.failed && (
          <ModalApiStatus 
            message={t(`admin.accounts.students.error.${codeRegisterBatchStudents}`)} 
            status={statusRegisterBatchStudents}  
          />
        )}
        {statusRegisterBatchStudents === ApiStatus.success 
        && errorMessagesRegisterBatchStudents && (
          <ModalApiStatus 
            message={t(`admin.accounts.students.success.${codeRegisterBatchStudents}`)}
            additionalMessages={Array.from(errorMessagesRegisterBatchStudents, x => x.index + ": " + t(`admin.accounts.codes.${x.code}`))} 
            status={statusRegisterBatchStudents} 
          />
        )}
      </Modal>  
    )}
    {role === Role.TEACHER && (
      <Modal 
        show={showModalRegisterBatchTeachers} 
        closeModal={() => {
          
          dispatch(revertRegisterBatchTeachers());
          dispatch(revertGetTeachers());
        }}
      >
        {statusRegisterBatchTeachers === ApiStatus.failed && (
          <ModalApiStatus 
            message={t(`admin.accounts.teachers.error.${codeRegisterBatchTeachers}`)} 
            status={statusRegisterBatchTeachers} 
          />
        )}
        {statusRegisterBatchTeachers === ApiStatus.success 
          && errorMessagesRegisterBatchTeachers && (
          <ModalApiStatus 
            message={t(`admin.accounts.teachers.success.${codeRegisterBatchTeachers}`)} 
            additionalMessages={Array.from(errorMessagesRegisterBatchTeachers, x => (x.index + 1) + ": " + t(`admin.accounts.codes.${x.code}`))}  
            status={statusRegisterBatchTeachers} 
          />
        )}
      </Modal>
    )}
    </div>
  </LoggedUserPage>
  )
};

export default AccountsPage;