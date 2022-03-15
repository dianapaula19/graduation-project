import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "./Modal";

export default {
    title: "Molecules/Modal",
    component: Modal
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const DefaultModal = Template.bind({});

DefaultModal.args = {
    title: 'Text'
}