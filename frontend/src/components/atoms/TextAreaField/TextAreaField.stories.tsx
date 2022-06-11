import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TextAreaField from "./TextAreaField";

export default {
  title: "Atoms/TextAreaField",
  component: TextAreaField
} as ComponentMeta<typeof TextAreaField>;

const Template: ComponentStory<typeof TextAreaField> = (args) => <TextAreaField {...args}/>;

export const TextField = Template.bind({});

TextField.args = {
  label: "Text",
  placeholder: "Text",
  maxLength: 12,
  required: true
}