import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { recoverAccountCode, recoverAccountErrorMesssages, recoverAccountShowModal, recoverAccountStatus, revertRecoverAccount } from "../../../../features/auth/recoverAccountSlice";
import { ApiStatus } from "../../../../features/Utils";
import Modal from "../../../molecules/Modal";
import AuthentificationPage, { AuthentificationAction } from "../../../templates/AuthentificationPage";
import LoadingPage from "../../LoadingPage";

const RecoverAccountPage = () => {
  const status = useAppSelector(recoverAccountStatus);
  const code = useAppSelector(recoverAccountCode);
  const errorMessages = useAppSelector(recoverAccountErrorMesssages);
  const showModal = useAppSelector(recoverAccountShowModal);

  const dispatch = useAppDispatch();

  if (status === ApiStatus.loading) {
  return <LoadingPage />;
  }

  return (
  <>
    <AuthentificationPage 
    action={AuthentificationAction.recoverAccount} 
    />
    <Modal
      show={showModal}
      closeModal={() => {
      dispatch(revertRecoverAccount());
      }}        
    >
    <span></span>
    </Modal>
  </>
  ) 
  
}

export default RecoverAccountPage;