import { Item } from "@radix-ui/react-select";
import Link from "next/link";

import {FaGithub, FaLinkedin, FaTwitter, FaInstagram} from 'react-icons/fa'

const socials = [
    {icon: <FaGithub />, path: ''},
    {icon: <FaLinkedin />, path: ''},
    {icon: <FaTwitter />, path: ''},
    {icon: <FaInstagram />, path: ''},
]

const Social = ({containerStyles, iconStyles}) => {
    return (<div className={containerStyles}>
        {socials.map((item,index) => {
            return (
                <Link key={index} href={item.path} className={iconStyles}>
                    {item.icon}
                </Link>
            );
        })}
        </div>
    );
};

export default Social;