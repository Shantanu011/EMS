import { Link } from "react-router-dom";

export default function DashSideItem({ title, logo }) {
  function handleSidebarClick() {
    console.log(title);
  }

  return (
    <>
      <li id={`options-${title}`} className="custom-item mb-2">
        <span className="custom-logo">{logo}</span>
        <Link
          to={title.toLowerCase()}
          onClick={handleSidebarClick}
          className="custom-link"
        >
          {title}
        </Link>
      </li>
    </>
  );
}
