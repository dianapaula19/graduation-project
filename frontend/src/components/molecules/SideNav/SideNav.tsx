import React from "react";
import LinkButton from "../../atoms/LinkButton/LinkButton";
import LogoSvg from "../../../assets/logo.svg";
import "./SideNav.scss";
import LanguageSwitch from "../../atoms/LanguagesSwitch/LanguageSwitch";

const SideNav = () => {
    const componentClassName = "side-nav";
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
                <LinkButton text={"Deconecteaza-te"} href={""}/>

            </div>
            <p
                className={`${componentClassName}__copyright`}
            >
                <span>
                    © 2022
                </span>
                <br/>
                <span>
                    Facultatea de Matematică și Informatică
                </span>
            </p>

        </div>
    )
}

export default SideNav;