import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { registerCode, registerShowModal, registerStatus, revertRegister } from "../../../../features/auth/registerSlice";
import { ApiStatus } from "../../../../features/Utils";
import Modal from "../../../molecules/Modal";
import ModalApiStatus from "../../../molecules/ModalApiStatus";
import AuthentificationPage from "../../../templates/AuthentificationPage";
import { AuthentificationAction } from '../../../templates/AuthentificationPage';
import LoadingPage from "../../LoadingPage";

const RegistrationPage = () => {

  const status = useAppSelector(registerStatus);
  const code = useAppSelector(registerCode);
  const showModal = useAppSelector(registerShowModal);

  const dispatch = useAppDispatch();

  const { t } = useTranslation("pages");

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
        dispatch(revertRegister());
        }}        
      >
        <ModalApiStatus 
          message={t(`auth.registration.codes.${code}`)} 
          error={false} 
        />
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
        dispatch(revertRegister());
      }}        
      >
        <ModalApiStatus 
          message={t(`auth.registration.codes.${code}`)} 
          error={true} 
        />
      </Modal>
    </>;  
  default:
    return <AuthentificationPage action={AuthentificationAction.register} />;
  }

};

export default RegistrationPage;