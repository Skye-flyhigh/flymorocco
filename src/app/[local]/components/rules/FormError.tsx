import { CircleX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormError({ formError }: { formError: string | null}) {
    const [modal, setModal] = useState<boolean>(false)

    useEffect(() => {
        if(formError) setModal(true)
    }, [formError])

        return (
            <AnimatePresence>
                { modal && 
                <motion.section initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} className="bg-base-300/75 flex justify-center items-center z-50 fixed inset-0" onClick={() => setModal(false)}>
                <motion.div role="alert" aria-live="assertive" 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className="alert alert-error">
            <CircleX />
            {formError}
            <button 
            type="button"  
            aria-label="Close success message" 
            onClick={() => setModal(false)} 
            className="rounded-full p-1 btn btn-ghost"
            ><X size={20} /></button> 

          </motion.div>
            </motion.section>
                }
            </AnimatePresence>
            
            
        )
}