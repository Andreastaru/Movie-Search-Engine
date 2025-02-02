import { useContext } from "react";
import SearchContext from "../context/SearchContext";
import { FaLinkedin } from "react-icons/fa";
import { openInNewTab } from "../utils/openInNewTab";
import { TMDB, LINKEDIN } from "../constants/constants";

const Footer = () => {
  const { type } = useContext(SearchContext);
  return (
    <footer className="footer text-center">
      <p>
        Had Fun during weekend. Search Engine for {type} Made by Andreas.
        Backend API&apos;s are from{" "}
        <a target="_blank" href={TMDB} className="clickable">
          TMDB
        </a>
      </p>
      <FaLinkedin
        className="clickable"
        onClick={() => openInNewTab(LINKEDIN)}
        size={"24"}
      />
    </footer>
  );
};

export default Footer;
