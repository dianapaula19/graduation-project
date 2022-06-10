import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import OptionsListCard from "./OptionsListCard";
import { Degree, Domain, LearningMode, StudyProgram } from "../../App";

export default {
    title: "Molecules/OptionsListCard",
    component: OptionsListCard
} as ComponentMeta<typeof OptionsListCard>;

const Template: ComponentStory<typeof OptionsListCard> = (args) => <OptionsListCard {...args} />;

export const DefaultOptionsListCard = Template.bind({});

DefaultOptionsListCard.args = {
}