import Link from "next/link";
import { menuItems } from "@/lib/MenuItems";

export default function Menu({ toggleTitle }) {
  return (
    <div className="mt-5">
      <ul>
        {menuItems.map(({ title, href, icon }, index) => (
          <Link key={index} href={href}>
            <li className="flex items-center text-lg gap-4 mt-2 p-3 rounded-md bg-slate-100 hover:bg-slate-200">
              <span className="block">{icon}</span>
              <span
                className={`transition-all duration-300 ease-in-out  ${
                  toggleTitle ? "opacity-100" : "opacity-0"
                }`}
              >
                {title}
              </span>
              {/* {toggleTitle ? <span>{title}</span> : null} */}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
