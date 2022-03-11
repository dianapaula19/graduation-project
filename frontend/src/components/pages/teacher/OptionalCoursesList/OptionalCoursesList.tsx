import React from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import StudentsList from "../../../molecules/StudentsList";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


import "./OptionalCoursesList.scss";
import DropDown from "../../../atoms/DropDown";

const OptionalCoursesList = () => {

    const componentClassName = "optional-courses-list";

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

    const exportToExcel = () => {
        console.log("works");
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
                    label={t("excelButton")}
                    modifier={ButtonModifier.excel} 
                    onClick={exportToExcel}
                    disabled={false} 
                />    
            </div>
            
            
        </LoggedUserPage>
    )

}

export default OptionalCoursesList;