import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DropDown from "./DropDown";

export default {
    title: "Atoms/DropDown",
    component: DropDown
} as ComponentMeta<typeof DropDown>;

const Template: ComponentStory<typeof DropDown> = () => <DropDown />;

export const DefaultDropDown = Template.bind({});