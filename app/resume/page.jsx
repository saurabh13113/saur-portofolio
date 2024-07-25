"use client";

import { FaJava, FaCss3, FaJs, FaReact, FaFigma, FaNodeJs, FaPython, FaGitAlt, FaRProject, FaGithub, FaCopyright } from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiMysql } from "react-icons/si";

// sum light info
const about = {
    title: 'About me',
    description: 'A passionate software developer from Abu Dhabi 🇦🇪, and a student in Canada.',

    info: [
        {fieldName: "Name",fieldValue: "Saurabh Nair"},
        {fieldName: "Phone",fieldValue: "+1 (647) 831 6703"},
        {fieldName: "Experience",fieldValue: "2+ Years"},
        {fieldName: "Email",fieldValue: "saurabhnair13113@gmail.com"},
        {fieldName: "Nationality",fieldValue: "Indian"},
        {fieldName: "Languages",fieldValue: "English, Hindi, French, Arabic"},
    ]
}

// sum light experience
const experience = { 
    icon: ' ',
    title: " My experience",
    description: "This is my experience summed up.",
    items: [
        {company: "Emirates Steel Arkan", position: "Software Integration Intern",
         duration: "August 2024 - September 2024",},
        {company: "Kaytoons Inc.", position: "Backend Development Intern",
         duration: "May 2024 - September 2024",},
        {company: "University of Toronto Mississauga", position: "Residence Facilities Assistant",
         duration: "September 2023 - May 2025",},
    ],
};

// sum light education
const education = { 
    icon: ' ',
    title: " My education",
    description: "This is where and what I studied.",
    items: [
        {institution: "University of Toronto", degree: "B.Sc Computer Science + Economics",
         duration: "2022-2026",},
        {institution: "Abu Dhabi Indian School", degree: "CBSE Diploma",
         duration: "2010-2022",},
    ],
};

//sum light skills
const skills = {
    title: "My skills",
    description: "This is my skills that I have gained.",
    skillList: [
        {icon: <FaJava/>, name: "JAVA",},
        {icon: <FaGithub/>, name: "GITHUB",},
        {icon: <FaCopyright/>, name: "C Programming Language",},
        {icon: <FaJs/>, name: "JAVASCRIPT",},
        {icon: <FaPython/>, name: "PYTHON",},
        {icon: <FaFigma/>, name: "FIGMA",},
        {icon: <FaReact/>, name: "REACT",},
        {icon: <SiTailwindcss/>, name: "TAILWIND",},
        {icon: <SiNextdotjs/>, name: "NEXT",},
        {icon: <SiMysql/>, name: "MYSQL",},
        {icon: <FaGitAlt/>, name: "GIT",},
        {icon: <FaRProject/>, name: "R",},
    ],
};

import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const Resume = () => {
    return (<motion.div  initial={{opacity: 0 }}
                        animate={{opacity: 1, 
                                  transition: {delay:2.4, duration: 0.4, ease: 'easeIn'},
                        }} className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"> 
                <div className="container mx-auto">
                        <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-[60px]">
                            <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
                                <TabsTrigger value="experience"> Experience </TabsTrigger>
                                <TabsTrigger value="education"> Education </TabsTrigger>
                                <TabsTrigger value="skills"> Skills </TabsTrigger>
                                <TabsTrigger value="about"> About Me </TabsTrigger>
                            </TabsList>

                            <div className="min-h-[70vh] w-full">
                                <TabsContent value="experience" className="w-full">
                                    <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                        <h3 className="text-4xl font-bold"> {experience.title} </h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0"> {experience.description} </p>
                                        <ScrollArea className="h-[400px]">
                                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                                {experience.items.map((item,index) => {
                                                    return <li key={index}
                                                               className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex 
                                                               flex-col justify-center items-center lg:items-start gap-1">
                                                        <span className="text-accent">{item.duration}</span>
                                                        <h3 className="text-xl max-[260px] min-h-[60px] text-center lg:text-left">{item.position}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                                                            <p className="text-white/60">{item.company}</p>
                                                        </div>
                                                    </li>
                                                })}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="education" className="w-full">
                                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                        <h3 className="text-4xl font-bold"> {education.title} </h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0"> {education.description} </p>
                                        <ScrollArea className="h-[400px]">
                                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                                {education.items.map((item,index) => {
                                                    return <li key={index}
                                                               className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex 
                                                               flex-col justify-center items-center lg:items-start gap-1">
                                                        <span className="text-accent">{item.duration}</span>
                                                        <h3 className="text-xl max-[260px] min-h-[60px] text-center lg:text-left">{item.degree}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                                                            <p className="text-white/60">{item.institution}</p>
                                                        </div>
                                                    </li>
                                                })}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                </TabsContent>
                                <TabsContent value="skills" className="w-full">
                                <div className="flex flex-col gap-[30px]">
                                    <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                        <h3 className="text-4xl font-bold"> {skills.title} </h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0"> {skills.description} </p>
                                            </div>
                                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px]">
                                                {skills.skillList.map((skill,index) => {
                                                    return ( <li key={index}>
                                                        <TooltipProvider delayDuration={100}>
                                                            <Tooltip>
                                                                <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex
                                                                                           justify-center items-center group">
                                                                    <div className="text-6xl group-hover:text-accent transition-all
                                                                                    duration-300"> {skill.icon} </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="Capitalize"> {skill.name} </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </li>
                                                    );
                                                })}
                                            </ul>
                                    </div>
                                </TabsContent>
                                <TabsContent value="about" className="w-full text-center xl:text-left">
                                <div className="flex flex-col gap-[30px]">
                                        <h3 className="text-4xl font-bold"> {about.title} </h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0"> {about.description} </p>
                                            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                                                {about.info.map((item,index) => {
                                                    return (<li key={index} className="flex items-center justify-center 
                                                                                       xl:justify-start gap-4">
                                                        <span className="text-white/60">{item.fieldName}</span>
                                                        <span className="text-xl">{item.fieldValue}</span>
                                                    </li>
                                                    );
                                                })}
                                            </ul>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                </div>
            </motion.div>
            );
};

export default Resume;
