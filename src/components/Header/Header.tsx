import { Link } from "react-router-dom";

import "./Header.scss";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="header-banner">
      <Link className="header-banner_title" to="/">
        {title}
      </Link>
    </div>
  );
};

export default Header;
