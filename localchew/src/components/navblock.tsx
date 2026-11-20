import { type NavBlockType } from "../interfaces/nav.type";
export function NavBlock(el: NavBlockType) {
  return (
    <div className="flex flex-row gap-1 cursor-pointer">
      <img src={el.icon} alt="" />
      <div>{el.title}</div>
      <div>{el.nofitication}</div>
    </div>
  );
}
