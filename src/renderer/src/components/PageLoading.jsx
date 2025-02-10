import { ClipLoader } from "react-spinners";

export default function PageLoading({loading}) {
  return <div className="h-screen w-full flex items-center justify-center"><ClipLoader color='blue' loading={loading} size={50} /></div>
}
