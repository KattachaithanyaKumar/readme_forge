const Footer = () => {
  return (
    <div className="p-4 border-t border-(--white-10) ">
      <div className="max-w-[1000px] mx-auto flex items-center justify-between">
        <p className="text-[14px] text-(--text-light)  ">
          Made with ❤️ by Developers for Developers.
        </p>
        <a
          target="_blank"
          href="https://github.com/KattachaithanyaKumar"
          className="text-[14px] text-(--text-light)"
        >
          Github
        </a>
      </div>
    </div>
  );
};

export default Footer;
