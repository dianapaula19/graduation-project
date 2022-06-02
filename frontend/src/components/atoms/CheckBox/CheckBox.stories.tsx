import React, { Children } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CheckBox from "./CheckBox";

export default {
    title: "Atoms/CheckBox",
    component: CheckBox
} as ComponentMeta<typeof CheckBox>;

const Template: ComponentStory<typeof CheckBox> = (args) => <CheckBox {...args} />;

export const DefaultCheckBox = Template.bind({});