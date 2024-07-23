import Link from "next/link"
import { Button } from "./ui/button";
 
import Nav from "./Nav";
import MobileNav from "./MobileNav";


const Header = () => {
    return <header className="py-8 xl:py-12 text-white bg-pink-50/20">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/">
            <h1 className="text-3xl font-semibold">
                Saurabh Nair <span className="text-accent">.</span>
            </h1>
            </Link>

            {/* desktop navigation*/}
            <div className="hidden xl:flex items-center gap-8">
                <Nav />
                <Link href="/contact">
                    <Button> Get in touch! </Button>
                </Link>
            </div>

            {/* mobile nav */}
            <div className="xl:hidden">
                <MobileNav/> 
            </div>
        </div>
    </header>;    
};

export default Header