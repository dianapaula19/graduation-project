import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
          [{
            title: 'Discipline de specialitate',
            year: 3,
            semester: 1,
            domain: Domain.CTI,
            degree: Degree.BACHELOR,
            learningMode: LearningMode.IF,
            studyProgram: StudyProgram.TI,
          }].map((optionsList) => {
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
        <CreateOptionsListForm courses={[
            {
              id: 1,
              title: 'Math'
            }, 
            {
              id: 2,
              title: 'Romanian'
            }
            ]} 
          />
      </Modal>
    </LoggedUserPage>
  )

}

export default OptionsListsPage;