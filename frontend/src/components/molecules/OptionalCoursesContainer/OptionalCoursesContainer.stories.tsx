import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import OptionalCoursesContainer from "./OptionalCoursesContainer";

export default {
    title: "Molecules/OptionalCoursesContainer",
    component: OptionalCoursesContainer
} as ComponentMeta<typeof OptionalCoursesContainer>;

const Template: ComponentStory<typeof OptionalCoursesContainer> = (args) => <OptionalCoursesContainer {...args}/>;

export const DefaultOptionalCoursesContainer = Template.bind({});

DefaultOptionalCoursesContainer.args = {
    groupTitle: "Group 1",
    groupId: "group-1",
    optionalCourses: [
        {
            optionalName: "English Literature",
            teacherName: "John Keating",
            teacherEmail: "john.keating@unibuc.ro",
            linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
        },
        {
            optionalName: "Math",
            teacherName: "John Keating",
            teacherEmail: "john.keating@unibuc.ro",
            linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
        },
        {
            optionalName: "Science",
            teacherName: "John Keating",
            teacherEmail: "john.keating@unibuc.ro",
            linkDocument: "https://drive.google.com/file/d/1FEGOZGraTHXvHkG_3dUavk96l43v9rBH/view?usp=sharing",
        },
    ]
}
