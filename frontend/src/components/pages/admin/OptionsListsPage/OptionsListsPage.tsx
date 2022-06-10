import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { createOptionsListCode, createOptionsListShowModal, createOptionsListStatus, revertCreateOptionsList } from "../../../../features/user/admin/createOptionsListSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/getCoursesSlice";
import { getCurrentOptionsList, getOptionsListsAsync, getOptionsListsCode, getOptionsListsOptionsLists, getOptionsListsStatus, revertCurrentOptionsList } from "../../../../features/user/admin/getOptionsListsSlice";
import { ApiStatus } from "../../../../features/Utils";
import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";
import Button from "../../../atoms/Button";
import OptionsListForm from "../../../molecules/forms/OptionsListForm";
import CreateOptionsListForm from "../../../molecules/forms/OptionsListForm";
import Modal from "../../../molecules/Modal";
import OptionsListCard from "../../../molecules/OptionsListCard";
import OptionalsListCard from "../../../molecules/OptionsListCard";
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
  const code = useAppSelector(createOptionsListCode);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const statusGetOptionsLists = useAppSelector(getOptionsListsStatus);
  const courses = useAppSelector(getCoursesCourses);

  useEffect(() => {
    if (statusGetCourses === ApiStatus.idle) {
      dispatch(getCoursesAsync());
    }
    if (
      statusGetOptionsLists === ApiStatus.idle ||
      statusGetOptionsLists === ApiStatus.failed
    ) {
      dispatch(getOptionsListsAsync());
    }
    if (showModalCreateOptionsList) {
      setShowModalOptionsListForm(false)
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
        {
        optionsLists && optionsLists.map((optionsList) => {
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
          })
        }
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

        }}
      >
        
      </Modal>
    </LoggedUserPage>
  )

}

export default OptionsListsPage;