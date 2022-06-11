import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import OptionalCourseCard from "./OptionalCourseCard";

export default {
  title: "Molecules/OptionalCourseCard",
  component: OptionalCourseCard
} as ComponentMeta<typeof OptionalCourseCard>;

const Template: ComponentStory<typeof OptionalCourseCard> = (args) => <OptionalCourseCard {...args}/>;

export const DefaultOptionalCourseCard = Template.bind({});

DefaultOptionalCourseCard.args = {
  optionalName: "English Literature",
  teacherName: "John Keating",
  teacherEmail: "john.keating@unibuc.ro",
  linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing"
}