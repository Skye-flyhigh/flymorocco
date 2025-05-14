import { CircleX } from "lucide-react";

export default function FormError({ formError }: { formError: string | null}) {
    if(formError){
        return (
            <div role="alert" className="alert alert-error">
            <CircleX />
            {formError}
          </div>
        )
    }
    return null
}