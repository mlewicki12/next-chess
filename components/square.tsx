
import ChessPiece from 'react-chess-pieces';

type Square = {
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
  dark, piece
}: Square) => {
  return (
    // kinda hacky, but it works
    <div className={`${dark ? 'bg-primary even:bg-secondary' : 'bg-secondary even:bg-primary'}
      w-24 h-24`}>
      {piece && <ChessPiece piece={piece} />}
    </div>
  );
}

export default Square;