import Image from "next/image";

const Logo = () => {
  return (
    <div className="ml-1">
      <Image
        width="25"
        height="25"
        src="https://img.icons8.com/ios-filled/50/v-symbol.png"
        alt="v-symbol"
        style={{ filter: "invert(1)" }}
      />
    </div>
  );
};

export default Logo;
