import React from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import StudentsList from "../../../molecules/StudentsList";
import LoggedUserPage from "../../../templates/LoggedUserPage";

import "./OptionalCoursesList.scss";

const OptionalCoursesList = () => {

    const componentClassName = "optional-courses-list";

    const { t } = useTranslation();

    return (
        <LoggedUserPage>
            <div 
                className={componentClassName}
            >
                <StudentsList students={[
                    {
                        name: "Rachel Chu",
                        email: "rachel@chu.com"
                    },
                    {
                        name: "Carrie Bradshaw",
                        email: "carrie@bradshaw.com"
                    }
                ]}/>
                <Button 
                    label={t("excelButton")}
                    modifier={ButtonModifier.excel} 
                    disabled={false} 
                />    
            </div>
            
            
        </LoggedUserPage>
    )

}

export default OptionalCoursesList;