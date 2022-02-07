
import ChessPiece from 'react-chess-pieces';

type Square = {
  index: number;
  selected: boolean;
  setSelected: (id: number) => void;

  dark?: boolean;
  piece?: Piece;
};

export enum Piece {
  EMPTY = '',

  WHITE_PAWN = 'P',
  WHITE_ROOK = 'R',
  WHITE_KNIGHT = 'N',
  WHITE_BISHOP = 'B',
  WHITE_QUEEN = 'Q',
  WHITE_KING = 'K',
  
  BLACK_PAWN = 'p',
  BLACK_ROOK = 'r',
  BLACK_KNIGHT = 'n',
  BLACK_BISHOP = 'b',
  BLACK_QUEEN = 'q',
  BLACK_KING = 'k',
}

const Square = ({
  index, setSelected, dark, selected, piece
}: Square) => {
  return (
    // kinda hacky, but it works
    <div onClick={() => piece && (selected ? setSelected(-1) : setSelected(index))}
      className={`${dark ? 'bg-primary' : 'bg-secondary'}
      ${selected ? 'scale-125 z-50 shadow-xl' : 'scale-100'}
      w-24 h-24`}>
      {piece && <ChessPiece piece={piece} />}
    </div>
  );
}

export default Square;