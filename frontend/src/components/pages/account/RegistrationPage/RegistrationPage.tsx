import { useAppSelector, useAppDispatch } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import LoadingPage from "components/pages/LoadingPage";
import AuthentificationPage, { AccountAction } from "components/templates/AccountPage";
import { registerStatus, registerCode, registerShowModal, revertRegister } from "features/account/registerSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";

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
        action={AccountAction.registration} 
      />
      <Modal
        show={showModal}
        closeModal={() => {
        dispatch(revertRegister());
        }}        
      >
        <ModalApiStatus 
          message={t(`account.registration.codes.${code}`)} 
          error={false} 
        />
      </Modal>
      </>;
  case ApiStatus.failed:
    return <>
      <AuthentificationPage 
      action={AccountAction.registration} 
      />
      <Modal
      show={showModal}
      closeModal={() => {
        dispatch(revertRegister());
      }}        
      >
        <ModalApiStatus 
          message={t(`account.registration.codes.${code}`)} 
          error={true} 
        />
      </Modal>
    </>;  
  default:
    return <AuthentificationPage action={AccountAction.registration} />;
  }

};

export default RegistrationPage;