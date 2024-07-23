import { motion } from "framer-motion";


// variants
const stairAnimation = {
    initial : {
        top: "0%",
    },
    animate :{
        top: "100%"
    },
    exit :{
        top: ["100%","0%"],
    },
};

// TO calculate reverse index
const reverseIndex = (index) => {
    const totalSteps = 6;
    return totalSteps - index - 1;
}

    
{ /* motion div time: we gonne have 6 motion div with each one having a stair animation, 
    delay calculated dynamically based on previous index, making a stair effect */ }
const Stairs = () => {
    return (
        <>
    {[...Array(6)].map((_, index) => {
        return ( 
        <motion.div key = {index} 
        variants={stairAnimation} 
        initial="initial" 
        animate= "animate" 
        exit="exit" 
        transition={{
            duration: 0.4, 
            ease: 'easeInOut',
            delay: reverseIndex(index) * 0.1,
            }} 
            className="h-full w-full bg-black relative"    
        />
        );
        })}    
        </>
    );
};

export default Stairs;