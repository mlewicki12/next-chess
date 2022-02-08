
import ChessPiece from 'react-chess-pieces';
import { Piece, SanitisePiece } from '../services/chess';

type Square = {
  index: number;
  legal: boolean;
  selected: number;
  setSelected: (id: number) => void;
  onMove: (position: number, intended: number) => void;

  dark?: boolean;
  piece?: Piece;
};

const Square = ({
  index, legal, setSelected, onMove,
  dark, selected, piece
}: Square) => {
  return (
    <div onClick={() => {
      if(legal) {
        onMove(selected, index);
        setSelected(-1);
      } else {
        piece && (selected === index ? setSelected(-1) : setSelected(index));
      }
    }}
      className={`${dark ? 'bg-primary' : 'bg-secondary'}
      ${selected === index ? 'scale-110 z-50 shadow-xl' : 'scale-100'}
      transition duration-150 relative w-24 h-24`}>
      {legal && 
        <div className='absolute top-0 left-0'>
          <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
            <circle cx='48' cy='48' r='25' stroke='black' strokeWidth='4' fill='none' />
          </svg>
        </div>
      }
      {piece && <ChessPiece piece={SanitisePiece(piece)} />}
    </div>
  );
}

export default Square;