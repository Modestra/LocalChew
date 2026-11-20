import "./App.css";
import { NavList } from "./components/navlist";
import { NavBlockListType } from "./interfaces/nav.type";

const siteList: NavBlockListType = {
  items: [
    { icon: "", title: "Сегодня" },
    { icon: "", title: "Мой холодильник" },
    { icon: "", title: "Рецепты" },
    { icon: "", title: "Список покупок" },
  ],
};

function App() {
  return (
    <div className="w-full main-block">
      <div className="bg-green-900 p-4">
        <div className="flex flex-row h-8">
          <image className="size-8"></image>
          <p className="capitalize text-white text-1xl">Локальный шеф</p>
        </div>
        <div>
          <NavList items={siteList.items}></NavList>
        </div>
      </div>
      <div className="p-16">Текст</div>
    </div>
  );
}

export default App;
