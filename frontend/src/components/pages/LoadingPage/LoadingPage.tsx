import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import Loader from "../../atoms/Loader";
import { Quote } from "./LoadingPage.types";
import "./LoadingPage.scss";

const LoadingPage = () => {
  
  const componentClassName = "loading-page";
  const contentClassName = `${componentClassName}__content`;

  const [quote, setQuote] = useState<Quote>({
    text: '',
    author: ''
  });

  const { t } = useTranslation();
  
  useEffect(() => {
    if (quote.text === '' || quote.author === '') {
      const index = (Math.floor(Math.random() * 2)).toString();
      setQuote({
        ['text']: t(`loadingPage.quotes.${index}.text`),
        ['author']: t(`loadingPage.quotes.${index}.author`)
      });
    }
  }, [quote, setQuote, t])
  
  
  return (
    <div 
      className={componentClassName}
    >
      <div
        className={contentClassName}
      >
        <span 
          aria-label="sparkles"
          className={`${contentClassName}__emoji`}
        >
            ✨
        </span>
        <span
          className={`${contentClassName}__text`}
        >
          {quote.text}
        </span>
        <span
          className={`${contentClassName}__author`}
        >
          - {quote.author}
        </span>
        <Loader />
      </div>
    </div>
  )
}

export default LoadingPage;