/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { delay, easeIn, motion } from "framer-motion";
import React, { useState } from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import { BsArrowUpRight,BsGithub } from "react-icons/bs";
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from "@/components/ui/tooltip";

import Link from "next/link";
import Image from "next/image";
import WorkSliderBtns from "@/components/WorkSliderBtns";

const projects = [
    {num: '01', category: 'Backend', title:'ML Stock Price Predictor',description:'Summer Project that uses SciKit Learn and pandas to analyze S&P 500 data and predict tomorrow\'s stock prices',
        stack: [{name:"Python"},{name:"Sci-Kit Learn"},{name:"Jupyter"},{name:"Pandas"}], image: "/assets/work/Pic9.png",
        live:"https://github.com/saurabh13113/ml-stock-price-predictor", github: "https://github.com/saurabh13113/ml-stock-price-predictor"},

    {num: '02', category: 'Backend', title:'ML Premier League Season Predictor',description:'Summer Project that uses SciKit Learn and pandas to analyze data of the Premier League obtained from web-scraping, to predict match results for the season',
        stack: [{name:"Python"},{name:"Sci-Kit Learn"},{name:"Jupyter"},{name:"Pandas"}], image: "/assets/work/Pic12.png",
        live:"https://github.com/saurabh13113/ml-premier-league-predictor", github: "https://github.com/saurabh13113/ml-premier-league-predictor"},

    {num: '03', category: 'Backend', title:'Web-Scraper for Premier League Data',description:'Summer Project that uses BeautifulSoup and pandas to obtain premier league data for the past few seasons using web-scraping.',
        stack: [{name:"Python"},{name:"Beautiful Soup"},{name:"Jupyter"},{name:"Pandas"}], image: "/assets/work/Pic13.png",
        live:"https://github.com/saurabh13113/webscraper-premier-league", github: "https://github.com/saurabh13113/webscraper-premier-league"},

    {num: '04', category: 'FullStack', title:'Math Chat Bot using Llama AI',description:'Summer Project that uses Meta Llama to build an AI chatbot to help students out with math problems and to practice math using next.js, react, vercel.',
        stack: [{name:"React"},{name:"Next.js"},{name:"Material UI"},{name:"Llama AI"},{name:"AWS EC2"}], image: "/assets/work/Pic14.png",
        live:"https://math-chatbot-eta.vercel.app/", github: "https://github.com/saurabh13113/math-chatbot/tree/main"},
    
    {num: '05', category: 'FullStack', title:'UAE Metro Ticketer',description:'Highschool Project that allows customers to purchase UAE metro tickets',
        stack: [{name:"Python"},{name:"TKinter"}], image: "/assets/work/Pic10.png",
        live:"https://github.com/saurabh13113/uaemetro-ticketer", github: "https://github.com/saurabh13113/uaemetro-ticketer"},

    {num: '06', category: 'FullStack', title:'Pantry Tracker',description:'Summer Project that is a pantry management application built with Next.js, Material UI, and Firebase',
        stack: [{name:"React"},{name:"Next.js"},{name:"Material UI"},{name:"Firebase"}], image: "/assets/work/Pic11.png",
        live:"https://pantry-app-lac.vercel.app/", github: "https://github.com/saurabh13113/pantry-app"},

    {num: '07', category: 'Backend', title:'Huffman Tree File Compressor',description:'University project that decompresses file sizes using Huffman trees.',
        stack: [{name:"Python"},], image: "/assets/work/Pic2.png",
        live:"https://github.com/saurabh13113/huffman-compressor-tree-", github: "https://github.com/saurabh13113/huffman-compressor-tree-"},

    {num: '08', category: 'Frontend', title:'Mobile System Tracker',description:'University assignment to track a mobile company and its customers including a visualizer to do the same',
        stack: [{name:"Python"},{name:"PyGame"}], image: "/assets/work/pic1.png",
        live:"https://github.com/saurabh13113/mobile-companytracker", github: "https://github.com/saurabh13113/mobile-companytracker"},

    {num: '09', category: 'FullStack', title:'TreeMap File Organizer',description:'University project that makes use of file system trees and treemaps to organize files and folders using a visualizer.',
        stack: [{name:"Python"},{name:"PyGame"}], image: "/assets/work/Pic4.png",
        live:"https://github.com/saurabh13113/treemap-file-organizer-tree-", github: "https://github.com/saurabh13113/treemap-file-organizer-tree-"},

    {num: '10', category: 'Frontend', title:'Driver Rider Pairer',description:'University project that matches up drivers and riders based on locational information',
        stack: [{name:"Python"}], image: "/assets/work/Pic8.png",
        live:"https://github.com/saurabh13113/uber-driver-rider-pairer", github: "https://github.com/saurabh13113/uber-driver-rider-pairer"},

    {num: '11', category: 'FullStack', title:'MindSnatcher Player Game',description:'University assignment to build a game over three months using Java and JavaFX following the principle of Agile Software development in a team of 4.',
        stack: [{name:"Java"},{name:"JavaFx"},{name:"PlayHT"}], image: "/assets/work/Pic3.png",
        live:"https://github.com/saurabh13113/mindsnatcher-game", github: "https://github.com/saurabh13113/mindsnatcher-game"},

    {num: '12', category: 'Backend', title:'Add Echo Program',description:'University project that removes vocals and adds an echoing sound to a audio(wav) file by decoding bit information.',
        stack: [{name:"C"}], image: "/assets/work/Pic7.png",
        live:"https://github.com/saurabh13113/add-echo", github: "https://github.com/saurabh13113/add-echo"},

    {num: '13', category: 'Backend', title:'tsh Mini Shell',description:'University project making a replica mini shell command prompt using C',
        stack: [{name:"C"}], image: "/assets/work/Pic6.png",
        live:"https://github.com/saurabh13113/tsh-mini-shell", github: "https://github.com/saurabh13113/tsh-mini-shell"},

    {num: '14', category: 'Backend', title:'Multiplayer Server Game',description:'University project that creates a local server on the Uoft servers and allows users to join and play a simple battle game',
        stack: [{name:"C"}], image: "/assets/work/Pic5.png",
        live:"https://github.com/saurabh13113/multiplayer-server-game", github: "https://github.com/saurabh13113/multiplayer-server-game"},
];

const work = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [project, setProject] = useState(projects[0]);
    const handleSlideChange = (swiper) => {
        const currentIndex = swiper.activeIndex;
        setProject(projects[currentIndex]);
    };
    return (<motion.section initial={{opacity:0}} animate={{opacity:1, 
                                                  transition:{delay:2.4,duration:0.4,ease:"easeIn"}}}
                            className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0">
        <div className="container mx-auto"> 
            <div className="flex flex-col xl:flex-row xl:gap-[30px]">
                <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col 
                                xl:justify-between order-2 xl:order-none"> 
                        <div className="flex flex-col gap-[30px]">
                                <div className="text-8xl leading-none font-extrabold 
                                    text-transparent text-outline">{project.num}</div>
                                <h2 className="text-[42px] font-bold leading-none text-white 
                                        group-hover:text-accent transition-all duration-500 capitalize">
                                            {project.category} project
                                </h2>
                                <p className="text-white/60">{project.description}</p>
                                <ul className="flex gap-4">
                                    {project.stack.map((item,index)=> {
                                    return (<li key={index} className="text-xl text-accent">
                                        {item.name}
                                        {index !== project.stack.length - 1 && ","}
                                        </li>
                                            );
                                        })}
                                </ul> 
                                <div className="border border-white/20"></div>
                            <div className="flex items-center gap-4">
                                <Link href={project.live}>
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full
                                                bg-white/5 flex justify-center items-center group">
                                                <BsArrowUpRight className="text-white text-3xl
                                                                group-hover:text-accent"/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Live project</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Link>
                                <Link href={project.github}>
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full
                                                bg-white/5 flex justify-center items-center group">
                                                <BsGithub className="text-white text-3xl
                                                                group-hover:text-accent"/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Link to github</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Link>
                            </div>
                        </div>         
                </div>
                <div className="w-full xl:w-[50%]">
                    <Swiper spaceBetween={30} slidesPerView={1} className="xl:h-[520px] mb-12" onSlideChange={handleSlideChange}>
                        {projects.map((project,index) => {
                                return (<SwiperSlide key={index} className="w-full">
                                    <div className="h-[460px] relative group flex justify-center 
                                        items-center bg-pink-50/20">
                                            <div className="absolute top-0 bottom-0 w-full h-full 
                                                            bg-black/10 z-10"></div>
                                            <div className="relative h-full w-full">
                                                <Image src={project.image}
                                                        fill className="object-cover"
                                                        alt = ""></Image>
                                            </div>
                                        </div>
                                </SwiperSlide>
                                );
                        })}
                        <WorkSliderBtns containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)]
                                        xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                                        btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px]
                                        w-[44px] h-[44px] flex justify-center items-center" />
                    </Swiper>
                </div>
            </div>
        </div>
    </motion.section>
    );
};

export default work
