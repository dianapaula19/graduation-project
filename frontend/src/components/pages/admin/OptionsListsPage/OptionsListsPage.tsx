import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { createOptionsListCode, createOptionsListShowModal, createOptionsListStatus, revertCreateOptionsList } from "../../../../features/user/admin/createOptionsListSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/getCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";
import Button from "../../../atoms/Button";
import CreateOptionsListForm from "../../../molecules/forms/CreateOptionsListForm";
import Modal from "../../../molecules/Modal";
import OptionsListCard from "../../../molecules/OptionsListCard";
import OptionalsListCard from "../../../molecules/OptionsListCard";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./OptionsListsPage.scss";

const OptionsListsPage = () => {

  const componentClassName = "options-lists-page";
  const [showCreateOptionsListFormModal, setShowCreateOptionsListFormModal] = useState<boolean>(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const showModal = useAppSelector(createOptionsListShowModal);
  const code = useAppSelector(createOptionsListCode);
  const statusCourses = useAppSelector(getCoursesStatus);
  const courses = useAppSelector(getCoursesCourses);

  useEffect(() => {
    if (statusCourses === ApiStatus.idle) {
      dispatch(getCoursesAsync());
    }
    if (showModal === true) {
      setShowCreateOptionsListFormModal(false)
    }
  }, [
    statusCourses, 
    showModal, 
    setShowCreateOptionsListFormModal
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
        [
          {
            title: 'Discipline de specialitate',
            year: 3,
            semester: 1,
            domain: Domain.CTI,
            degree: Degree.BACHELOR,
            learningMode: LearningMode.IF,
            studyProgram: StudyProgram.TI,
          },
          {
            title: 'Discipline de specialitate',
            year: 3,
            semester: 1,
            domain: Domain.CTI,
            degree: Degree.BACHELOR,
            learningMode: LearningMode.IF,
            studyProgram: StudyProgram.TI,
          }
        ].map((optionsList) => {
            return (
              <OptionsListCard 
                title={optionsList.title} 
                year={optionsList.year} 
                semester={optionsList.semester} 
                domain={Domain.INFO} 
                degree={Degree.BACHELOR} 
                learningMode={LearningMode.IF} 
                studyProgram={StudyProgram.NLP} 
              />
            )
          })
        }
        <Button 
          label={t("pages.optionsLists.createButton")} 
          onClick={() => setShowCreateOptionsListFormModal(true)}
          disabled={false} 
        />
      </div>
      <Modal 
        show={showCreateOptionsListFormModal} 
        closeModal={() => setShowCreateOptionsListFormModal(false)}
      >
        <CreateOptionsListForm courses={courses !== null ? courses : []} />
      </Modal>
      <Modal show={showModal} closeModal={() => {dispatch(revertCreateOptionsList())}}>
        {code}
      </Modal>
    </LoggedUserPage>
  )

}

export default OptionsListsPage;