import { useAppSelector, useAppDispatch } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import LoadingPage from "components/pages/LoadingPage";
import AuthentificationPage, { AccountAction } from "components/templates/AccountPage";
import { recoverAccountShowModal, recoverAccountStatus, revertRecoverAccount } from "features/account/recoverAccountSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";

const RecoverAccountPage = () => {

  const dispatch = useAppDispatch();
  const { t } = useTranslation("pages");
  
  const showModalRecoverAccount = useAppSelector(recoverAccountShowModal);
  const statusRecoverAccount = useAppSelector(recoverAccountStatus);

  switch (statusRecoverAccount) {
    case ApiStatus.loading:
      return <LoadingPage />;
    case ApiStatus.failed:
      return (
        <>
          <AuthentificationPage 
          action={AccountAction.recoverAccount} 
          />
          <Modal
            show={showModalRecoverAccount}
            closeModal={() => {
              dispatch(revertRecoverAccount());
            }}        
          >
            <ModalApiStatus 
              message={t("account.recoverAccount.error")} 
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
              show={showModalRecoverAccount}
              closeModal={() => {
                dispatch(revertRecoverAccount());
              }}        
            >
              <ModalApiStatus 
                message={t("account.recoverAccount.success")} 
                error={false} 
              />
            </Modal>
          </>
        );
    default:
      return <AuthentificationPage action={AccountAction.recoverAccount} />
  } 
  
}

export default RecoverAccountPage;