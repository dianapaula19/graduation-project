import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ModalApiStatus from "./ModalApiStatus";

export default {
  title: "Molecules/ModalApiStatus",
  component: ModalApiStatus
} as ComponentMeta<typeof ModalApiStatus>;

const Template: ComponentStory<typeof ModalApiStatus> = (args) => <ModalApiStatus {...args}/>;

export const DefaultModalApiStatus = Template.bind({});