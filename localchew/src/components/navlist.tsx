import { type NavBlockListType } from "../interfaces/nav.type";
import { NavBlock } from "./navblock";
export function NavList(navlist: NavBlockListType) {
  return (
    <div className="flex flex-col gap-2">
      {navlist.items.map((item) => (
        <NavBlock
          icon={item.icon}
          title={item.title}
          nofitication={item.nofitication}
        ></NavBlock>
      ))}
    </div>
  );
}
