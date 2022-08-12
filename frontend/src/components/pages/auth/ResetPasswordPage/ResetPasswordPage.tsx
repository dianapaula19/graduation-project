import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { resetPasswordCode, resetPasswordErrorMesssage, resetPasswordShowModal, resetPasswordStatus, revertResetPassword } from "../../../../features/auth/resetPasswordSlice";
import { ApiStatus } from "../../../../features/Utils";
import Modal from "../../../molecules/Modal";
import AuthentificationPage, { AuthentificationAction } from "../../../templates/AuthentificationPage";
import LoadingPage from "../../LoadingPage";

const ResetPasswordPage = () => {
  
  const code = useAppSelector(resetPasswordCode);
  const errorMessage = useAppSelector(resetPasswordErrorMesssage);
  const showModal = useAppSelector(resetPasswordShowModal);

  const dispatch = useAppDispatch();

  return (
  <>
    <AuthentificationPage 
    action={AuthentificationAction.resetPassword} 
    />
    <Modal
      show={showModal}
      closeModal={() => {
        dispatch(revertResetPassword());
      }}        
    >
    </Modal>
  </>
  )
}

export default ResetPasswordPage;