import React, { ReactNode } from "react";
import LinkButton from "../../atoms/LinkButton/LinkButton";
import LogoSvg from "../../../assets/logo.svg";
import "./SideNav.scss";
import LanguageSwitch from "../../atoms/LanguagesSwitch/LanguageSwitch";
import { useTranslation } from "react-i18next";  
import { Time } from "./SideMenu.types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button";
import { loginStatus, loginUserData, revertLogin } from "../../../features/auth/loginSlice";
import { revertStudentData } from "../../../features/user/student/studentDataSlice";
import { useAppSelector } from "../../../app/hooks";

const SideNav = () => {
    
    const dispatch = useDispatch();
    const userData = useAppSelector(loginUserData);
    let navigate = useNavigate();

    const componentClassName = "side-nav";

    const { t } = useTranslation(); 

    let time: Time = null;

    let hr = (new Date()).getHours();

    if (hr >= 4 && hr <= 18) {
        time = 'morning';
    } else {
        time = 'night';
    }

    let displayMessage: string | null = null;
    let emoji: ReactNode | null = null;

    switch (time) {
        case 'morning':
            displayMessage = t("sidenav.displayMessage.morning");
            emoji = <span aria-label="sunflower">🌻</span>;
            break;
        case 'night':
            displayMessage = t("sidenav.displayMessage.night");
            emoji = <span aria-label="yawning-face">🥱</span>;
            break;
    }

    return(
        <div className={componentClassName}>
            <LanguageSwitch />
            <img
                src={LogoSvg}
                className={`${componentClassName}__logo`}

            />
            <div
                className={`${componentClassName}__welcome-message`}
            >
                <p>
                    {displayMessage}, {userData !== null ? (userData.first_name) : ('FIRST_NAME')} 
                    {emoji}
                </p>
            </div>
            <div 
                className={`${componentClassName}__links`}
            >   
                <Button 
                    label={t("sidenav.personalData")} 
                    onClick={() => {
                        navigate('/')
                    }}
                    disabled={false}                    
                />
                <Button 
                    label={t("sidenav.signOut")} 
                    onClick={() => {
                        dispatch(revertLogin());
                        dispatch(revertStudentData());
                        navigate('/login');
                    }}
                    disabled={false}                    
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