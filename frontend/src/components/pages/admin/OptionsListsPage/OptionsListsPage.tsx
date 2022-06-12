import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken } from "../../../../features/auth/loginSlice";
import { createOptionsListCode, createOptionsListShowModal, revertCreateOptionsList } from "../../../../features/user/admin/createOptionsListSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/getCoursesSlice";
import { getCurrentOptionsList, getOptionsListsAsync, getOptionsListsOptionsLists, getOptionsListsStatus, revertCurrentOptionsList } from "../../../../features/user/admin/getOptionsListsSlice";
import { revertUpdateOptionsList, updateOptionsListShowModal } from "../../../../features/user/admin/updateOptionsListSlice";
import { ApiStatus } from "../../../../features/Utils";
import Button from "../../../atoms/Button";
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
      dispatch(revertCreateOptionsList())
      if (token) {
        dispatch(getOptionsListsAsync({
          token: token
        }));
      }
    }}
    >
    Create TBA
    </Modal>
    <Modal 
    show={showModalUpdateOptionsList} 
    closeModal={() => {
      dispatch(revertUpdateOptionsList())
      if (token) {
        dispatch(getOptionsListsAsync({
          token: token
        }));  
      }
    }}
    >
    Update TBA
    </Modal>
  </LoggedUserPage>
  )

}

export default OptionsListsPage;