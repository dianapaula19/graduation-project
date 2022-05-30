import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { registerCode, registerShowModal, registerStatus, revert } from "../../../../features/auth/registerSlice";
import { ApiStatus } from "../../../../features/Utils";
import Modal from "../../../molecules/Modal";
import AuthentificationPage from "../../../templates/AuthentificationPage";
import { AuthentificationAction } from '../../../templates/AuthentificationPage/';
import LoadingPage from "../../LoadingPage";

const RegisterPage = () => {

  const status = useAppSelector(registerStatus);
  const code = useAppSelector(registerCode);
  const showModal = useAppSelector(registerShowModal);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  switch (status) {
    case ApiStatus.loading:
      return <LoadingPage />;  
    case ApiStatus.success:
      return <>
            <AuthentificationPage 
              action={AuthentificationAction.register} 
            />
            <Modal
              show={showModal}
              closeModal={() => {
                dispatch(revert());
              }}                
            >
              <span>{code !== null ? t(`register.codes.${code}`) : 'Error'}</span>
            </Modal>
          </>;
    case ApiStatus.failed:
      return <>
          <AuthentificationPage 
            action={AuthentificationAction.register} 
          />
          <Modal
            show={showModal}
            closeModal={() => {
              dispatch(revert());
            }}                
          >
            <span>{code !== null ? t(`register.codes.${code}`) : 'Error'}</span>
          </Modal>
        </>;  
    default:
      return <AuthentificationPage action={AuthentificationAction.register} />;
  }

};

export default RegisterPage;