
import ChessPiece from 'react-chess-pieces';
import { Piece, SanitisePiece } from '../services/chess';

type Square = {
  index: number;
  legal: boolean;
  selected: number;
  setSelected: (id: number) => void;
  canSelect: (piece: Piece) => boolean;
  onMove: (position: number, intended: number) => void;

  dark?: boolean;
  piece?: Piece;
};

const Square = ({
  index, legal, setSelected, canSelect,
  onMove, dark, selected, piece
}: Square) => {
  return (
    <div onClick={() => {
      if(legal) {
        onMove(selected, index);
        setSelected(-1);
      } else {
        piece && canSelect(piece) &&
          (selected === index ? setSelected(-1) : setSelected(index));
      }
    }}
      className={`${dark ? 'bg-primary' : 'bg-secondary'}
      ${selected === index ? 'scale-110 z-50 shadow-2xl' : 'scale-100'}
      transition duration-150 relative w-24 h-24`}>
      {legal && 
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
          <div className='w-12 h-12 opacity-75 rounded-full bg-rose-600 shadow-2xl' />
        </div>
      }
      {piece && <ChessPiece piece={SanitisePiece(piece)} />}
    </div>
  );
}

export default Square;