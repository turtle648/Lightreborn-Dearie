interface ColorBoxProps {
  color: string;
  scoreText: string;
  title: string;
  bgColor?: string;
}

export const ColorBox = ({ color, scoreText, title, bgColor }: ColorBoxProps) => {

  return (
    <div className={`bg-${bgColor}-100 rounded-md p-6 text-center`}>
      <div className="text-4xl font-bold mb-2" style={{ color }}>
        {scoreText}
      </div>
      <div className="text-lg">{title}</div>
    </div>
  );
};
