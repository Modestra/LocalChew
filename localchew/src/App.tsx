import { useEffect, useMemo, useState } from "react";

type Tab = "home" | "fridge" | "recipes" | "cart";
type Ingredient = {
  name: string;
  emoji: string;
  amount: string;
  expiry: number;
};
type Recipe = {
  title: string;
  emoji: string;
  description: string;
  time: number;
  match: number;
  missing: string[];
  color: string;
};

const initial: Ingredient[] = [
  { name: "Яйца", emoji: "🥚", amount: "6 шт.", expiry: 3 },
  { name: "Томаты", emoji: "🍅", amount: "4 шт.", expiry: 2 },
  { name: "Авокадо", emoji: "🥑", amount: "2 шт.", expiry: 4 },
  { name: "Шпинат", emoji: "🌿", amount: "120 г", expiry: 1 },
  { name: "Сыр", emoji: "🧀", amount: "180 г", expiry: 8 },
  { name: "Молоко", emoji: "🥛", amount: "700 мл", expiry: 5 },
];
const recipes: Recipe[] = [
  {
    title: "Зелёная шакшука",
    emoji: "🍳",
    description: "Яйца со шпинатом, томатами и нежным сыром",
    time: 22,
    match: 92,
    missing: ["Чеснок"],
    color: "#d8e9c9",
  },
  {
    title: "Тост с авокадо",
    emoji: "🥑",
    description: "Хрустящий хлеб, авокадо и яйцо пашот",
    time: 15,
    match: 80,
    missing: ["Хлеб", "Лимон"],
    color: "#efdfa0",
  },
  {
    title: "Сливочная фриттата",
    emoji: "🥘",
    description: "Воздушный завтрак с томатами и сыром",
    time: 30,
    match: 100,
    missing: [],
    color: "#efc6aa",
  },
];
const quick = [
  ["Огурцы", "🥒"],
  ["Йогурт", "🥣"],
  ["Хлеб", "🍞"],
  ["Лимон", "🍋"],
  ["Курица", "🍗"],
  ["Морковь", "🥕"],
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    fridge: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M5 9h14M9 5v1M9 12v2" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
        <path d="M3 4h2l2.5 12h12L21 8H6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 10 6c6-3 11-2 11-2s1 5-2 11a7 7 0 0 1-8 5Z" />
        <path d="M4 21c3-6 8-10 14-13" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    wifi: (
      <>
        <path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0" />
        <circle cx="12" cy="20" r=".6" fill="currentColor" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

const read = <T,>(key: string, value: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "");
  } catch {
    return value;
  }
};

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [food, setFood] = useState<Ingredient[]>(() =>
    read("hlad.food", initial),
  );
  const [shopping, setShopping] = useState<string[]>(() =>
    read("hlad.shopping", ["Оливковое масло"]),
  );
  const [checked, setChecked] = useState<string[]>(() =>
    read("hlad.checked", []),
  );
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [add, setAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(
    () => localStorage.setItem("hlad.food", JSON.stringify(food)),
    [food],
  );
  useEffect(
    () => localStorage.setItem("hlad.shopping", JSON.stringify(shopping)),
    [shopping],
  );
  useEffect(
    () => localStorage.setItem("hlad.checked", JSON.stringify(checked)),
    [checked],
  );
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    addEventListener("online", sync);
    addEventListener("offline", sync);
    return () => {
      removeEventListener("online", sync);
      removeEventListener("offline", sync);
    };
  }, []);
  const filtered = useMemo(
    () =>
      food.filter((x) => x.name.toLowerCase().includes(search.toLowerCase())),
    [food, search],
  );
  const addFood = () => {
    if (!name.trim()) return;
    setFood((x) => [
      ...x,
      {
        name: name.trim(),
        amount: amount.trim() || "1 шт.",
        emoji: "🥬",
        expiry: 7,
      },
    ]);
    setName("");
    setAmount("");
    setAdd(false);
  };
  const addMissing = (items: string[]) =>
    setShopping((x) => [...new Set([...x, ...items])]);

  return (
    <div className="shell">
      <aside>
        <Brand onClick={() => setTab("home")} />
        <nav>
          <Nav
            icon="home"
            text="Сегодня"
            active={tab === "home"}
            onClick={() => setTab("home")}
          />
          <Nav
            icon="fridge"
            text="Мой холодильник"
            active={tab === "fridge"}
            count={food.length}
            onClick={() => setTab("fridge")}
          />
          <Nav
            icon="book"
            text="Рецепты"
            active={tab === "recipes"}
            onClick={() => setTab("recipes")}
          />
          <Nav
            icon="cart"
            text="Список покупок"
            active={tab === "cart"}
            count={shopping.length}
            onClick={() => setTab("cart")}
          />
        </nav>
        <div className="offline">
          <Icon name="wifi" />
          <div>
            <b>{online ? "Данные сохранены" : "Вы офлайн"}</b>
            <small>Всё доступно без сети</small>
          </div>
        </div>
      </aside>
      <main>
        <header className="mobile-head">
          <Brand onClick={() => setTab("home")} />
          <span>● ОФЛАЙН</span>
        </header>
        {tab === "home" && (
          <div className="page home">
            <section className="hero">
              <div className="hero-copy">
                <Kicker>✦ УМНЫЙ ПОМОЩНИК</Kicker>
                <h1>
                  Доброе утро.
                  <br />
                  Что приготовим?
                </h1>
                <p>
                  В холодильнике достаточно продуктов для{" "}
                  <b>трёх отличных блюд</b>.
                </p>
                <button className="primary" onClick={() => setTab("recipes")}>
                  Подобрать рецепт <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="hero-photo">
                <img
                  src="/images/fresh-ingredients.jpg"
                  alt="Свежие продукты"
                />
                <div>
                  <b>{food.length}</b>
                  <span>
                    продуктов
                    <br />в наличии
                  </span>
                </div>
              </div>
            </section>
            <section className="section">
              <div className="section-title">
                <div>
                  <Kicker>НА ОСНОВЕ ВАШИХ ПРОДУКТОВ</Kicker>
                  <h2>Можно приготовить прямо сейчас</h2>
                </div>
                <button onClick={() => setTab("recipes")}>
                  Все рецепты <Icon name="arrow" size={16} />
                </button>
              </div>
              <div className="recipe-grid">
                {recipes.map((x) => (
                  <RecipeCard
                    key={x.title}
                    item={x}
                    onClick={() => setRecipe(x)}
                  />
                ))}
              </div>
            </section>
            <section className="expiring">
              <div>
                <Kicker>СКОРО ИСПОРТЯТСЯ</Kicker>
                <h2>Используйте в первую очередь</h2>
              </div>
              <div className="expiry-row">
                {food
                  .filter((x) => x.expiry <= 3)
                  .map((x) => (
                    <button key={x.name} onClick={() => setTab("fridge")}>
                      <span>{x.emoji}</span>
                      <b>{x.name}</b>
                      <small>осталось {x.expiry} дн.</small>
                    </button>
                  ))}
              </div>
            </section>
          </div>
        )}
        {tab === "fridge" && (
          <div className="page">
            <Title
              kicker="ЛОКАЛЬНОЕ ХРАНЕНИЕ"
              title="Мой холодильник"
              desc="Добавляйте продукты — они останутся на этом устройстве даже без интернета."
            >
              <button className="primary" onClick={() => setAdd(true)}>
                <Icon name="plus" size={18} /> Добавить продукт
              </button>
            </Title>
            <div className="toolbar">
              <input
                placeholder="Найти продукт..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span>{food.length} продуктов</span>
            </div>
            <div className="food-grid">
              {filtered.map((x) => (
                <article key={x.name}>
                  <span>{x.emoji}</span>
                  <div>
                    <h3>{x.name}</h3>
                    <p>{x.amount}</p>
                    <small className={x.expiry <= 1 ? "urgent" : ""}>
                      Свежесть: {x.expiry} дн.
                    </small>
                  </div>
                  <button
                    onClick={() =>
                      setFood((all) => all.filter((i) => i.name !== x.name))
                    }
                    aria-label={"Удалить " + x.name}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </article>
              ))}
            </div>
            <section className="quick">
              <h2>Быстро добавить</h2>
              <div>
                {quick
                  .filter((x) => !food.some((f) => f.name === x[0]))
                  .map((x) => (
                    <button
                      key={x[0]}
                      onClick={() =>
                        setFood((all) => [
                          ...all,
                          {
                            name: x[0],
                            emoji: x[1],
                            amount: "1 шт.",
                            expiry: 7,
                          },
                        ])
                      }
                    >
                      <span>{x[1]}</span>
                      {x[0]}
                      <Icon name="plus" size={15} />
                    </button>
                  ))}
              </div>
            </section>
          </div>
        )}
        {tab === "recipes" && (
          <div className="page">
            <Title
              kicker="ПОДБОРКА ДЛЯ ВАС"
              title="Рецепты из того, что есть"
              desc="Чем выше совпадение, тем меньше продуктов понадобится докупить."
            />
            <div className="recipe-list">
              {recipes.map((x) => (
                <article key={x.title} onClick={() => setRecipe(x)}>
                  <div className="art" style={{ background: x.color }}>
                    <span>{x.emoji}</span>
                    <b>{x.match}%</b>
                  </div>
                  <div>
                    <Kicker>
                      {x.missing.length
                        ? "НЕ ХВАТАЕТ: " + x.missing.join(", ")
                        : "ВСЁ ЕСТЬ"}
                    </Kicker>
                    <h2>{x.title}</h2>
                    <p>{x.description}</p>
                    <small>
                      <Icon name="clock" size={15} />
                      {x.time} мин · 2 порции
                    </small>
                  </div>
                  <button>
                    <Icon name="arrow" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === "cart" && (
          <div className="page">
            <Title
              kicker="АВТОМАТИЧЕСКИЙ СПИСОК"
              title="Покупки"
              desc="Недостающие ингредиенты можно добавить из любого рецепта."
            >
              {shopping.length > 0 && (
                <button
                  className="secondary"
                  onClick={() => {
                    setShopping([]);
                    setChecked([]);
                  }}
                >
                  Очистить список
                </button>
              )}
            </Title>
            <div className="shopping-layout">
              <section className="shopping">
                {shopping.length === 0 ? (
                  <div className="empty">
                    <span>
                      <Icon name="check" size={30} />
                    </span>
                    <h2>Всё куплено</h2>
                    <p>Добавьте недостающие продукты из рецепта.</p>
                    <button
                      className="primary"
                      onClick={() => setTab("recipes")}
                    >
                      Посмотреть рецепты
                    </button>
                  </div>
                ) : (
                  shopping.map((x) => (
                    <label
                      className={checked.includes(x) ? "done" : ""}
                      key={x}
                    >
                      <input
                        type="checkbox"
                        checked={checked.includes(x)}
                        onChange={() =>
                          setChecked((a) =>
                            a.includes(x)
                              ? a.filter((i) => i !== x)
                              : [...a, x],
                          )
                        }
                      />
                      <i>
                        <Icon name="check" size={15} />
                      </i>
                      <b>{x}</b>
                      <small>1 шт.</small>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShopping((a) => a.filter((i) => i !== x));
                        }}
                      >
                        <Icon name="x" size={17} />
                      </button>
                    </label>
                  ))
                )}
              </section>
              <section className="summary">
                <Kicker>ПРОГРЕСС</Kicker>
                <div
                  style={
                    {
                      "--p": `${shopping.length ? (checked.length / shopping.length) * 100 : 100}%`,
                    } as React.CSSProperties
                  }
                >
                  <b>
                    {checked.length}/{shopping.length}
                  </b>
                  <span>куплено</span>
                </div>
                <p>Список хранится только на вашем устройстве.</p>
              </section>
            </div>
          </div>
        )}
      </main>
      <nav className="bottom">
        <Nav
          icon="home"
          text="Сегодня"
          active={tab === "home"}
          onClick={() => setTab("home")}
        />
        <Nav
          icon="fridge"
          text="Холодильник"
          active={tab === "fridge"}
          onClick={() => setTab("fridge")}
        />
        <Nav
          icon="book"
          text="Рецепты"
          active={tab === "recipes"}
          onClick={() => setTab("recipes")}
        />
        <Nav
          icon="cart"
          text="Покупки"
          active={tab === "cart"}
          onClick={() => setTab("cart")}
        />
      </nav>
      {add && (
        <div className="backdrop" onMouseDown={() => setAdd(false)}>
          <div
            className="modal add-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setAdd(false)}>
              <Icon name="x" />
            </button>
            <Kicker>НОВЫЙ ПРОДУКТ</Kicker>
            <h2>Что добавим?</h2>
            <label>
              Название
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, базилик"
              />
            </label>
            <label>
              Количество
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Например, 100 г"
              />
            </label>
            <button className="primary wide" onClick={addFood}>
              Добавить в холодильник
            </button>
          </div>
        </div>
      )}
      {recipe && (
        <div className="backdrop" onMouseDown={() => setRecipe(null)}>
          <div
            className="modal recipe-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setRecipe(null)}>
              <Icon name="x" />
            </button>
            <div className="modal-art" style={{ background: recipe.color }}>
              {recipe.emoji}
            </div>
            <div className="modal-body">
              <Kicker>СОВПАДЕНИЕ {recipe.match}%</Kicker>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              <h3>Ингредиенты</h3>
              <ul>
                {["Яйца", "Томаты", "Шпинат", "Сыр", ...recipe.missing]
                  .filter((x, i, a) => a.indexOf(x) === i)
                  .map((x) => (
                    <li key={x}>
                      <i className={recipe.missing.includes(x) ? "" : "have"}>
                        <Icon
                          name={recipe.missing.includes(x) ? "plus" : "check"}
                          size={14}
                        />
                      </i>
                      {x}
                      <small>
                        {recipe.missing.includes(x)
                          ? "нужно купить"
                          : "есть дома"}
                      </small>
                    </li>
                  ))}
              </ul>
              {recipe.missing.length ? (
                <button
                  className="primary wide"
                  onClick={() => {
                    addMissing(recipe.missing);
                    setRecipe(null);
                    setTab("cart");
                  }}
                >
                  <Icon name="cart" size={17} /> Добавить недостающее
                </button>
              ) : (
                <button
                  className="primary wide"
                  onClick={() => setRecipe(null)}
                >
                  <Icon name="check" /> Можно готовить
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick}>
      <i>
        <Icon name="leaf" size={22} />
      </i>
      ХЛАД
    </button>
  );
}
function Nav({
  icon,
  text,
  active,
  count,
  onClick,
}: {
  icon: string;
  text: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button className={"nav " + (active ? "active" : "")} onClick={onClick}>
      <Icon name={icon} />
      <span>{text}</span>
      {count ? <b>{count}</b> : null}
    </button>
  );
}
function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="kicker">{children}</span>;
}
function RecipeCard({ item, onClick }: { item: Recipe; onClick: () => void }) {
  return (
    <button className="recipe-card" onClick={onClick}>
      <div className="card-art" style={{ background: item.color }}>
        <span>{item.emoji}</span>
        <b>{item.match}% совпадение</b>
      </div>
      <div className="card-copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <small>
          <Icon name="clock" size={15} />
          {item.time} мин · 2 порции
        </small>
      </div>
    </button>
  );
}
function Title({
  kicker,
  title,
  desc,
  children,
}: {
  kicker: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="title">
      <div>
        <Kicker>{kicker}</Kicker>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children}
    </header>
  );
}
