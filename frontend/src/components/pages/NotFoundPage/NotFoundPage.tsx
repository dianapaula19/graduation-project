import React from "react";
import NotFoundSvg from "./assets/not-found.svg";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  
  const componentClassName = "not-found-page";
  
  return (
    <div 
      className={componentClassName}
    >
      <img
        src={NotFoundSvg}
        className={`${componentClassName}__img`}
        tabIndex={1}
      />
      <p>
        Pagina căutată nu a fost găsită. Întoarce-te la pagina <a href="/">principală</a>
      </p>
    </div>
  )
}

export default NotFoundPage;