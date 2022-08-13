import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginCode, loginShowModal, loginStatus, revertLogin } from "../../../../features/auth/loginSlice";
import { ApiStatus } from "../../../../features/Utils";
import Modal from "../../../molecules/Modal";
import AuthentificationPage from "../../../templates/AuthentificationPage";
import { AuthentificationAction } from '../../../templates/AuthentificationPage/';
import LoadingPage from "../../LoadingPage";

const LoginPage = () => {

  const status = useAppSelector(loginStatus);
  const code = useAppSelector(loginCode);
  const showModal = useAppSelector(loginShowModal);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  switch (status) {
  case ApiStatus.loading:
    return (
    <LoadingPage />
    )
  case ApiStatus.success:
    return (
    <Navigate to="/" />
    )
  case ApiStatus.failed:
    return (
    <>
      <AuthentificationPage 
      action={AuthentificationAction.login} 
      />
      <Modal
      show={showModal}
      closeModal={() => {
        dispatch(revertLogin())
      }}        
      >
      <span>{code !== null ? t(`auth.login.codes.${code}`) : ''}</span>
      </Modal>
    </>
    )
  default:
    return (
    <AuthentificationPage 
      action={AuthentificationAction.login} 
    />
    )
  }

};

export default LoginPage;