import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="flex w-full items-center justify-center">
      <SignUp />
    </div> 
  )
}