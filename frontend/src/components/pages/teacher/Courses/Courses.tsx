import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import StudentsList from "../../../molecules/lists/StudentsList";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


import "./Courses.scss";
import DropDown from "../../../atoms/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Modal from "../../../molecules/Modal";
import InputField, { InputFieldType } from "../../../atoms/InputField";
import TextAreaField from "../../../atoms/TextAreaField";
import LinkButton from "../../../atoms/LinkButton";
import { getCoursesTeacherAsync, teacherCourses } from "../../../../features/course/teacherCourseSlice";

const OptionalCoursesList = () => {

    const componentClassName = "courses";

    const courses = useAppSelector(teacherCourses);

    const dispatch = useAppDispatch();

    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const studentsList = [
        {
            name: "Rachel Chu",
            email: "rachel@chu.com"
        },
        {
            name: "Carrie Bradshaw",
            email: "carrie@bradshaw.com"
        }
    ];

    const { t } = useTranslation();

    const [showSendAnnouncementModal, setShowSendAnnouncementModal] = useState<boolean>(false);

    const [announcementData, setAnnouncementData] = useState({
        subject: '',
        body: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
        const name = e.target.name;
        const value = e.target.value;
        setAnnouncementData({
            ...announcementData,
            [name]: value
        });
    }

    const exportToExcel = () => {
        const header = [t("studentsList.header.name"), t("studentsList.header.email")];
        const ws = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(ws, [header]);
        studentsList.forEach((studentInfo) => {
            XLSX.utils.sheet_add_aoa(ws, 
                [[studentInfo.name, studentInfo.email]],
                {origin: -1}    
            )
        })

        const wb = { Sheets: {"data": ws}, SheetNames: ["data"]}
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], { type: fileType})
        FileSaver.saveAs(data, "List.xlsx");
    }

    useEffect(() => {
      if (courses === null) {
        dispatch(getCoursesTeacherAsync('john.keating@unibuc.ro'));
      }
    }, [courses])
    

    return (
        <LoggedUserPage>
            <div 
                className={componentClassName}
            >   
                <DropDown 
                    error={false} 
                    errorMessage={""} 
                    placeholder={"Choose an optional course"}
                    label={"Choose an optional course"}
                >
                    <option>
                        English Literature
                    </option>
                </DropDown>
                <StudentsList students={studentsList}/>
                <Button 
                    label={t("teacher.courses.mailButton")}
                    modifier={ButtonModifier.mail} 
                    onClick={() => {setShowSendAnnouncementModal(true)}}
                    disabled={false} 
                />
                <Button 
                    label={t("excelButton")}
                    modifier={ButtonModifier.excel} 
                    onClick={exportToExcel}
                    disabled={false} 
                />
                <Modal
                    show={showSendAnnouncementModal}
                    closeModal={() => {setShowSendAnnouncementModal(false)}}                
                >
                    <div className={`${componentClassName}__modal-content`}>
                        <InputField 
                            type={InputFieldType.text} 
                            error={false} 
                            errorMessage={""} 
                            label={"Subiect"}
                            id={"announcement-modal-subject"}
                            name={"subject"}
                            onChange={handleChange} 
                        />
                        <TextAreaField 
                            label={"Mesaj"}
                            id={"announcement-modal-body"}
                            name={"body"}
                            onChange={handleChange}
                        />
                        <LinkButton 
                            text={"Trimite mesaj"} 
                            href={`
                                mailto:${(studentsList.map(s => s.email)).concat(',')}
                                &subject=${announcementData.subject}
                                &body=${announcementData.body}`} 
                        />
                    </div>
                </Modal>
            </div>
        </LoggedUserPage>
    )

}

export default OptionalCoursesList;