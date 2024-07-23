"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectGroup, SelectItem,
         SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";  

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


const info = [
    {icon: <FaPhoneAlt />, title: "Phone", description: "647-831-6703",},
    {icon: <FaEnvelope />, title: "Email", description: "saurabhnair13113@gmail.com",},
    {icon: <FaMapMarkerAlt />, title: "Location", description: "Toronto, Ontario",},
];

import { motion,easeIn } from "framer-motion";

const contact = () => {
    return (<motion.section initial={{opacity: 0}}
                            animate={{opacity: 1, transition:{delay:2.4, duration:0.4, ease:"easeIn"},}}
                            className="py-6"> 
                        <div className="container mx-auto">
                            <div className="flex flex-col xl:flex-row gap-[30px]">
                                <div className="xl:h-[54px] order-2 xl:order-none">
                                    {/* FORM */}
                                    <form className="flex flex-col gap-6 p-10 bg-[#27272c]
                                                     rounded-xl"> 
                                        <h3 className="text-4xl text-accent"> LETS WORK TOGETHER </h3>
                                        <p className="text-white/60">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam, 
                                            error. Provident eius harum eveniet.</p> 
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input type="First Name" placeholder="First Name"/>
                                            <Input type="Last Name" placeholder="Last Name"/>
                                            <Input type="Email Address" placeholder="Email Address"/>
                                            <Input type="Phone Number" placeholder="Phone Number"/>
                                            <Input type="First Name" placeholder="First Name"/>
                                        </div>
                                        {/* SELECT */}
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a service"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel> Select a Service </SelectLabel>
                                                    <SelectItem value="est">Web Development</SelectItem>
                                                    <SelectItem value="cst">UI/UX</SelectItem>
                                                    <SelectItem value="mst">Logo Design</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {/* TEXTAREA */}
                                        <Textarea className="h-[200px]" 
                                                  placeholder="Type your message here."></Textarea>
                                    {/* BUTTON */}
                                    <Button size="md" className="max-w-40"> Send Message </Button>
                                    </form>
                                </div>
                                {/* INFO */}
                                <div className="flex-1 flex items-center xl:justify-end order-1
                                                xl:order-none mb-8 xl:mb-0">
                                    <ul className="flex flex-col gap-10">
                                        {info.map((item,index) => {
                                            return (<li key={index} className="flex items-center gap-6">
                                                <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] 
                                                                text-accent rounded-md flex items-center justify-center">
                                                    <div className="text-[28px]">{item.icon}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white/60">{item.title}</p>
                                                    <h3 className="text-xl ">{item.description}</h3>
                                                </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
            </motion.section>
        );
};

export default contact;