
export enum Piece {
  EMPTY = '',

  WHITE_PAWN = 'P',
  WHITE_PAWN_EN_PASSANT = 'Pp',
  WHITE_ROOK = 'R',
  WHITE_KNIGHT = 'N',
  WHITE_BISHOP = 'B',
  WHITE_QUEEN = 'Q',
  WHITE_KING = 'K',

  WHITE_KING_CASTLE = 'KC',
  WHITE_ROOK_CASTLE = 'RC',
  
  BLACK_PAWN = 'p',
  BLACK_PAWN_EN_PASSANT = 'pp',
  BLACK_ROOK = 'r',
  BLACK_KNIGHT = 'n',
  BLACK_BISHOP = 'b',
  BLACK_QUEEN = 'q',
  BLACK_KING = 'k',

  BLACK_KING_CASTLE = 'kc',
  BLACK_ROOK_CASTLE = 'rc'
}

// mb a lil misnomer, but this will make sure we can display special pieces
export const SanitisePiece = (piece: Piece) =>
  piece === Piece.WHITE_KING_CASTLE
  ? Piece.WHITE_KING
  : piece === Piece.WHITE_ROOK_CASTLE
    ? Piece.WHITE_ROOK
    : piece === Piece.BLACK_KING_CASTLE
      ? Piece.BLACK_KING
      : piece === Piece.BLACK_ROOK_CASTLE
        ? Piece.BLACK_ROOK
        : piece;

export type Board = Piece[];

const isInBounds = (position: number) => position >= 0 && position < 64;

const isOnLeftEdge = (position: number) => position % 8 === 0;
const isOnRightEdge = (position: number) => position % 8 === 7;

const isOnBottomRow = (position: number) => position >= 56 && position < 64;
const isOnTopRow = (position: number) => position < 8;

const areOnSameRow = (position: number, other: number) => Math.floor(position / 8) === Math.floor(other / 8);
const canTake = (piece: Piece, other: Piece) => !areSameColor(piece, other);

// for the sake of this function en passant counts as empty
const isEmpty = (piece: Piece) => piece === Piece.EMPTY || piece === Piece.WHITE_PAWN_EN_PASSANT || piece === Piece.BLACK_PAWN_EN_PASSANT;
const isPawn = (piece: Piece) => piece === Piece.WHITE_PAWN || piece === Piece.BLACK_PAWN;
const isKing = (piece: Piece) => piece === Piece.WHITE_KING || piece === Piece.WHITE_KING_CASTLE || piece === Piece.BLACK_KING || piece === Piece.BLACK_KING_CASTLE;
const enPassant = (piece: Piece) => piece === Piece.WHITE_PAWN ? Piece.WHITE_PAWN_EN_PASSANT : Piece.BLACK_PAWN_EN_PASSANT;
const isEnPassant = (piece: Piece) => piece === Piece.WHITE_PAWN_EN_PASSANT || piece === Piece.BLACK_PAWN_EN_PASSANT;

const canCastle = (board: Board, position: number) => {
  if(board[position] !== Piece.WHITE_KING_CASTLE && board[position] !== Piece.BLACK_KING_CASTLE) return {left: false, right: false};

  var pos = position - 1;
  var left = false, right = false;

  while(!isOnLeftEdge(pos)) {
    if(!isEmpty(board[pos])) break;
    if(isInCheck(board, pos, board[position])) break;
    
    pos -= 1;
  }

  // there is a very tiny edge case of if this ever supports custom defined boards
  // there is a chance for a white king to castle on a black rook or vice versa
  // bc this is colour agnostic, but it shouldn't be an issue in regular play bc these
  // never escape their starting positions
  if(board[pos] === Piece.WHITE_ROOK_CASTLE || board[pos] === Piece.BLACK_ROOK_CASTLE) left = true;

  pos = position + 1;
  while(!isOnRightEdge(pos)) {
    if(!isEmpty(board[pos])) break;
    if(isInCheck(board, pos, board[position])) break;

    pos += 1;
  }

  if(board[pos] === Piece.WHITE_ROOK_CASTLE || board[pos] === Piece.BLACK_ROOK_CASTLE) right = true;
  return {left: left, right: right};
}

const WhitePieces = [ Piece.WHITE_PAWN, Piece.WHITE_PAWN_EN_PASSANT, Piece.WHITE_ROOK, Piece.WHITE_ROOK_CASTLE,
  Piece.WHITE_KNIGHT, Piece.WHITE_BISHOP, Piece.WHITE_QUEEN, Piece.WHITE_KING, Piece.WHITE_KING_CASTLE ];

const BlackPieces = [ Piece.BLACK_PAWN, Piece.BLACK_PAWN_EN_PASSANT, Piece.BLACK_ROOK, Piece.BLACK_ROOK_CASTLE,
  Piece.BLACK_KNIGHT, Piece.BLACK_BISHOP, Piece.BLACK_QUEEN, Piece.BLACK_KING, Piece.BLACK_KING_CASTLE ];

export const isWhite = (piece: Piece) => WhitePieces.includes(piece);
export const isBlack = (piece: Piece) => BlackPieces.includes(piece);

const areSameColor = (piece: Piece, other: Piece) => 
  (WhitePieces.includes(piece) && WhitePieces.includes(other)) ||
  (BlackPieces.includes(piece) && BlackPieces.includes(other));

const pawnHasntMoved = (position: number, black: boolean) => black
  ? position >= 8 && position < 16
  : position >= 48 && position < 56;

const findKing = (board: Board, black?: boolean) => {
  const position = board.findIndex(piece => isKing(piece) && (black ? isBlack(piece) : isWhite(piece)));
  return position;
}

const findAllPieces = (board: Board, black?: boolean) => {
  const pieces = board.map(piece => black ? isBlack(piece) : isWhite(piece)).reduce((prev, next, index) => next ? [...prev, index] : prev, [] as number[]);
  return pieces;
}

const scan = (board: Board, position: number, mod: (position: number) => number, end: (position: number) => boolean, edge?: boolean) => {
  const moves: number[] = [];
  if(end(position)) return moves;

  var pos = mod(position);
  while(isInBounds(pos)) {
    if(!isEmpty(board[pos])) {
      if(!areSameColor(board[position], board[pos])) {
        moves.push(pos);
      }

      break;
    }

    if(!edge) moves.push(pos);

    if(end(pos)) break;
    pos = mod(pos);
  }

  return moves;
}

const isInCheck = (board: Board, position: number, piece?: Piece) => {
  const checks: number[] = [];
  piece = piece ?? board[position];

  // get all possible edge moves using a queen and knight as reference
  const possibleChecks = [
    ...GetLegalMoves(board, position, isWhite(piece) ? Piece.WHITE_QUEEN : Piece.BLACK_QUEEN, true, false, true),
    ...GetLegalMoves(board, position, isWhite(piece) ? Piece.WHITE_KNIGHT : Piece.BLACK_KNIGHT, true, false, true)
  ].reduce((prev, next) => prev.includes(next) ? prev : [...prev, next], [] as number[])

  possibleChecks.forEach(pos => {
    const moves = GetLegalMoves(board, pos, board[pos], false, false, true);
    if(moves.includes(position)) {
      checks.push(pos);
    }
  });

  return checks.length > 0;
}

export const IsCheckmate = (board: Board, black?: boolean) => {
  const king = findKing(board, black);
  const check = isInCheck(board, king);

  if(!check) return false;

  const moves = findAllPieces(board, black).map(piece => GetLegalMoves(board, piece, undefined, false, true))
    .reduce((prev, next) => [...prev, ...next], [] as number[]);

  return moves.length <= 0;
}

export const ProcessMove = (board: Board, position: number, intended: number) => {
  if(position < 0 || position >= 64 ||
      intended < 0 || intended >= 64) {
    // don't process the move, somehow alert the user it's a bad move
    return board;
  }

  // TODO: needs a check for legal move
  const newBoard = board.slice();
  const piece = newBoard[position];

  if(newBoard[intended] !== Piece.EMPTY) {
    if(isEnPassant(newBoard[intended]) && !areSameColor(newBoard[position], newBoard[intended])) {
      // if the piece is en passant, we need to kill the pawn above it
      if(isWhite(newBoard[intended])) {
        newBoard[intended - 8] = Piece.EMPTY;
      } else {
        newBoard[intended + 8] = Piece.EMPTY;
      }
    }
  }

  // this will dirty (heh get it) the piece if it moves
  newBoard[intended] = SanitisePiece(piece);
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
      newBoard[position + 8] = enPassant(piece);
    }
  }

  // no way a king should be able to move by 2 squares, except for castling
  if(isKing(piece) && Math.abs(position - intended) === 2) {
    const direction = Math.sign(intended - position); // left is negative
    var pos = position;
    while(!isOnLeftEdge(pos) && !isOnRightEdge(pos)) {
      pos += direction;
    }

    const rook = SanitisePiece(board[pos]);
    newBoard[pos] = Piece.EMPTY;
    newBoard[intended - direction] = rook;
  }

  return newBoard;
}

export const GetLegalMoves = (board: Board, position: number, piece?: Piece, edge?: boolean, includeChecks?: boolean, ignoreCastle?: boolean) => {
  // piece argument mainly used by the queen to combine rook and bishop moves
  piece = piece ?? board[position];
  var moves: number[] = [];

  switch(piece) {
    case Piece.WHITE_PAWN:
      if(isOnTopRow(position)) return moves; // shouldn't be possible once upgrading pawns becomes a thing
      if(!isOnLeftEdge(position) && board[position - 9] !== Piece.EMPTY && canTake(board[position], board[position - 9])) moves.push(position - 9);
      if(!isOnRightEdge(position) && board[position - 7] !== Piece.EMPTY && canTake(board[position], board[position - 7])) moves.push(position - 7);
      if(pawnHasntMoved(position, false) && board[position - 8] === Piece.EMPTY && board[position - 16] === Piece.EMPTY) moves.push(position - 16);
      if(board[position - 8] === Piece.EMPTY) moves.push(position - 8);

      break;

    case Piece.BLACK_PAWN:
      if(isOnBottomRow(position)) return moves; // same deal as above
      if(!isOnLeftEdge(position) && board[position + 7] !== Piece.EMPTY && canTake(board[position], board[position + 7])) moves.push(position + 7);
      if(!isOnRightEdge(position) && board[position + 9] !== Piece.EMPTY && canTake(board[position], board[position + 9])) moves.push(position + 9);
      if(pawnHasntMoved(position, true) && board[position + 8] === Piece.EMPTY && board[position + 16] === Piece.EMPTY) moves.push(position + 16);
      if(board[position + 8] === Piece.EMPTY) moves.push(position + 8);

      break;

    case Piece.WHITE_ROOK:
    case Piece.WHITE_ROOK_CASTLE:
    case Piece.BLACK_ROOK:
    case Piece.BLACK_ROOK_CASTLE:
      moves = moves.concat(
        scan(board, position, pos => pos + 8, isOnBottomRow, edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos - 8, isOnTopRow, edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos - 1, isOnLeftEdge, edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos + 1, isOnRightEdge, edge)
      );

      break;

    case Piece.WHITE_BISHOP:
    case Piece.BLACK_BISHOP:
      moves = moves.concat(
        scan(board, position, pos => pos - 9, (pos) => isOnLeftEdge(pos) || isOnTopRow(pos), edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos - 7, (pos) => isOnRightEdge(pos) || isOnTopRow(pos), edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos + 9, (pos) => isOnRightEdge(pos) || isOnBottomRow(pos), edge)
      );

      moves = moves.concat(
        scan(board, position, pos => pos + 7, (pos) => isOnLeftEdge(pos) || isOnBottomRow(pos), edge)
      );

      break;

    case Piece.WHITE_QUEEN:
    case Piece.BLACK_QUEEN:
      moves = moves.concat(
        GetLegalMoves(board, position, isBlack(piece) ? Piece.BLACK_BISHOP : Piece.WHITE_BISHOP)
      );

      moves = moves.concat(
        GetLegalMoves(board, position, isBlack(piece) ? Piece.BLACK_ROOK : Piece.WHITE_ROOK)
      );

      break;

    case Piece.WHITE_KING:
    case Piece.WHITE_KING_CASTLE:
    case Piece.BLACK_KING:
    case Piece.BLACK_KING_CASTLE:
      if(!isOnTopRow(position)) {
        if(!isOnLeftEdge(position) && canTake(piece, board[position - 9])) moves.push(position - 9);
        if(canTake(piece, board[position - 8])) moves.push(position - 8);
        if(!isOnRightEdge(position) && canTake(piece, board[position - 7])) moves.push(position - 7);
      }

      if(!isOnLeftEdge(position) && canTake(piece, board[position - 1])) moves.push(position - 1);
      if(!isOnRightEdge(position) && canTake(piece, board[position + 1])) moves.push(position + 1); 

      if(!isOnBottomRow(position)) {
        if(!isOnLeftEdge(position) && canTake(piece, board[position + 7])) moves.push(position + 7);
        if(canTake(piece, board[position + 8])) moves.push(position + 8);
        if(!isOnRightEdge(position) && canTake(piece, board[position + 9])) moves.push(position + 9);
      }

      if(!ignoreCastle) {
        const castle = canCastle(board, position);
        if(castle.left) moves.push(position - 2);
        if(castle.right) moves.push(position + 2);
      }

      break;

    case Piece.WHITE_KNIGHT:
    case Piece.BLACK_KNIGHT:
      if(!isOnTopRow(position) && !isOnTopRow(position - 8)) {
        if(!isOnLeftEdge(position) && canTake(piece, board[position - 17])) moves.push(position - 17);
        if(!isOnRightEdge(position) && canTake(piece, board[position - 15])) moves.push(position - 15);
      }

      if(!isOnRightEdge(position) && !isOnRightEdge(position + 1)) {
        if(!isOnTopRow(position) && canTake(piece, board[position - 6])) moves.push(position - 6);
        if(!isOnBottomRow(position) && canTake(piece, board[position + 10])) moves.push(position + 10);
      }

      if(!isOnBottomRow(position) && !isOnBottomRow(position + 8)) {
        if(!isOnRightEdge(position) && canTake(piece, board[position + 17])) moves.push(position + 17);
        if(!isOnLeftEdge(position) && canTake(piece, board[position + 15])) moves.push(position + 15);
      }

      if(!isOnLeftEdge(position) && !isOnLeftEdge(position - 1)) {
        if(!isOnBottomRow(position) && canTake(piece, board[position + 6])) moves.push(position + 6);
        if(!isOnTopRow(position) && canTake(piece, board[position - 10])) moves.push(position - 10);
      }

      break;

    default:
      return [];
  }

  if(includeChecks) {
    const king = findKing(board, isBlack(piece));
    const check = isInCheck(board, king);

      // for some reason typescript throws a fit if i use piece in the filter, so this is a workaround
    const piece_copy = piece;

    const checkMoves = moves.filter(move => {
      // simulate every move and see if we're still in check
      const newBoard = ProcessMove(board, position, move);
      const newKing = findKing(newBoard, isBlack(piece_copy));
      return !isInCheck(newBoard, newKing);
    });

    return checkMoves;
  }

  return moves;
};