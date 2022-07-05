import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken } from "../../../../features/auth/loginSlice";
import { createOptionsListCode, createOptionsListShowModal, createOptionsListStatus, revertCreateOptionsList } from "../../../../features/user/admin/optionsList/createOptionsListSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/course/getCoursesSlice";
import { getCurrentOptionsList, getOptionsListsAsync, getOptionsListsOptionsLists, getOptionsListsStatus, revertCurrentOptionsList } from "../../../../features/user/admin/optionsList/getOptionsListsSlice";
import { revertUpdateOptionsList, updateOptionsListShowModal, updateOptionsListStatus } from "../../../../features/user/admin/optionsList/updateOptionsListSlice";
import { ApiStatus } from "../../../../features/Utils";
import Button from "../../../atoms/Button";
import Loader from "../../../atoms/Loader";
import OptionsListForm from "../../../molecules/forms/OptionsListForm";
import Modal from "../../../molecules/Modal";
import OptionsListCard from "../../../molecules/OptionsListCard";

import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./OptionsListsPage.scss";

const OptionsListsPage = () => {

  const componentClassName = "options-lists-page";
  const [showModalOptionsListForm, setShowModalOptionsListForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const optionsLists = useAppSelector(getOptionsListsOptionsLists);

  const showModalCreateOptionsList = useAppSelector(createOptionsListShowModal);
  const showModalUpdateOptionsList = useAppSelector(updateOptionsListShowModal);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const statusGetOptionsLists = useAppSelector(getOptionsListsStatus);
  const statusCreateOptionsList = useAppSelector(createOptionsListStatus);
  const statusUpdateOptionsList = useAppSelector(updateOptionsListStatus);
  const token = useAppSelector(loginToken);

  const domains: {[id: string]: string} = t("domains", {returnObjects: true}) as {[id: string]: string};

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
      showModalUpdateOptionsList
    ) {
      setShowModalOptionsListForm(false);
    }

  }, [
    statusGetCourses, 
    statusGetOptionsLists,
    showModalCreateOptionsList, 
    setShowModalOptionsListForm
  ])

  let createOptionsListModalComponent = null;

  switch (statusCreateOptionsList) {
    case ApiStatus.loading:
      createOptionsListModalComponent = <Loader />
      break;
    case ApiStatus.success:
      createOptionsListModalComponent = (
        <div>
          The options list was created successfully
        </div>
      )
      break;
    case ApiStatus.failed:
      createOptionsListModalComponent = (
        <div>
          There was an error creating the options list
        </div>
      )
      break;
    default:
      break;
  }

  let updateOptionsListModalComponent = null;

  switch (statusUpdateOptionsList) {
    case ApiStatus.loading:
      updateOptionsListModalComponent = <Loader />
      break;
    case ApiStatus.success:
      updateOptionsListModalComponent = (
        <div>
          The options list was updated successfully
        </div>
      )
      break;
    case ApiStatus.failed:
      updateOptionsListModalComponent = (
        <div>
          There was an error updating the options list
        </div>
      )
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
      Options Lists
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
      label={t("pages.optionsLists.createButton")} 
      onClick={() => {
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
  </LoggedUserPage>
  )

}

export default OptionsListsPage;