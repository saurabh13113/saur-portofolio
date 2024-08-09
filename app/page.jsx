import Photo from "@/components/Photo";
import Social from "@/components/Social";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import {FiDownload} from "react-icons/fi";



const Home = () => {
  return (
    <section className="h-full">
    <div className="container mx-auto h-full"> 
       <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
        {/* text */}
        <div className="text-center xl:text-left order-2 xl:order-none">
        <span className="text-xl"> Software Developer </span>
        <h1 className="h1">
          Hello my name is <br /> <span className="text-accent">Saurabh Nair</span> 
           </h1>
           <p className="max-w-[500px] mb-9 text-white/80"> A passionate software developer from Abu Dhabi 🇦🇪, and a student at the University of Toronto. </p>
        <div className="flex flex-col xl:flex-row items-center gap-8">
          <a href="/assets/resume.pdf" download="resume.pdf">
            <Button variant="outline" size="lg" className="uppercase flex items-center gap-2">
              <span> Here is my Resume! </span>
              <FiDownload className="text-xl" />
            </Button>
          </a>
          <div className="mb-8 xl:mb-0">
            <Social containerStyles="flex gap-6" iconStyles="w-9 h-9 border border-accent rounded-full
            flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary 
            hover:transition-all duration-500" />
          </div>
        </div>
      </div>
        {/* photo */}
        <div className="order-1 xl:order-none mb-8 xl:mb-0">
          <Photo />
        </div>
      </div>
    </div>
    <Stats />
    </section>
  )
}


export default Home
