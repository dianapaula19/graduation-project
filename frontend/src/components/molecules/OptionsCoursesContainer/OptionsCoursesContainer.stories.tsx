import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import OptionalCoursesContainer from "./OptionsCoursesContainer";

export default {
  title: "Molecules/OptionalCoursesContainer",
  component: OptionalCoursesContainer
} as ComponentMeta<typeof OptionalCoursesContainer>;

const Template: ComponentStory<typeof OptionalCoursesContainer> = (args) => <OptionalCoursesContainer {...args}/>;

export const DefaultOptionalCoursesContainer = Template.bind({});

DefaultOptionalCoursesContainer.args = {
  title: "Group 1",
  optionalsListId: 1,
  courses: [
    {
      courseId: 1,
      courseTitle: "English Literature",
      teacherName: "John Keating",
      teacherEmail: "john.keating@unibuc.ro",
      linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
    },
    {
      courseId: 2,
      courseTitle: "Math",
      teacherName: "John Keating",
      teacherEmail: "john.keating@unibuc.ro",
      linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
    },
    {
      courseId: 3,
      courseTitle: "Science",
      teacherName: "John Keating",
      teacherEmail: "john.keating@unibuc.ro",
      linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
    },
  ]
}
