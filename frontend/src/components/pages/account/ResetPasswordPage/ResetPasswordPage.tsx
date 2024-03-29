import { useAppDispatch, useAppSelector } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import LoadingPage from "components/pages/LoadingPage";
import AuthentificationPage, { AccountAction } from "components/templates/AccountPage";
import { loginStatus } from "features/account/loginSlice";
import { resetPasswordShowModal, resetPasswordStatus, revertResetPassword } from "features/account/resetPasswordSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {

  const { t } = useTranslation("pages");
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  
  const showModalResetPassword = useAppSelector(resetPasswordShowModal);
  const statusResetPassword = useAppSelector(resetPasswordStatus);
  const statusLogin = useAppSelector(loginStatus);

  if (statusLogin === ApiStatus.success) {
    return <Navigate to="/" />
  }

  switch (statusResetPassword) {
    case ApiStatus.loading:
      return <LoadingPage />;
    case ApiStatus.failed:
      return (
        <>
          <AuthentificationPage 
          action={AccountAction.resetPassword} 
          />
          <Modal
            show={showModalResetPassword}
            closeModal={() => {
              dispatch(revertResetPassword());
            }}        
          >
            <ModalApiStatus 
              message={t("account.resetPassword.error")} 
              status={statusResetPassword} 
            />
          </Modal>
        </>
      );
    case ApiStatus.success:  
      return (
        <>
          <AuthentificationPage 
          action={AccountAction.resetPassword} 
          />
          <Modal
            show={showModalResetPassword}
            closeModal={() => {
              dispatch(revertResetPassword());
              navigation('/login');
            }}        
          >
            <ModalApiStatus 
              message={t("account.resetPassword.success")} 
              status={statusResetPassword} 
            />
          </Modal>
        </>
      );
    default:
      return <AuthentificationPage action={AccountAction.resetPassword} />
  }

}

export default ResetPasswordPage;