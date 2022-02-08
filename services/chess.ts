
export enum Piece {
  EMPTY = '',

  WHITE_PAWN = 'P',
  WHITE_PAWN_EN_PASSANT = 'Pp',
  WHITE_ROOK = 'R',
  WHITE_KNIGHT = 'N',
  WHITE_BISHOP = 'B',
  WHITE_QUEEN = 'Q',
  WHITE_KING = 'K',
  
  BLACK_PAWN = 'p',
  BLACK_PAWN_EN_PASSANT = 'pp',
  BLACK_ROOK = 'r',
  BLACK_KNIGHT = 'n',
  BLACK_BISHOP = 'b',
  BLACK_QUEEN = 'q',
  BLACK_KING = 'k',
}

export type Board = Piece[];

const isOnLeftEdge = (position: number) => position % 8 === 0;
const isOnRightEdge = (position: number) => position % 8 === 7;

const isOnFirstRow = (position: number) => position >= 56 && position < 64;
const isOnLastRow = (position: number) => position < 8;

const isPawn = (piece: Piece) => piece === Piece.WHITE_PAWN || piece === Piece.BLACK_PAWN;
const enPassant = (piece: Piece) => piece === Piece.WHITE_PAWN ? Piece.WHITE_PAWN_EN_PASSANT : Piece.BLACK_PAWN_EN_PASSANT;
const isEnPassant = (piece: Piece) => piece === Piece.WHITE_PAWN_EN_PASSANT || piece === Piece.BLACK_PAWN_EN_PASSANT;

const WhitePieces = [ Piece.WHITE_PAWN, Piece.WHITE_PAWN_EN_PASSANT, Piece.WHITE_ROOK,
  Piece.WHITE_KNIGHT, Piece.WHITE_BISHOP, Piece.WHITE_QUEEN, Piece.WHITE_KING ];

const BlackPieces = [ Piece.BLACK_PAWN, Piece.BLACK_PAWN_EN_PASSANT, Piece.BLACK_ROOK,
  Piece.BLACK_KNIGHT, Piece.BLACK_BISHOP, Piece.BLACK_QUEEN, Piece.BLACK_KING ];

const isWhite = (piece: Piece) => WhitePieces.includes(piece);
const isBlack = (piece: Piece) => BlackPieces.includes(piece);

const areSameColor = (piece: Piece, other: Piece) => 
  (WhitePieces.includes(piece) && WhitePieces.includes(other)) ||
  (BlackPieces.includes(piece) && BlackPieces.includes(other));

const pawnHasntMoved = (position: number, black: boolean) => black
  ? position >= 8 && position < 16
  : position >= 48 && position < 56;

export const ProcessMove = (board: Board, position: number, intended: number) => {
  if(position < 0 || position >= 64 ||
      intended < 0 || intended >= 64) {
    // don't process the move, somehow alert the user it's a bad move
    return board;
  }

  // TODO: needs a check for legal move
  const newBoard = board.slice();
  const piece = newBoard[position];

  console.log(newBoard[intended]);
  if(newBoard[intended] !== Piece.EMPTY) {
    if(isEnPassant(newBoard[intended])) {
      // if the piece is en passant, we need to kill the pawn above it
      if(isWhite(newBoard[intended])) {
        newBoard[intended - 8] = Piece.EMPTY;
      } else {
        newBoard[intended + 8] = Piece.EMPTY;
      }
    }
  }

  newBoard[intended] = piece;
  newBoard[position] = Piece.EMPTY;

  // clear out leftover en passant pieces
  newBoard.forEach((item, index) => {
    if(isEnPassant(item)) newBoard[index] = Piece.EMPTY;
  });

  // add in new en passant piece if necessary
  if(isPawn(piece) && Math.abs(position - intended) === 16) {
    if(isWhite(piece)) {
      newBoard[position - 8] = enPassant(piece);
    } else {
      newBoard[position + 8] = enPassant(piece);;
    }
  }

  return newBoard;
}

export const GetLegalMoves = (board: Board, position: number) => {
  const piece = board[position];
  const moves: number[] = [];

  switch(piece) {
    case Piece.WHITE_PAWN:
      if(isOnLastRow(position)) return moves; // shouldn't be possible once upgrading pawns becomes a thing
      if(!isOnLeftEdge(position) && board[position - 9] !== Piece.EMPTY && !areSameColor(board[position], board[position - 9])) moves.push(position - 9);
      if(!isOnRightEdge(position) && board[position - 7] !== Piece.EMPTY && !areSameColor(board[position], board[position - 7])) moves.push(position - 7);
      if(pawnHasntMoved(position, false) && board[position - 16] === Piece.EMPTY) moves.push(position - 16);
      if(board[position - 8] === Piece.EMPTY) moves.push(position - 8);

      return moves;

    case Piece.BLACK_PAWN:
      if(isOnFirstRow(position)) return moves; // same deal as above
      if(!isOnLeftEdge(position) && board[position + 7] !== Piece.EMPTY && !areSameColor(board[position], board[position + 7])) moves.push(position + 7);
      if(!isOnRightEdge(position) && board[position + 9] !== Piece.EMPTY && !areSameColor(board[position], board[position + 9])) moves.push(position + 9);
      if(pawnHasntMoved(position, true) && board[position + 16] === Piece.EMPTY) moves.push(position + 16);
      if(board[position + 8] === Piece.EMPTY) moves.push(position + 8);

      return moves;

    default:
      console.error('unimplemented GetLegalMoves piece');
      return [];
  }
};