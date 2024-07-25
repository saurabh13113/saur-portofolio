import { Item } from "@radix-ui/react-select";
import Link from "next/link";

import {FaGithub, FaLinkedin, FaInstagram, FaFacebook} from 'react-icons/fa'

const socials = [
    {icon: <FaGithub />, path: 'https://github.com/saurabh13113' },
    {icon: <FaLinkedin />, path: 'https://www.linkedin.com/in/saurabh-nair-bb66781b4/'},
    {icon: <FaFacebook />, path: 'https://www.facebook.com/profile.php?id=100090785030297'},
    {icon: <FaInstagram />, path: 'https://www.instagram.com/saurabh_13113/?hl=en'},
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