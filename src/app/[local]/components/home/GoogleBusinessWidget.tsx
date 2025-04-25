"use client"
import { useEffect } from "react"

export default function GoogleBusinessWidget() {
useEffect(() => {
    const script = document.createElement("script");
    script.src = "//apps.elfsight.com/p/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
        //Optional: Clean up on unmount if needed
        document.body.removeChild(script);
    };
}, [])
    return (
        <article className="w-screen p-10">

       <div className="elfsight-app-0fdbf0ba-1c02-4baa-968f-9ae0e8228219"
       style={{marginTop: "30px"}} 
       >
        Google
        </div>
           </article>
    )
}