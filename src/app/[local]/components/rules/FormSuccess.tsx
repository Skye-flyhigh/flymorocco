import { BadgeCheck } from "lucide-react"

export default function FormSuccess({ formStatus, message }: { formStatus: boolean, message: string }) {
    if(formStatus) {
          return(

            <div
              role="alert"
              className="alert alert-success  self-center m-5 w-fit"
            >
              <BadgeCheck />
              {message}
            </div>
          )

    }
}