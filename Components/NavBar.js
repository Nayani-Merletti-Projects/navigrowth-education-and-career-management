import Link from "next/link";
import styles from "../src/app/Styles/NavBar.module.css";
import {
  HomeIcon,
  AcademicCapIcon,
  FlagIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/", Icon: HomeIcon, text: "Home" },
  { href: "/skills", Icon: AcademicCapIcon, text: "Skills" },
  { href: "/goals", Icon: FlagIcon, text: "Goals" },
  { href: "paths", Icon: MapIcon, text: "Paths/Opportunities" },
  { href: "/chat", Icon: ChatBubbleLeftRightIcon, text: "Chat" },
  { href: "/account", Icon: UserCircleIcon, text: "Account" },
];

export function NavBar() {
  return (
    <>
      <input
        type="checkbox"
        id="nav-toggle"
        className={styles.navToggle}
        hidden
      />
      <label htmlFor="nav-toggle" className={styles.navToggleLabel}>
        <Bars3Icon className={styles.menuIcon} />
      </label>

      <nav className={styles.navbar}>
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <Link href={item.href} key={item.href}>
              <div className={styles.navbarLinksContainers}>
                <IconComponent className={styles.navbarIcons} />
                <span>{item.text}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={styles.navOverlay}></div>
    </>
  );
}