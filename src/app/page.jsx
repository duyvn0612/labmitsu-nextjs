import Link from "next/link";
export default function Homepage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <button color="success" className="text-white p-8">
        <Link href={"/traffic"}>Go to Traffic</Link>
      </button>
    </div>
  );
}
