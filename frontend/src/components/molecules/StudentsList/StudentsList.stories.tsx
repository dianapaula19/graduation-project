import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StudentsList from "./StudentsList";

export default {
    title: "Molecules/StudentsList",
    component: StudentsList
} as ComponentMeta<typeof StudentsList>;

const Template: ComponentStory<typeof StudentsList> = (args) => <StudentsList {...args}/>;

export const DefaultStudentsList = Template.bind({});

DefaultStudentsList.args = {
    students: [
        {
            name: "Rachel Chu",
            email: "rachel@chu.com"
        },
        {
            name: "Nick Young",
            email: "nick@young.com"
        },
    ]
}