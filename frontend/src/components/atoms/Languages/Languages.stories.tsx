import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Languages from "./Languages";

export default {
    title: "Molecules/Languages",
    component: Languages
} as ComponentMeta<typeof Languages>;

const Template: ComponentStory<typeof Languages> = () => <Languages />;

export const DefaultLanguages = Template.bind({});