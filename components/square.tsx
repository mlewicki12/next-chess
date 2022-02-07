
type Square = {
  dark?: boolean;
};

const Square = ({
  dark
}: Square) => {
  return (
    // kinda hacky, but it works
    <div className={`${dark ? 'bg-primary even:bg-secondary' : 'bg-secondary even:bg-primary'}
      w-24 h-24`}>
        
    </div>
  );
}

export default Square;