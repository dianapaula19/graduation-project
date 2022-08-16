import { useAppDispatch, useAppSelector } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import LoadingPage from "components/pages/LoadingPage";
import AuthentificationPage, { AccountAction } from "components/templates/AccountPage";
import { resetPasswordShowModal, resetPasswordStatus, revertResetPassword } from "features/account/resetPasswordSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {

  const { t } = useTranslation("pages");
  const dispatch = useAppDispatch();
  
  const showModalResetPassword = useAppSelector(resetPasswordShowModal);
  const statusResetPassword = useAppSelector(resetPasswordStatus);

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
              error={true} 
            />
          </Modal>
        </>
      );
    case ApiStatus.success:  
      return (
        <>
          <AuthentificationPage 
          action={AccountAction.recoverAccount} 
          />
          <Modal
            show={showModalResetPassword}
            closeModal={() => {
              dispatch(revertResetPassword());
            }}        
          >
            <ModalApiStatus 
              message={t("account.resetPassword.success")} 
              error={false} 
            />
          </Modal>
        </>
      );
    default:
      return <AuthentificationPage action={AccountAction.resetPassword} />
  }

}

export default ResetPasswordPage;