import React from "react";
import LinkButton from "../../atoms/LinkButton/LinkButton";
import LogoSvg from "../../../assets/logo.svg";
import "./SideNav.scss";
import LanguageSwitch from "../../atoms/LanguagesSwitch/LanguageSwitch";
import { useTranslation } from "react-i18next";  

const SideNav = () => {
    
    const componentClassName = "side-nav";

    const { t } = useTranslation(); 

    return(
        <div className={componentClassName}>
            <LanguageSwitch />
            <img
                src={LogoSvg}
                className={`${componentClassName}__logo`}

            />
            <div 
                className={`${componentClassName}__links`}
            >   
                <LinkButton 
                    text={t("sidenav.signOut")} 
                    href={"/login"}
                />

            </div>
            <p
                className={`${componentClassName}__copyright`}
            >
                <span>
                    © 2022
                </span>
                <br/>
                <span>
                    {t("sidenav.facultyName")}
                </span>
            </p>

        </div>
    )
}

export default SideNav;