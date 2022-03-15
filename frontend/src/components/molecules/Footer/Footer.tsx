import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.scss";


const Footer = () => {
    
    const componentClassName = "footer";

    const { t } = useTranslation();
    
    return (
        
        <div 
            className={componentClassName}
        >
            <span>
                    © 2022
            </span>
            <br/>
            <span>
                {t("sidenav.facultyName")}
            </span>
        </div>
    )
}

export default Footer;