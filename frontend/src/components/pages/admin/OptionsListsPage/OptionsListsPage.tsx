import { useAppDispatch, useAppSelector } from "app/hooks";
import Button from "components/atoms/Button";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import OptionsListCard from "components/molecules/OptionsListCard";
import OptionsListForm from "components/organisms/forms/OptionsListForm";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginToken } from "features/account/loginSlice";
import { getCoursesStatus, getCoursesAsync } from "features/user/admin/course/getCoursesSlice";
import { createOptionsListShowModal, createOptionsListStatus, revertCreateOptionsList } from "features/user/admin/optionsList/createOptionsListSlice";
import { deleteOptionsListShowModal, deleteOptionsListStatus, revertDeleteOptionsList } from "features/user/admin/optionsList/deleteOptionsListSlice";
import { getOptionsListsOptionsLists, getOptionsListsStatus, getOptionsListsAsync, getCurrentOptionsList, revertCurrentOptionsList } from "features/user/admin/optionsList/getOptionsListsSlice";
import { updateOptionsListShowModal, updateOptionsListStatus, revertUpdateOptionsList } from "features/user/admin/optionsList/updateOptionsListSlice";
import { ApiStatus } from "features/Utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./OptionsListsPage.scss";

const OptionsListsPage = () => {

  const componentClassName = "options-lists-page";
  const [showModalOptionsListForm, setShowModalOptionsListForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  const { t } = useTranslation("pages");

  const dispatch = useAppDispatch();

  const optionsLists = useAppSelector(getOptionsListsOptionsLists);

  const showModalCreateOptionsList = useAppSelector(createOptionsListShowModal);
  const showModalUpdateOptionsList = useAppSelector(updateOptionsListShowModal);
  const showModalDeleteOptionsList = useAppSelector(deleteOptionsListShowModal);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const statusGetOptionsLists = useAppSelector(getOptionsListsStatus);
  const statusCreateOptionsList = useAppSelector(createOptionsListStatus);
  const statusUpdateOptionsList = useAppSelector(updateOptionsListStatus);
  const statusDeleteOptionsList = useAppSelector(deleteOptionsListStatus);
  const token = useAppSelector(loginToken);

  const domains: {[id: string]: string} = t("common:domains", {returnObjects: true}) as {[id: string]: string};

  useEffect(() => {
    if (
      statusGetCourses === ApiStatus.idle &&
      token
    ) {
      dispatch(getCoursesAsync({
        token: token
      }));
    }
    if (
      statusGetOptionsLists === ApiStatus.idle &&
      token
    ) {
      dispatch(getOptionsListsAsync({
        token: token
      }));
    }
    if (
      showModalCreateOptionsList || 
      showModalUpdateOptionsList ||
      showModalDeleteOptionsList
    ) {
      setShowModalOptionsListForm(false);
    }

  }, [
    statusGetCourses, 
    statusGetOptionsLists,
    showModalCreateOptionsList,
    showModalUpdateOptionsList,
    showModalDeleteOptionsList, 
    setShowModalOptionsListForm,
    dispatch,
    token
  ])

  let createOptionsListModalComponent = null;

  switch (statusCreateOptionsList) {
    case ApiStatus.success:
      createOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.success.create")} 
        error={false} 
      />;
      break;
    case ApiStatus.failed:
      createOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.error.create")} 
        error={true} 
      />;
      break;
    default:
      break;
  }

  let updateOptionsListModalComponent = null;

  switch (statusUpdateOptionsList) {
    case ApiStatus.success:
      updateOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.success.update")} 
        error={false} 
      />;
      break;
    case ApiStatus.failed:
      updateOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.error.update")} 
        error={true} 
      />;
      break;
    default:
      break;
  }

  let deleteOptionsListModalComponent = null;

  switch (statusDeleteOptionsList) {
    case ApiStatus.success:
      deleteOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.success.delete")} 
        error={false} 
      />;
      break;
    case ApiStatus.failed:
      deleteOptionsListModalComponent = <ModalApiStatus 
        message={t("admin.optionsLists.error.delete")} 
        error={true} 
      />;
      break;
    default:
      break;
  }
  

  return (
  <LoggedUserPage>
    <div
    className={componentClassName}
    >
    <span
      className={`${componentClassName}__title`}
    >
      {t("admin.optionsLists.title")}
    </span>
    {Object.keys(domains).map((key) => {
      return (
        <>
        <span
          style={{
          fontSize: 'x-large'
          }}
        >
          {domains[key]}
        </span>
        {optionsLists && optionsLists.filter(optionsList => optionsList.domain === key).map((optionsList) => {
          return (
          <OptionsListCard 
            data={optionsList}
            onClick={() => {
            setFormType('update');
            dispatch(getCurrentOptionsList({
              id: optionsList.id
            }));
            setShowModalOptionsListForm(true);
            }}
          />    
          )
        })}
        </>
      )
      })}
    <Button 
      label={t("admin.optionsLists.buttons.create")} 
      onClick={() => {
        setFormType('create');
        setShowModalOptionsListForm(true);
      }}
      disabled={false} 
    />
    </div>
    <Modal 
      show={showModalOptionsListForm} 
      closeModal={() => {
        dispatch(revertCurrentOptionsList());
        setShowModalOptionsListForm(false);
      }}
    >
    <OptionsListForm type={formType} />
    </Modal>
    <Modal 
      show={showModalCreateOptionsList} 
      closeModal={() => {
        setShowModalOptionsListForm(false);
        dispatch(revertCreateOptionsList())
        if (token) {
          dispatch(getOptionsListsAsync({
            token: token
          }));
      }
    }}
    >
    {createOptionsListModalComponent}
    </Modal>
    <Modal 
    show={showModalUpdateOptionsList} 
    closeModal={() => {
      setShowModalOptionsListForm(false);
      dispatch(revertUpdateOptionsList())
      if (token) {
        dispatch(getOptionsListsAsync({
          token: token
        }));  
      }
    }}
    >
    {updateOptionsListModalComponent}
    </Modal>
    <Modal 
      show={showModalDeleteOptionsList} 
      closeModal={() => {
        setShowModalOptionsListForm(false);
        dispatch(revertDeleteOptionsList())
        if (token) {
          dispatch(getOptionsListsAsync({
            token: token
          }));
      }
    }}
    >
    {deleteOptionsListModalComponent}
    </Modal>
  </LoggedUserPage>
  )

}

export default OptionsListsPage;