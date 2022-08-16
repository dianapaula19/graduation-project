import Loader from "components/atoms/Loader";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LoadingPage.scss";
import { Quote } from "./LoadingPage.types";

const LoadingPage = () => {
  
  const componentClassName = "loading-page";
  const contentClassName = `${componentClassName}__content`;

  const [quote, setQuote] = useState<Quote>({
    text: '',
    author: ''
  });

  const { t } = useTranslation("pages");
  
  useEffect(() => {
  if (quote.text === '' || quote.author === '') {
    const index = (Math.floor(Math.random() * 2)).toString();
    setQuote({
      'text': t(`loading.quotes.${index}.text`),
      'author': t(`loading.quotes.${index}.author`)
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