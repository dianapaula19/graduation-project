import { useAppDispatch } from "app/hooks";
import LogoSVG from "assets/logo.svg";
import Button from "components/atoms/Button";
import InputField, { InputFieldType } from "components/atoms/InputField";
import { recoverAccountAsync } from "features/account/recoverAccountSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { regexRules } from "../Utils";
import "./RecoverAccountForm.scss";
import { IRecoverAccountFormData } from "./RecoverAccountForm.types";

const RecoverAccountForm = () => {

  const { t } = useTranslation('forms');

  const dispatch = useAppDispatch();

  const [data, setData] = useState<IRecoverAccountFormData>({
    email: "",
  });

  const validation = {
    email: !regexRules.email.test(data.email)
  }

  const componentClassName = "recover-account-form";
  const componentId = "recover-account-form";

  const inputFieldsTranslate = "recoverAccount.inputFields";
  const submitButtonsTranslate = "recoverAccount.buttons";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value
    });
  }

  const onSubmit = (): void => {
    dispatch(recoverAccountAsync({
      email: data.email
    }));
  }

  return(
    <div className={componentClassName}>
      <img
        className={`${componentClassName}__img`}
        src={LogoSVG}
        alt={t("common:img.logo")}
      />
      <p
        className={`${componentClassName}__instructions`}
      
      >
        {t("recoverAccount.instructions")}
      </p>
      <InputField 
        type={InputFieldType.email}
        name={"email"}
        id={`${componentId}-email`}
        placeholder={t(`${inputFieldsTranslate}.email.placeholder`)} 
        errorMessage={t(`${inputFieldsTranslate}.email.errorMessage`)}
        label={t(`${inputFieldsTranslate}.email.label`)}
        error={validation.email}
        onChange={handleChange}      
      />
      <Button 
        label={t(`${submitButtonsTranslate}.sendInstructions`)} 
        disabled={validation.email}
        onClick={onSubmit}
      />
    </div>
  )
}

export default RecoverAccountForm;