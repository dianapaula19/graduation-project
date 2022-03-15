import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LinkButton from "./LinkButton";

export default {
    title: "Atoms/LinkButton",
    component: LinkButton
} as ComponentMeta<typeof LinkButton>;

const Template: ComponentStory<typeof LinkButton> = (args) => <LinkButton {...args}/>;

export const DefaultButton = Template.bind({});