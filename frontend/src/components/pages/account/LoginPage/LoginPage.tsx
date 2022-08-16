import { useAppSelector, useAppDispatch } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import LoadingPage from "components/pages/LoadingPage";
import AuthentificationPage, { AccountAction } from "components/templates/AccountPage";
import { loginStatus, loginCode, loginShowModal, revertLogin } from "features/account/loginSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

const LoginPage = () => {

  const status = useAppSelector(loginStatus);
  const code = useAppSelector(loginCode);
  const showModal = useAppSelector(loginShowModal);

  const dispatch = useAppDispatch();

  const { t } = useTranslation("pages");

  switch (status) {
    case ApiStatus.success:
      return (
      <Navigate to="/" />
      )
    case ApiStatus.loading:
      return <LoadingPage />
    case ApiStatus.failed:
      return (
      <>
        <AuthentificationPage 
        action={AccountAction.login} 
        />
        <Modal
        show={showModal}
        closeModal={() => {
          dispatch(revertLogin())
        }}        
        >
          <ModalApiStatus 
            message={t(`account.login.codes.${code}`)} 
            error={true} 
          />
        </Modal>
      </>
      )
    default:
      return (
        <AuthentificationPage 
          action={AccountAction.login} 
        />
      )
    }

};

export default LoginPage;